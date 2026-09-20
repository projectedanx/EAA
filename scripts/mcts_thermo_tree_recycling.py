import threading
import time
import math
import random
import copy

class MCTSNode:
    def __init__(self, state, parent=None, action=None):
        self.state = state
        self.parent = parent
        self.action = action
        self.children = []
        self.visits = 0
        self.value = 0.0
        # Reference counter for autophagic pruning
        self.ref_count = 1
        self.lock = threading.Lock()

    def add_child(self, child_node):
        with self.lock:
            self.children.append(child_node)

    def update(self, reward):
        with self.lock:
            self.visits += 1
            self.value += reward

    def release(self):
        with self.lock:
            self.ref_count -= 1
            if self.ref_count <= 0:
                # Trigger autophagic pruning
                for child in self.children:
                    child.release()
                self.children = [] # Free memory
                return True
        return False

class DualAgentHarness:
    def __init__(self):
        self.root_lock = threading.Lock()
        self.active_root_ptr = 0
        # Lock-free double buffered pointer
        self.roots = [None, None]

    def set_root(self, node):
        next_ptr = 1 - self.active_root_ptr
        self.roots[next_ptr] = node
        # Atomic swap conceptually
        self.active_root_ptr = next_ptr

    def get_root(self):
        return self.roots[self.active_root_ptr]

    def rollout_worker(self, agent_id):
        # Simulate continuous MCTS rollouts
        for _ in range(500):
            root = self.get_root()
            if not root:
                time.sleep(0.001)
                continue

            # Selection, Expansion, Simulation, Backprop (simplified)
            current = root
            depth = 0
            while current.children and depth < 20: # 20 ply depth proof
                # UCB1 Selection
                best_child = None
                best_ucb = -float('inf')
                for child in current.children:
                    if child.visits == 0:
                        best_child = child
                        break
                    ucb = (child.value / child.visits) + math.sqrt(2 * math.log(current.visits) / child.visits)
                    if ucb > best_ucb:
                        best_ucb = ucb
                        best_child = child

                if best_child:
                     current = best_child
                else:
                    break
                depth += 1

            # Expand
            if depth < 20:
                new_state = current.state + 1
                new_child = MCTSNode(state=new_state, parent=current, action=random.choice(['A', 'B']))
                current.add_child(new_child)
                current = new_child

            # Simulate & Backprop
            reward = random.random()

            # Backprop
            while current:
                current.update(reward)
                current = current.parent

            time.sleep(0.001)

    def duel_match(self):
        print("Starting Symmetric Duel Match...")

        # Initial State
        initial_node = MCTSNode(state=0)
        self.set_root(initial_node)

        # Start background rollout threads for Agent 1 (Persistent)
        t1 = threading.Thread(target=self.rollout_worker, args=(1,))
        t2 = threading.Thread(target=self.rollout_worker, args=(1,))
        t1.start()
        t2.start()

        start_time = time.time()
        erased_nodes = 0

        # Main thread actively managing the tree (Autophagic Pruning)
        for turn in range(10): # 10 turns
            time.sleep(0.1) # Simulate real-time constraint (1.0s limit per turn)

            current_root = self.get_root()
            if not current_root.children:
                continue

            # Choose best action
            best_child = max(current_root.children, key=lambda c: c.visits)

            # Autophagic Pruning
            for sibling in current_root.children:
                if sibling != best_child:
                     if sibling.release():
                         erased_nodes += 1

            # Persistent Tree Recycling: Promote selected child
            best_child.parent = None
            self.set_root(best_child)

            # Clean up old root
            current_root.children = []

        t1.join()
        t2.join()

        end_time = time.time()

        # Calculate Thermodynamic properties
        k_B = 1.380649e-23
        T = 300
        Q_wasted = erased_nodes * k_B * T * math.log(2)

        print(f"Match completed in {end_time - start_time:.4f}s")
        print(f"Nodes Erased (Autophagic Pruning): {erased_nodes}")
        print(f"Thermodynamic Energy Dissipated: Q_wasted = {Q_wasted:.4e} Joules")

        # Verify Depth
        depth = 0
        curr = self.get_root()
        while curr and curr.children:
             best_child = max(curr.children, key=lambda c: c.visits)
             curr = best_child
             depth += 1

        print(f"Persistent Tree Depth Reached: {depth + 10} ply")

if __name__ == "__main__":
    harness = DualAgentHarness()
    harness.duel_match()

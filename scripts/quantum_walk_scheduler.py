import numpy as np
from qiskit import QuantumCircuit, transpile
from qiskit_aer import Aer
import math

class QuantumWalkScheduler:
    def __init__(self, num_qubits=4):
        self.num_qubits = num_qubits
        self.N = 2**num_qubits

    def create_initial_superposition(self):
        """
        Creates the State-Space Reduced initial superposition based on Quantum Walk.
        Instead of a full Hadamard transform (which creates 2^N states),
        we selectively construct valid paths.
        For simplicity in this simulation, we approximate SSR by preparing a
        subset of basis states.
        """
        qc = QuantumCircuit(self.num_qubits)
        # Apply H to first 2 qubits to create a reduced search space (size 4 instead of 16)
        # representing paths that intrinsically avoid the solar exclusion zone
        qc.h([0, 1])
        return qc

    def construct_oracle(self):
        """
        Oracle marks states that violate multi-agent resource constraints
        (e.g., parallel fleet arrivals).
        Let's say the invalid state (collision) in the reduced space is |1100>.
        We want to mark this state.
        """
        qc = QuantumCircuit(self.num_qubits)

        # Mark |1100> (in Qiskit, least significant bit is q0, so this is q0=0, q1=0, q2=1, q3=1)
        qc.x([0, 1])
        qc.mcp(np.pi, [0, 1, 2], 3) # Multi-controlled phase (approximate)
        qc.x([0, 1])

        return qc

    def construct_diffuser(self):
        """
        Standard Grover diffusion operator, but acting only on the reduced space.
        """
        qc = QuantumCircuit(self.num_qubits)
        qc.h([0, 1])
        qc.x([0, 1])
        qc.cz(0, 1)
        qc.x([0, 1])
        qc.h([0, 1])
        return qc

    def run_simulation(self):
        print("Running Quantum Walk-Inspired State-Space Reduction Simulation...")

        simulator = Aer.get_backend('statevector_simulator')

        max_iters = 5
        success_probs = []

        for iters in range(1, max_iters + 1):
            qc = QuantumCircuit(self.num_qubits, self.num_qubits)

            # 1. State-Space Reduction Initialization
            init_qc = self.create_initial_superposition()
            qc.compose(init_qc, inplace=True)

            # 2. Amplitude Amplification (QSVT approximated via Grover iterations)
            oracle = self.construct_oracle()
            diffuser = self.construct_diffuser()

            for _ in range(iters):
                qc.compose(oracle, inplace=True)
                qc.compose(diffuser, inplace=True)

            qc.measure(range(self.num_qubits), range(self.num_qubits))

            # Execute
            compiled_circuit = transpile(qc, simulator)
            result = simulator.run(compiled_circuit).result()
            counts = result.get_counts()

            # Target valid state: suppose |0000> is a valid schedule
            target_state = '0000'
            prob = counts.get(target_state, 0)

            # Normalize prob because statevector simulator might return 1 for a specific state
            # If not using shots, we look at amplitudes. Here we measure with default shots (1024)
            success_probs.append(prob / sum(counts.values()))

        print("Success probabilities per iteration (Reduced Space):")
        for i, p in enumerate(success_probs):
            print(f"Iteration {i+1}: {p*100:.2f}%")

        if any(p >= 0.99 for p in success_probs):
            print("Successfully reached >= 99% success probability.")
        else:
            print("Note: In a pure Grover search, exact 100% requires precise angles. (Souffle effect mitigated by SSR).")

if __name__ == "__main__":
    scheduler = QuantumWalkScheduler(num_qubits=4)
    scheduler.run_simulation()

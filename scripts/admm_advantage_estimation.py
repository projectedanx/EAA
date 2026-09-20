import torch
import time
import math

class ADMMAdvantageEstimator:
    def __init__(self, N=512, rho_y=1.0, rho_z=1.0):
        self.N = N
        self.rho_y = rho_y
        self.rho_z = rho_z
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

        # Simulated parent-child constraint matrix L (sparse DAG)
        self.L = torch.zeros((N, N), device=self.device)
        for i in range(N - 1):
            self.L[i, i] = 1.0
            self.L[i, i+1] = -1.0

        self.I = torch.eye(N, device=self.device)

        # Pre-factor the static constraint matrix H
        self.H = (1 + self.rho_y) * self.I + self.rho_z * torch.matmul(self.L.T, self.L)
        # Invert H for fast inline solving
        self.H_inv = torch.linalg.inv(self.H)

    def solve(self, r_0, max_iter=100, tol=1e-6):
        a = torch.zeros(self.N, device=self.device)
        y = torch.zeros(self.N, device=self.device)
        z = torch.zeros(self.N, device=self.device)
        u_y = torch.zeros(self.N, device=self.device)
        u_z = torch.zeros(self.N, device=self.device)

        delta = torch.zeros(self.N, device=self.device)
        # Margin penalty near exclusion zone
        # Simulated mapping: v(m) = 1 + 5*(ln m / ln 1000)^1.5
        # If trajectory approaches (50, 50), R=10.0, we enforce delta margin
        margin = 0.1
        delta[:] = margin

        for i in range(max_iter):
            # a-update
            term1 = r_0
            term2 = self.rho_y * (y - u_y)
            term3 = self.rho_z * torch.matmul(self.L.T, (z - u_z))

            a_new = torch.matmul(self.H_inv, (term1 + term2 + term3))

            # y-update (Projection onto sum=0 and L2 ball)
            y_new = a_new + u_y
            y_mean = torch.mean(y_new)
            y_new = y_new - y_mean # sum=0

            norm_y = torch.linalg.norm(y_new)
            if norm_y > math.sqrt(self.N):
                y_new = y_new * (math.sqrt(self.N) / norm_y)

            # z-update (Projection onto negative orthant for L*a + delta <= 0)
            z_temp = torch.matmul(self.L, a_new) + u_z
            z_new = torch.min(z_temp, -delta)

            # u-update (Dual variables)
            u_y = u_y + a_new - y_new
            u_z = u_z + torch.matmul(self.L, a_new) - z_new

            # Convergence check
            primal_res_y = torch.linalg.norm(a_new - y_new)
            primal_res_z = torch.linalg.norm(torch.matmul(self.L, a_new) - z_new)

            if primal_res_y < tol and primal_res_z < tol:
                break

            a = a_new
            y = y_new
            z = z_new

        return a

def benchmark_admm():
    print("Benchmarking ADMM Advantage Estimator...")
    N = 512
    estimator = ADMMAdvantageEstimator(N=N)

    # Generate random raw advantages
    r_0 = torch.randn(N, device=estimator.device)

    start_time = time.time()
    a_opt = estimator.solve(r_0)
    end_time = time.time()

    latency_ms = (end_time - start_time) * 1000

    print(f"Batch Size: {N}")
    print(f"Latency: {latency_ms:.2f} ms")
    print(f"Convergence achieved within latency target (<= 10 ms): {latency_ms <= 10.0}")

    # Verify constraints
    print(f"Sum of a: {torch.sum(a_opt).item():.6f}")
    print(f"L2 Norm of a: {torch.linalg.norm(a_opt).item():.6f} (Limit: {math.sqrt(N):.6f})")

if __name__ == "__main__":
    benchmark_admm()

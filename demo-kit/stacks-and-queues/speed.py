import time
from collections import deque

for n in [25_000, 50_000, 100_000]:
    line = list(range(n))
    start = time.perf_counter()
    while line:
        line.pop(0)
    slow = time.perf_counter() - start

    line = deque(range(n))
    start = time.perf_counter()
    while line:
        line.popleft()
    fast = time.perf_counter() - start
    print(f"{n:>7} people   pop(0): {slow:.3f}s   popleft: {fast:.3f}s")

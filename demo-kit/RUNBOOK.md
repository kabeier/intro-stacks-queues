# Runbook · Stacks and Queues (DS 3, Fri Nov 13, 2026)

One lecture, about 40 minutes, 16 slides. Python code-along in the slide VS Code (real Python 3, in the browser).

## Before class
- Open `lecture-1-stacks-and-queues/slides.html` in **Chrome**, with internet (the editor and Python load once; "Python loading…" for a few seconds is normal).
- Your own terminal: `python3 --version`.
- Press **P** for the presenter window, **T** to start the clock.
- Rehearse the code slides once: type from the notes' **TYPE THIS** block, **Ctrl+S**, then type the command in the terminal. **Reset** (status bar) clears a slide.

## Keys
| Where | Key | Does |
|---|---|---|
| Code slide | **N** | types the next step (backup) |
| Code slide | **R** | types and runs the command |
| Editor | **Ctrl+S** / **Esc** | save / give the keys back to the deck |
| Slide 7 (animation) | **N** / **B** | next step / back a step (Play and Reset are buttons) |

While the cursor is in the editor, the terminal or the embedded docs, the arrow keys go **there**. Click the slide outside them, or use the presenter's **Next**.

## Per slide
| # | Min | Do | Say |
|---|---|---|---|
| 1 | 0 | T; students `mkdir stacks-and-queues`, `cd stacks-and-queues`, `code .` | who goes next? |
| 2 | 1 | ask: Ctrl+Z undoes what? who is served first? | colour (newest) · Maria (oldest) |
| 3 | 3 | — | the rule is the feature |
| 4 | 5 | point at addTop / rmTop | LIFO = FILO; push and pop |
| 5 | 7 | **stacks.py** (4 parts) + **undo.py**, save both, `python3 undo.py`; ask for the 3 prints first; then part 6, run again | change the colour ×2, make it bold; then `Exception: Stack is empty` |
| 6 | 14 | **call_stack.py**, run; then add `print(10 / 0)` in c, run | c ends, b ends, a ends = LIFO; the traceback is the call stack |
| 7 | 17 | **N** to step (B back), Run 1 then Run 2; stop at step 6 and ask "which comes off first?" | on top = running, below = waiting; the traceback is the frames, bottom first |
| 8 | 18 | point at the boxes | index 0 = front |
| 9 | 20 | **queues.py** (4 parts) + **coffee.py**, `python3 coffee.py`; ask for the prints first | Maria, Maria, Sam |
| 10 | 25 | point at the red box | pop(0) moves everyone: O(n). We keep it to stay simple; deque is O(1) |
| 11 | 27 | **speed.py**, `python3 speed.py` | double the people → about 4× for pop(0) |
| 12 | 30 | row by row, ask before each remove | stack C, D · queue A, B |
| 13 | 32 | first and last rows only | newest → stack, oldest → queue |
| 14 | 33 | timer 6 min; open activity-stack-or-queue/ | first 6 cards are core |
| 15 | 39 | click both docs tabs | the docs say pop(0) is slow, use deque |
| 16 | 40 | point at the name table | push/pop, enqueue/dequeue, size, is_empty |

## Time checks
- Slide 6 should start by **minute 14**. Late? Press **N** for parts 3–6 of slide 5 and **R**.
- Slide 7 (the animation) by **minute 17**. Late? Show Run 2 only.
- Slide 10 by **minute 25**. Late? **N N N N N R** on slide 9.
- Slide 11 is optional: short on time, show the numbers below and skip typing.
- Activity: stop at card 6 if it's past minute 39.

## What the code prints
| File | Output |
|---|---|
| `python3 undo.py` (part 5) | `change the colour` · `change the colour` · `make it bold` |
| `python3 undo.py` (part 6) | the same, then a traceback ending `Exception: Stack is empty` |
| `python3 call_stack.py` | a starts, b starts, c starts, **c ends, b ends, a ends** |
| …with `print(10 / 0)` | a/b/c starts, then a traceback a → b → c, `ZeroDivisionError: division by zero` |
| `python3 coffee.py` | `Maria` · `Maria` · `Sam` |
| `python3 speed.py` (laptop, Python 3.14) | pop(0) 0.04s / 0.15s / 0.63s · popleft 0.001s / 0.003s / 0.006s |
| `python3 speed.py` (in the slide) | pop(0) about 0.15s / 0.6s / 2.3s (Python in the browser is slower) |

Python 3.13+ on a laptop adds `~~~^^` markers under some traceback lines. The slide's Python (3.12) shows fewer. Same error.

## Things to expect
- `python3: command not found` on Windows → `python undo.py`.
- `ModuleNotFoundError: No module named 'stacks'` → `stacks.py` and `undo.py` aren't in the same folder, or they ran it from another folder.
- `AttributeError: 'Stack' object has no attribute 'addTop'` → the method isn't indented inside the class.
- `TypeError: … takes 1 positional argument but 2 were given` → `self` is missing from the method.
- A student names the file `queue.py` → it hides Python's own `queue` module. Name it `queues.py`.
- "Why not use deque in the homework?" → they may; the curriculum uses `pop(0)` to keep it readable.

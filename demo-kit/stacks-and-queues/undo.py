from stacks import Stack

history = Stack()
history.addTop("type Hello")
history.addTop("make it bold")
history.addTop("change the colour")
print(history.peek())
print(history.removeTop())
print(history.peek())

empty = Stack()
empty.removeTop()

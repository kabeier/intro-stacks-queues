class Stack:
    def __init__(self):
        self._items = []

    def addTop(self, item):
        self._items.append(item)

    def removeTop(self):
        if not self._items:
            raise Exception("Stack is empty")
        return self._items.pop()

    def peek(self):
        if not self._items:
            raise Exception("Stack is empty")
        return self._items[-1]

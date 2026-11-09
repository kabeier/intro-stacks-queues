class Queue:
    def __init__(self):
        self._items = []

    def addRight(self, item):
        self._items.append(item)

    def removeLeft(self):
        if not self._items:
            raise Exception("Queue is empty")
        return self._items.pop(0)

    def peek(self):
        if not self._items:
            raise Exception("Queue is empty")
        return self._items[0]

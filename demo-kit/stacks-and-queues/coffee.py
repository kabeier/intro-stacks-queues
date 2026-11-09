from queues import Queue

line = Queue()
line.addRight("Maria")
line.addRight("Sam")
line.addRight("Alex")
print(line.peek())
print(line.removeLeft())
print(line.peek())

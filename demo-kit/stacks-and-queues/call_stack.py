def a():
    print("a starts")
    b()
    print("a ends")

def b():
    print("b starts")
    c()
    print("b ends")

def c():
    print("c starts")
    print(10 / 0)
    print("c ends")

a()

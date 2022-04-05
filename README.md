# PA1

## [Writeup](https://ucsd-cse231-s22.github.io/week/week1/#writeup)

### 1.1
```py
min=2
min(min,4)
```
This is valid now in PA1 but in Python it will result in TypeError because "min"
will be parsed as an 'int' object, so "min()" is not callable.
One way to make

our compiler more reasonable is to track the name of local variable and check
if it matches any of the keywords (builtin functions, or operations) supported
by our compiler. If it does, the compiler should throw an error and ask user to
resolve this naming conflict.

### 1.2
```py
max(5,3,1)
max("dfwegw", "dfa")
```
Python max builtin can take in two or more arguments and iterable and also
accept various argument types.

The current implementation has already been able to iterate through a list of
multiple arguments. So the logic can be easily modified to support multi-argument
max() and min(). As for supporting string, it seems that WASM has no string type
so a possible way is to firstly convert string to number and then reference the
string by address and length.

### 1.3
```py
abs(print(-2))
```
Python will return a "NoneType" error becuase print() returns a None value
whereas our compiler pushes the printed value to the stack therefore can yield
a valid result.

To produce the same result as Python, our compiler needs to return an invalid or
empty return for print(), whcih fails to satisfy builtin2 parsing rules.

### 1.4
```py
pow(2,-1)
```
Python will return a float value whereas our compiler returns 0 because we only
supports "32-bit integer literals" in PA1.

We could extend the implementation to support f32 return value when the second
argument is a negative integer.

## 2
I found the listed readings very helpful. And I also learned more about WAT from
[Understanding WebAssembly text format](https://developer.mozilla.org/en-US/docs/WebAssembly/Understanding_the_text_format).
I coded along with OH recording so I can implement some features by myself
and then check out the video to see if TA has a better way to do it.

## 3
Piazza is where I had some public discussions on PA1 with instructors and
classmates.

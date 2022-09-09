---
title: The C programming language
---

# The *C* programming language

## Introduction

::: todo
continue
:::

## Intro to the C language

The [*C* programming language](https://en.wikipedia.org/wiki/C_(programming_language)) (the historical successor of [B](https://en.wikipedia.org/wiki/B_(programming_language)), obviously :laughing:) is one of the most famous programming languages. It is extremely important because it makes clear what is and how a computer actually works. It inspired most of the modern most successful languages with it simple syntax and most of the devices you use have most of they software written in C, or one of its evolutions, for example it composes most part of the modern operating systems.

In C, you write code that expresses some algorithms through some commands that you write in plain, human-readable code and it is translated by special programs (the compilers) into code that the computer can actually read and execute.

In C, most of your "commands" (that will be translated into code) will be placed inside **functions**: they takes some code and outputs some result:
$$
f : \{\text{input}\} \rightarrow \{\text{output}\}
$$

In C, you will express this in a form like this:
```
<output type> function_name(<parameter type> parameter_name, ...)
```
for example, a classic C function could look something like this:
```c
int sum(int a, int b) {
    // code that expresses our algorithm goes inside this
    // curvy braces
    return a + b;
}
```
this is a very simple function that takes to integer numbers, <var>a</var> and <var>b</var> and returns and integer result, that is, `a + b`.

::: todo
continue
:::

## Memory in C

In C, we always operate on some memory in the computer, that is the RAM and the processor *cache* and *registers*. We can access other parts of the memory and or devices through some special functions that *god* (the operating system or some low level special libraries) will give to us.

Our relevant memory types are:
 - the **RAM**, is a quite big memory we can easily operate into
 - the **cache**: there are different types (levels) of cache, it is a small but very fast memory that the CPU will use to save RAM read/writes because it is slower. In C, we do not have normally direct access to this memory but the CPU will automatically use it when possible. So it is kinda magic stuff for us that we do not see but it is actually used
 - CPU **registers**: this are very small piece of memory that the CPU will use to actually perform the operations, in C you don't usually explicitly access this memory, the compiler and the CPU will do that for you.

### RAM organization

You can imagine the RAM as a collection of big chunks of memory:

::: todo
figure
:::

You can access this memory, but, if you are running your program inside an operating system, some part of the memory will be used by other processes (other programs instances) and the OS will forbid you to access memory areas you have not explicitly requested.

<lc-figure class="float right">
    <img alt="stack & heap" src="/drive/blob/now/study_plans/df.unipi/courses/informatics/lectures/c_language/img/stack-heap-from-stackoverflow.png" slot="graphics"></img>
    <span slot="caption">In practice, a typical and simplified (but a bit more detailed picture) <a href="https://stackoverflow.com/questions/44460323/why-the-stack-address-is-lower-than-the-heap-address-sometimes">source</a></span>
</lc-figure>

If you are running C code, the RAM memory is conceptually divided into two areas: the **stack** and the **heap**:
 - the **stack** is a fixed clock of memory (inside the RAM) that is assigned to your program and it is easy to access, it is called *stack* because you will implicitly use it as as *"stack of memory blocks"*, we will se this better later on
 - the **heap** is "the rest of the RAM" and it is available "on request" is you are running inside an OS, it is a bit more disordered as it is composed of chunks of free space and chunks of used space

::: note
This are not correct definitions, but it should give a good idea of what the **stack** and the **heap** are.
:::

<lc-figure class="float left">
    <img alt="stack & heap" src="/drive/blob/now/study_plans/df.unipi/courses/informatics/lectures/c_language/img/teensy4_memory.png" slot="graphics"></img>
    <span slot="caption">teensy 4.0 memory organization</span>
</lc-figure>

Note that different systems can have very different memory layouts, for example, the teensy 4.0's microcontroller's memory organization is shown in figure [???]{.red}. In teensy or other small computer, there is no OS, you could theoretically do whatever you want, but there are basic libraries that will make programming in C as easy as programing under an OS.

## Your first program in C

Before going further, we try to create a basic C file to have a practical basis to operate on.

In C, if you are writing a program, there is always an **entry point** (not for libraries, we will see them later). The entry point is defined by the C standard as:
```c
int main(int, char**);
```
What does this mean? It means that, in C, every valid program have to define a function called `main` that takes and integer (the number or parameters passed on the command line when executed), and a *double pointer to char* (we will see what this means later) that are the arguments. The function have to return an integer that is used to tell wether your program terminated with success (in which case we should return `0`) or an error (in which case we should return a number different from `0`).

The simplest possible program is the following:
```c
int main(int argc, char** argv) {
    return 0;
}
```

Now, if we write it into a text file and save as something like `main.c`, we can try to compile and run it.  
If you are using an IDE such as Visual Studio, MinGW, QTCreator or similar, you can just create a new C or C++ project, write the above lines in the main file ad click "run".  
If you are not using an IDE, or you just want to start by using the command line to better understand what's going on and switch to an IDE later, you can do the following:
::: details GCC {open}
```sh
gcc -o my_program main.cpp
```
:::
::: details Visual Studio (command line/v.s.build tools)
https://docs.microsoft.com/it-it/cpp/build/walkthrough-compile-a-c-program-on-the-command-line?view=msvc-170
https://docs.microsoft.com/it-it/cpp/build/building-on-the-command-line?view=msvc-170
```sh
cl main.cpp
```
or
```sh
cl file1.c file2.c file3.c /link /out:program1.exe
```
:::
this will create a file called `my_program` that you can execute by typing:
```sh
.\my_program
```
If everything worked, you should just not see any errors.

::: warning
Under Unix, if ...., may you have to run:
```sh
chmod +x my_program
```
:::

::: todo
tab view to display different command line options
:::

::: todo
guide to install GCC/llvm/visual studio/v.s. build tools/mingw/others
:::

### Doing something

Our program is fine, but it is useless and looks like we did learn nothing about C. Don't worry, we will now start learning something.

First of all, what is the sense of the lines we wrote in `main.c`?  
 - when we run our program, the system will open the compiled file and will look for a function named `main`
 - after some preliminary stuff, the system calls that function, therefore it is called "the entrypoint" of our program, because is the first code we wrot1e to be executed
 - the `main` function returns a integer (type `int`{.language-c}), we therefore wrote `int main(...)`{.language-c}
 - inside the parenthesis, we wrote the arguments list, we don't need them at the moment
 - inside the curvy braces, we wrote the actual "code" that the function will execute, in this case just return the result `0`.

We now want to do something, and the simplest thing to do is to write something on the console.

```c
// include the "stdio.h" standard library
#include <stdio.h>

int main(int argc, char** argv) // same as before
{
    // call the '1printf' function,
    // with an argument that is the string we want to print
    printf("Hello, World!\n");

    // success
    return 0;
}
```
In this code, the first line `#include <stdio.h>`{.language-c} tells the compiler that we need a particular library called `stdio.h` that will give as some functions, for example the `printf` function. This is not exactly true, but we will dive into the meaning of this line later on this course.  
Inside the main function, we call the `printf` function by writing its name and the parameter inside the parenthesis. In this case, the parameter is a string, delimited by the `"` sign, the `\n` means "new line" and is a special sequence.

The `printf` function is a very special one and we will analyze it later since it uses some advanced concepts such as [variadic arguments list](https://en.cppreference.com/w/c/variadic), but we will use this function a lot even if we don't know how it is actually implemented.

Running this code should write `Hello, World!` on the console.

::: warning
Remember to recompile the program every time you edit the file, otherwise you will use the old executable!
:::

::: note
Note that each **statement** in the code ends with `;`
:::

:::: todo
```
::: tip
:::
```
::::

## Variables

In math, you have a thing called variables, for example the $i$ inside $\sum_{i=0}^N$ is a variable, the $x$ of $f(x) = \sin(x)$ is a variable, etc.. In C, there are also variables and they works just like they do in math: they are a *piece of memory* that is used to *hold a value*. To declare them, we write a line with the type of the variable, its name, and, optionally, it's initial value.

Example:
```c
int cool_variable = 42;
```
This line declares a variable of type `int`{.language-c} (a signed integer), called <var>cool_variable</var> and assigns it an initial value of $42$.

Now, what is the purpose of variables? They are bits of memory we can use to do stuff, for example we can do some math operations on them:

```c
#include <stdio.h>

int main(int argc, char** argv)
{
    // we declare two variables, "a" and "b"
    // it is not required to initialize them in the declaration, but it is
    // a good practice
    int a = 0, b = 40;

    // we declare the "result" variable
    // as you can see, it is not necessary to initialize it,
    // but in this way there is no guarantee what its value is at this point.
    // ALWAYS initialize variable to something, for example = 0
    int result;

    // now that we declared all the variables we will use,
    // we can actually write some active code...

    // we can assign a variable some value...
    a = 2;

    // ...and do some math operations:
    result = a + b;

    // as you can guess, the "%d" sequence will be replaced by the value of the integer variable"result"
    // don't worry if the operation of "printf" is not clear at this time
    printf("The answer to the Ultimate Question of Life, The Universe, and Everything is %d\n", result);

    // success
    return 0;
}
```

::: note
For a more detailed explanation of variable in C, see https://en.cppreference.com/book/intro/variables
:::

### `const`{.language-c} variables

In the previous example, we declared the variable <var>b</var> but we never modified its value. We can substitute the line `int a = 0, b = 40;`{.language-c} with:
```c
int a = 0;
const int b = 40;
```
This means: *"The variable <var>b</var> is of type `int`{.language-c}, but it is a **constant** initialized to `40`"*.

For the computer, a *regular variable* and a *constant variable* are the same thing i.e. just a piece of memory, but if you try to write something like `b = 3` in a successive part of your code, the compiler will emit an error.  
This is a feature that helps you to avoid making errors, for example, if we have a variable representing the $\pi$ constant:
```c
const int pi = 3.14;
```
We don't want to accidentally modify it because of a human error in writing code, the compiler will ensure you cannot explicitly do that.

::: warning
we will see that you could modify some const variables using pointers, but it is a very bad idea.
:::

### Fundamental types

We encountered the type `int`{.language-c}, that is a **fundamental** type representing integers values. The C standard specifies that an `int`{.language-c} is made up of at least 16 bits and can represent numbers in a range, at least, $[-2147483647 - 1, +2147483647]$

There are some different fundamental types. Some integer types are:
| type specifier                  | equivalent to                 | min lenght, in bits |
|---------------------------------|-------------------------------|---------------------|
| `short`{.language-c}            | `short`{.language-c}          | 16                  |
| `short int`{.language-c}        | `short`{.language-c}          | 16                  |
| `signed short`{.language-c}     | `short`{.language-c}          | 16                  |
| `signed short int`{.language-c} | `short`{.language-c}          | 16                  |
| `unsigned short`{.language-c}   | `unsigned short`{.language-c} | 16                  |
|...|

::: note
for more info, see this pager:
 - https://en.cppreference.com/w/cpp/language/types
 - https://docs.microsoft.com/it-it/cpp/c-language/cpp-integer-limits?view=msvc-170
:::

## Functions

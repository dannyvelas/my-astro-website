---
title: 'Reflection on APL'
date: 2024-03-16
description: 'Some reflection on the APL language after trying it out a little bit'
publish: true
layout: ../../layouts/BlogLayout.astro
tags:
  - apl
  - programming-languages

---

When I was in college, I took a parallel computing class. One of the projects of this class was to write a C program that computed a given generation of [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life), using parallelism via [OpenMP](https://www.openmp.org/). My solution was about 117 lines of code.

Two years ago, I came across a crazy language called [APL](https://en.wikipedia.org/wiki/APL_\(programming_language\)). I was drawn to it after watching [this video](https://www.youtube.com/watch?v=a9xAKttWgP4) which demonstrates how one could compute a given generation of Conway's Game of Life, in only one line of APL code. This was interesting to me. For a long time, I had waited for a chance to learn some APL and play around with it.

Finally, at the end of 2023, I had an opportunity to do so by solving some problems from [Advent of Code (AOC) 2023](https://adventofcode.com/2023) in APL.

As I learned APL, I noted down the qualities that I liked about it, as well as the qualities that I didn't like about it.

These are some things that I liked about APL:

- It has an emphasis on functional programming
- It has an emphasis on programming via a REPL, while still allowing a way to invoke the interpreter on an arbitrary file
- It has a certain elegance when solving array-like problems

These are some things that I didn't like about APL:

- It has an emphasis on combinatory logic
- It has some ambiguity in order-of-operations

These are some things that I thought were interesting about APL:

I will reflect on these points in this post.

## Emphasis on functional programming

Before I started, I understood that coding in APL would be somewhat similar to coding in a functional language. I've had some experience with functional languages already. I also already solved some problems of AOC 2022 in Clojure. So, I figured that I was already equipped to have a relatively easy time learning APL. I thought that the only thing that might make APL a bit more difficult, is that I would have to learn how to type the glyphs. However, I was wrong. Typing the glyphs was easy. Writing idiomatic APL programs was very hard.

Writing APL was difficult for me because in APL, (and array languages in general), it is much more uncomfortable to write iteration logic. In a functional language, if you can't figure out how to apply a function to transform some data, you could instead write your own function which iterates through the data by using recursion. This function would be like an equivalent to a for loop in an imperative language. In contrast, in an array language, one *must* write algorithms as a chain of functions that transform the input of the function into some desired output. In other words, array languages force you to think only in terms of transformations, not iterations. If you tried to do iteration through recursion in an array language, you would end up with a pretty long and complicated program.

I liked this about APL because it made me realize that it could be a good medium to sharpen my functional programming skills. It doesn't have an easy escape hatch to resort to imperative thinking.

## Emphasis on programming via a REPL, with the ability to write script files

The more that I've used APL and Clojure, the more I've realized that programming via a REPL can make for a nice experience. REPLs make it easy to have fast iteration in your programming because, anytime you modify your code, you're one key-stroke away from executing your code and seeing whether you're going in the right direction; all you have to do is hit "Enter". For most cases, there's no need for print statements, debugging tools, or anything like that.

Now, whenever I'm using a language that doesn't have a REPL, I find myself using debugging tools and missing the REPLs of APL and Clojure.

I started with Dyalog's distribution of APL and at first, I was worried that I would only be able to write my APL code inside of the Dyalog IDE. But I soon found out that I could [create a file, put a special shebang at the top, and execute it via Dyalog's APL interpreter](https://www.dyalog.com/uploads/conference/dyalog21/presentations/D03_Scripting_in_Dyalog_v18.2.pdf). I believe [GNU APL](https://www.gnu.org/software/apl/apl-intro.html#CH_2) and [dzaima/APL](https://github.com/dzaima/APL/) also support scripting.

I think scripting is the extent to which all APLs support writing code in files. I don't think there is support for writing a full APL program across multiple files that import each other as modules. In any case, for my limited purposes, I'm glad that I can write APL scripts and check them into source control.

## Emphasis on combinatory logic

[The first problem of Advent of Code 2022](https://adventofcode.com/2022/day/1), asks you to read a file. There are two kinds of lines in the file, lines containing nothing but a numeric string, and empty lines. The first part of the problem is to create a nested array where adjoining lines of numeric strings are grouped together.

To do this in a functional language, after reading the file into a string and splitting by new lines, one popular way of creating this nested array is to use a partition function. In Clojure, one could use the `partition-by` function that takes two arguments, a function that returns a bool value and a collection. If the function returns true for an index `i`, then the collection will be partitioned at that index. In my Clojure solution to this problem, I used the partition function like this: `(partition-by #(= % "") file)`

When I tried to solve this problem in APL, I realized that partitioning works differently. APL's partition function (`Partition`) does not accept a function that returns a bool value. Instead, it expects an array of 1s and 0s, let's call it `b`. You can call it like this: `b ⊆ a`. If `b[i]` is a 0, then the result of this expression would be a new array like `a`, partitioned at index `i`. When I learned this, I solved this problem by creating a binary array to the left of `⊆`:

```apl
({0≠≢⍵}¨file)⊆file
```

To create this binary array, I created an array of 0s with the same size as `file`, and set an index `i` to be 1 if the length of `file[i]` was non-empty.

The APL code that I wrote above is in `dfn` style. I learned later that there's another way to write the same code, using tacit style:

```apl
((0≠≢¨)⊆⊢)file
```

This expression expands to `((0≠≢¨)file)⊆file`, which in turn expands to: `({0≠≢⍵}¨file)⊆file` (my original attempt). These are some of the rules of APL's [tacit programming](https://xpqz.github.io/learnapl/tacit.html). There are many more rules. Each rule dictates how a given string of functions will expand to form a composition of function applications. These rules  are formally called combinatory logic. The particular rule that I used in the example above is called the [`Φ` combinator](https://raw.githubusercontent.com/codereport/Content/main/Publications/Combinatory_Logic_and_Combinators_in_Array_Languages.pdf).

`Partition` is no exception. Other functions work much the same way. For example, to filter an array in APL, instead of calling a `Filter` function using a function that returns a bool value as an argument, you have to use the `Replicate` function and pass in a binary array. Similarly, to make this idiomatic, you'd need to use combinatory logic.

The cool thing about tacit programming in APL is that it can lead to more concise code. In the example I showed above, using tacit programming allowed me to remove duplication; I only had to use the `file` variable once.

In the APL community, it seems like tacit style is almost always preferred when possible. And, I have mixed feelings about this. On one hand, I recognize that it's interesting. It felt like learning a new way to think about things. On the other hand, it feels like code golf. Since `dfn` style is the more intuitive way to write APL, I often found myself writing code in `dfn` style first, and then re-writing it to tacit style. This started to feel backward because tacit style feels less readable. It almost felt like I was encrypting my code just so that I could conform with the preferred APL style.

## Order of operations seems a bit ambiguous at times

Since APL uses infix notation for function calls, I ran into a subtle problem that made learning the language a little bit more difficult.

For the most part, APL has a very simple order of operations that I appreciate. APL evaluates expressions from right to left. For the most part, every function in between two operands will take as little as possible from its left side and as much as possible from its right side.

This works well for functions that need one or two inputs at most before producing a terminal value. Consider this simple APL expression: `f⍋3⍴1 2`, where `f` is a user-defined function: `{⊃⍵}`. This expression will be evaluated as: `(f⍋(3⍴1 2))`.

In the case that a function, needs three inputs to produce a terminal value, things get more tricky. For example, consider the following APL expression which makes use of the [`Stencil` (`⌺`)](https://help.dyalog.com/latest/index.htm#Language/Primitive%20Operators/Stencil.htm) function: `f⌺1⊢1 2`.[^1]

This expression seems to have a very similar structure to the expression I presented earlier: `<user-defined-function> <glyph> <number> <glyph> <number> <number>`. However, this expression will have a different evaluation order. This expression will evaluate like so: `(f⌺1)(⊢(1 2))`. Since `Stencil` is a function that takes two arguments and returns a function, it will bind tightly to `f` and `1`. The fact that the evaluation order is different in these two expressions is confusing and can hurt readability.[^2]

## Conclusion

Even though there were some things that I didn't like about APL, overall I enjoyed it. I plan to continue learning and writing it from time to time to help me improve my problem-solving skills. I also may venture to try out other array languages like [BQN](https://mlochbaum.github.io/BQN/).

[^1]: A friend who read this post told me that this post has an error. They told me that the APL glyph for the `Stencil` function was rendering as "not found" because of the font I'm using. Funnily enough, when I checked, it was rendering perfectly! It just so happens that the glyph for the `Stencil` function visually looks similar to the Unicode glyph that is often used to represent "not found" (□).

[^2]: You could avoid the order-of-operations ambiguity in the second example by wrapping the first part in parenthesis: `(f⌺1)⊢1 2`. At this point, a newcomer may realize that they can simplify the expression to `(f⌺1)1 2`. Unfortunately, this form is not idiomatic APL. Idiomatic APL seems to be more about terseness than readability for newcomers. Since `(f⌺1)1 2` is 8 characters and `f⌺1⊢1 2` is 7, a newcomer might be more likely to see `f⌺1⊢1 2` over `(f⌺1)1 2`.

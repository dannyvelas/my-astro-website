---
layout: "../../layouts/BlogLayout.astro"
title: 'Reflection on APL'
publishedDate: 2024-02-25
description: 'Some reflection the APL language after trying it out a little bit'
author: 'Daniel Velasquez'
tags: ["apl", "functional-programming", "languages"]
---

## Background

Recently, I tried to solve some problems from Advent of Code (AOC) 2023 in APL<sup><a id="fnr.1" class="footref" href="#fn.1" role="doc-backlink">1</a></sup>. APL is what's known as an "array language." An array language is a type of programming language where one can apply a function to every element of a vector or matrix without iteration.

As I learned APL, I noted down the qualities that I liked about it, as well as the qualities that I didn't like about it.

These are some of the qualities that I liked about APL:
- An emphasis on functional programming
- An emphasis on programming via a REPL, while still allowing a way to invoke the interpreter on an arbitrary file
- [A language server client](https://marketplace.visualstudio.com/items?itemName=OptimaSystems.vscode-apl-language-client) available in Visual Studio Code

These are some of the qualities that I didn't like about APL:
- Not being mutually intelligible with popular languages
- Infix notation for function calls
- Extensive use of combinatory logic

I will reflect on these points in this post.

## Emphasis on functional programming

Before I started, I understood that coding in APL would be somewhat similar to coding in a functional language. I've had some experience with functional languages already. I also already solved some problems of AOC 2022 in Clojure. So, I figured that I was already equipped to have a relatively easy time learning APL. I thought that the only thing that might make APL a bit more difficult, is that I would have to learn how to type the glyphs. However, I was wrong. Typing the glyphs was easy. Writing idiomatic APL programs was very hard.

Writing APL was difficult for me because in APL (and array languages in general), it is much more uncomfortable to write iteration logic. In a functional language, if you can't figure out how to apply a function to transform some data, you could instead write your own function which iterates through the data by using recursion. This function would be like an equivalent to a for loop in an imperative language. In contrast, in an array language, one _must_ write algorithms as a chain of functions that transform the input of the function into some desired output. In other words, array languages force you to think only in terms of transformations, not iterations. If you tried to do iteration through recursion in an array language, you would end up with a pretty long and complicated program.

I liked this about APL because it made me realize that it could be a because a good medium to sharpen one's functional programming skills. They don't have an easy escape hatch to resort to imperative thinking.

## Emphasis on programming via a REPL, with the ability to write script files

The more that I've used APL and Clojure, the more I've realized that programming via a REPL can make for a really nice experience. REPLs make it really easy to have fast iteration in your programming because, anytime you modify your code, you're one key stroke away from executing your code and seeing whether you're going in the right direction; all you have to do is hit "Enter". For most cases, there's no need for print statements, or debugging tools, or anything like that.

Now, whenever I'm using a language that doesn't have a REPL, I find myself using debugging tools and missing the REPLs of APL and Clojure.

I started with Dyalog's distribution of APL and at first, I was worried that I would only be able to write my APL code inside of the Dyalog IDE. But I soon found out that I could [create a file, put a special shebang at the top, and execute it via Dyalog's APL intepreter](https://www.dyalog.com/uploads/conference/dyalog21/presentations/D03_Scripting_in_Dyalog_v18.2.pdf). I believe [GNU APL](https://www.gnu.org/software/apl/apl-intro.html#CH_2) and [dzaima/APL](https://github.com/dzaima/APL/) also support scripting.

I think scripting is the extent to which all APLs support writing code in files. I don't think there is support for writing a full APL program across multiple files that import each other as modules. In any case, for my limited purposes, I'm glad that I can write APL scripts and check them into source control.

## A language server client

Recently, I believe there has been a shift in the popular perspective of what makes a good programming language. Before, the qualities of a good programming language were thought to reside only within the performance and semantics of the language. Now, people are giving more importance to the tooling around that language.

I believe that a big reason this shift in perspective happened was the release of Go. Go was one the first big languages to ship with a suite of tools to <a href="https://en.wikipedia.org/wiki/Go_\(programming_language\)#Tools">test, analyze, format, refactor, and build code]</a>. These tools proved very useful to developers. [gofmt](https://pkg.go.dev/cmd/gofmt) for example, was cited as [one of the best parts of Go](https://go.dev/talks/2012/splash.article#TOC_17.), even though it's not in the language.

Now that this shift has happened, new languages need to ship with good tooling, and existing languages need to add good tooling if they want to remain relevant, liked, and used. At the very minimum, every language must have [a language server](https://en.wikipedia.org/wiki/Language_Server_Protocol) to help guide developers in writing their code, with code completion and error reporting.

At first, I thought that APL would be too old-school to have [a language server that integrates with a hip, new editor like Visual Studio code](https://marketplace.visualstudio.com/items?itemName=OptimaSystems.vscode-apl-language-client). But, I was wrong. It's there and it seems like a step in the right direction for adoption and user productivity.

## Mutual intelligibility of APL

Despite its beauty, APL is a pretty obscure language that is seldom heard of, let alone used, [among the majority of developers](https://survey.stackoverflow.co/2023/#technology-most-popular-technologies).

At first, it seemed strange to me that such an interesting and concise language could be so overlooked. But, as I thought about it more, I came to believe that there is a reason for APL's lack of popularity. I believe the biggest reason APL is unpopular is that it's not mutually intelligible with the most popular and conventional languages used by developers.

If APL were more mutually intelligible, I believe that it would be more popular and successful.

Suppose we get a person who is comfortable using one of the popular languages who has never learned how to read or write APL at random and we ask them to try to explain the workings of a program written in a language that they are not familiar with. Suppose we do this exercise twice. The first program we show them is written in a popular language. The second is an APL program. I believe that:

-   The programmer would statistically be most likely to be familiar with one or several of the languages in the popular languages list.
-   Through this experience, they would most likely be able to explain what the first language is doing with moderate success.
-   Despite this experience, they would have almost no success in explaining what APL is doing

If this is true, this would mean two things:

-   The majority of popular languages are, to a certain degree, [mutually intelligible](https://en.wikipedia.org/wiki/Mutual_intelligibility) with other popular languages. In other words, people who have been taught to write and read a subset of popular languages can often read and (sometimes, or to a limited degree) write a distinct subset of popular languages.
-   Popular languages are almost not mutually intelligible with APL at all. In other words, people who have been taught to write and read popular languages will likely not be able to read APL and vice versa.

I believe that APL isn't mutually intelligible with popular languages because, unlike popular languages, APL uses symbols for built-in function calls. 

Languages often come with functions that the developer can use for common tasks. When I was solving the first problem of AOC 2022 in Clojure, I used the `map`, `partition-by`, and `reduce` functions, among others, which were provided by the Clojure runtime. In popular languages like Clojure, to call one of these functions, a developer must use the English name of this function. For example, if I wanted to use the `map` function in Clojure to take a vector `v` and return a new vector with every element incremented by 1, I would do this: `(map inc v)`.

APL also has a runtime that provides functions that the developer can use. In APL, the functions equivalent to the ones that I mentioned above are: `Each`, `Partition`, and `Reduce`, respectively. However, in APL, to call these functions, you don't use their English names. You use symbol that represents that function. For example, if I wanted to use the `Each` function in APL to take a vector `v` and return a new vector with every element incremented by 1, I would do this: `+∘1¨v`<sup><a id="fnr.2" class="footref" href="#fn.2" role="doc-backlink">1</a></sup>. In this APL expression, the glyph `¨` represents the `Each` function. Similarly, `⊆` represents `Partition` and `/` represents `Reduce`.

Since APL uses symbols to invoke built-in functions, its source code will look very concise compared to popular languages. However, this is a trade-off. If a developer were to read a function call that uses the English name of the function, this English name will provide context to the developer about what that function is doing. The same isn't the case with symbols. If a non-Clojure developer were to see this Clojure expression out-of-context: `(partition-by empty? coll)`, I believe they would be able to somewhat detect that the `partition-by` function probably takes some collection as input and partitions it based in some criteria. In contrast, if a non-APL developer were to see the equivalent APL expression, out-of-context: `((0≠≢¨)⊆⊢)coll`, I don't think they would be able to gather much meaningful insight.

## Infix notation made order-of-operations seem a bit inconsistent at times

Since APL uses infix notation for function calls, I ran into a subtle problem that made learning the language a little bit more difficult.

For the most part, APL has a very simple order-of-operations that I really appreciate. APL evaluates expressions right to left. For the most part, every function in-between two operands will take as little as possible from its left side and as much as possible from its right side.

This works well for functions that need one or two inputs at most before producing a terminal value. Consider this simple APL expression: `f⍋3⍴1 2`, where `f` is a user-defined function: `{⊃⍵}`. This expression will be evaluated as: `(f⍋(3⍴1 2))`.

In the case that a function, needs three inputs to produce a terminal value, things get more tricky. For example, consider the following APL expression which makes use of the [`Stencil` (`⌺`)](https://help.dyalog.com/latest/index.htm#Language/Primitive%20Operators/Stencil.htm) function: `f⌺1⊢1 2`.

This expression seems to have a very similar structure to the expression I presented earlier: `<user-defined-function> <glyph> <number> <glyph> <number> <number>`. However, this expression will have a different evaluation order. This expression will evaluate like so: `(f⌺1)(⊢(1 2))`. Since `Stencil` is a function that takes two arguments and returns a function, it will bind tightly to `f` and `1`. The fact that the evaluation order is different in these two expressions is confusing and can hurt readability.<sup><a id="fnr.3" class="footref" href="#fn.3" role="doc-backlink">3</a></sup>

## Extensive use of combinatory logic

[The first problem of Advent of Code 2022](https://adventofcode.com/2022/day/1), asks you to read a file. There are two kinds of lines in the file, lines containing nothing but a numeric string, and empty lines. The first part of the problem is to create a nested array where adjoining lines of numeric strings are grouped together.

To do this in a functional language, after reading the file into a string and splitting by new lines, one popular way of creating this nested array is to use a partition function. In Clojure one could use the `partition-by` function that takes two arguments, a function that returns a bool value and a collection. If the function returns true for an index `i`, then the collection will be partitioned at that index. In my Clojure solution to this problem, I used the partition function like this: `(partition-by #(= % "") file)`

When I tried to solve this problem in APL, I realized that partitioning works differently. APL's partition function (`Partition`) does not accept a function that returns a bool value. Instead, it expects an array of 1s and 0s, let's call it `b`. You can call it like this: `b ⊆ a`. If `b[i]` is a 0, then the result of this expression would be a new array like `a`, partitioned at index `i`. When I learned this, I solved this problem by creating a binary array to the left of `⊆`:

```apl
({0≠≢⍵}¨file)⊆file
```

To create this binary array, I created an array of 0s with the same size as `file`, and set an index `i` to be 1 if the length of `file[i]` was non-empty. In my opinion, this is quite a less elegant than the equivalent Clojure code. It felt like I had to jump through way more mental hoops to get to the same behavior. I didn't understand why APL designers hadn't changed `Partition` to be simpler and accept a function instead of a boolean array. After learning more APL, I feel like I now understand why.

APL has this signature for `Partition` because it has an elegant way for callers to use it. You could write the same expression above in idiomatic APL like so:
```apl
((0≠≢¨)⊆⊢)file
```

This expression expands to `((0≠≢¨)file)⊆file`, which in turn expands to: `({0≠≢⍵}¨file)⊆file` (my original attempt). The idiomatic APL expression works because APL supports [tacit programming](https://xpqz.github.io/learnapl/tacit.html). It has a set of rules for how a string a functions within parentheses will expand to form a composition of function applications. This is combinatory logic. This particular rule is formally called the [`Φ` combinator](https://raw.githubusercontent.com/codereport/Content/main/Publications/Combinatory_Logic_and_Combinators_in_Array_Languages.pdf).

I can appreciate that there is a concise way to call `Partition`. I like that the left part of it almost syntactically resembles the Clojure example of calling `partition-by`. `(0≠≢¨)` kind-of looks like a lambda function that returns a bool value.

Ultimately, APL's choice of making combinatory logic the idiomatic way to use `Partition` seems overly complicated. Instead of learning about all the different combinators, how to use them in APL, and debugging tacit functions, it seems much easier to just pass in a function and call it a day.

`Partition` is no exception. Other functions work much the same way. For example, to filter an array in APL, instead of calling a `Filter` function using a function that returns a bool value as an argument, you have to use the `Replicate` function and pass in an binary array. Similarly, to make this idiomatic, you'd need to use combinatory logic.

## Conclusion

I really enjoyed learning APL and plan to continue learning and writing it from time to time to help me improve my problem-solving skills. I may venture to try out another array language, [BQN](https://mlochbaum.github.io/BQN/), to see if it keeps the things I liked about APL, while removing some of the things that I didn't like about it.

## Footnotes

<sup><a id="fn.1" class="footnum" href="#fnr.1">1</a></sup> When I say "APL", I'm referring to Dyalog APL using "dfn style".

<sup><a id="fn.2" class="footnum" href="#fnr.2">2</a></sup> Of course, in APL, there is a much more idiomatic way to do this: `v + 1`. However, for this example, I wanted to demonstrate the `Each` function.

<sup><a id="fn.3" class="footnum" href="#fnr.3">3</a></sup> You could avoid the order-of-operations ambiguity in the second example by wrapping the first part in parenthesis: `(f⌺1)⊢1 2`. At this point, a newcomer may realize that they can simplify the expression to `(f⌺1)1 2`. Unfortunately, this form is not idiomatic APL. Idiomatic APL seems to be more about terseness than readability for newcomers. Since `(f⌺1)1 2` is 8 characters and `f⌺1⊢1 2` is 7, a newcomer might be more likely to see `f⌺1⊢1 2` over `(f⌺1)1 2`.

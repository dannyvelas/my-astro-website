---
layout: "../../layouts/BlogLayout.astro"
title: 'My idea of a cool new programming language'
publishedDate: 2024-02-25
description: 'Spec of a programming language that might be cool to develop'
author: 'Daniel Velasquez'
tags: ["career"]
---

## Background: Learning APL

My background is predominantly in imperative or object-oriented languages. The first language I ever learned was C++. In college, I mostly wrote Java, C, and C++. In my career, I've mostly developed using Go and Typescript. However, I've always had a keen interest in functional programming. As such, I've tried to teach myself functional languages and patterns in my spare time.

Most recently, I've been learning how to write APL<sup><a id="fnr.1" class="footref" href="#fn.1" role="doc-backlink">1</a></sup>. APL is what's known as an "array language." An array language is a type of programming language where one can apply a function to every element of a vector or matrix without iteration. I've been solving the problems of Advent of Code (AOC) 2023 in APL. Before I started, I understood that coding in APL would be somewhat similar to coding in a functional language. I've had some experience with functional languages already. I also already solved some problems of AOC 2022 in Clojure. So, I figured that I was already equipped to have a relatively easy time learning APL. I thought that the only thing that might make APL a bit more difficult, is that I would have to learn how to type the glyphs. However, I was wrong. Typing the glyphs was easy. Writing idiomatic APL programs was very hard.

Since Clojure is a functional language, the Clojure community encourages one to solve algorithms by chaining pure functions together. As such, when I would solve AOC 2022 problems, I would create a bunch of pure functions, read the input file, pass it to a pure function, then, I would pass the output of that to another pure function, and so on, until finally, the last pure function would return the expected answer to the problem. Now that I look back at my AOC 2022 Clojure solutions, I realize that some of the functions I wrote may not be so idiomatic from a functional programming perspective. Some functions that I wrote were translations of what I would do in an imperative language like Go. For example, I noticed that in many of my Clojure functions I decided to use the "loop" construct. The logic of the loop would be very similar to the logic I would write in Go. I believe that instead of writing iteration logic in Clojure, it would have been more idiomatic to have a chain of functions that transform the input of the function to some desired output. I probably did not do it this way, because I could not think of a way to implement the function in such a way.

Writing APL was difficult for me because in APL (and array languages in general) it is much more uncomfortable to do the equivalent of a Clojure "loop", or more generally, iteration through recursion. It seems to me that to write idiomatic code in an array language, one _must_ write algorithms as a chain of functions that transform the input of the function into some desired output. In other words, array languages force you to think only in terms of transformations, not iterations. If you tried to do iteration through recursion in an array language, you would end up with a pretty long and complicated program. As such, array languages seem like a really good medium to sharpen one's functional programming skills. They don't have an easy escape hatch to resort to imperative thinking. If I ever want to guarantee that I use only functional patterns to solve a problem in a given functional language, I might choose to solve it in APL first, and then translate it to that given language.


## Language Barrier of APL

As I've gotten better at APL I've started to have some appreciation for its beauty and simplicity. It makes me wish that it was more popular so that more people could use them to solve problems faster and easier than they would otherwise.

If we think of programming languages as a product, we can think of the people who choose between languages as a market. We can look at [the 51 languages with the largest market share in the StackOverflow 2023 Survey](https://survey.stackoverflow.co/2023/#technology-most-popular-technologies). Let's call these languages "popular languages".

As I looked through the list of popular languages, I noticed that APL, the most popular array language, was third-to-last on the list. And, I asked myself why array languages like APL, BQN, or Uiua don't have bigger market share. I finally concluded that it's because array languages have a sort of language barrier to entry.

In this post, I'll talk only about the language barriers of APL. But, some of these points apply to array languages in general.

Suppose we get a person who is comfortable using one of the popular languages who has never learned how to read or write APL at random and we ask them to try to explain the workings of a program written in a language that they are not familiar with. Suppose we do this exercise twice. The first program we show them is written in a popular language. The second is an APL program. I believe that:

-   The programmer would statistically be most likely to be familiar with one or several of the languages in the popular languages list.
-   Through this experience, they would most likely be able to explain what the first language is doing with moderate success.
-   Despite this experience, they would have almost no success in explaining what APL is doing

If this is true, this would mean two things:

-   The majority of popular languages are, to a certain degree, [mutually intelligible](https://en.wikipedia.org/wiki/Mutual_intelligibility) with other popular languages. In other words, people who have been taught to write and read a subset of popular languages can often read and (sometimes, or to a limited degree) write a distinct subset of popular languages.
-   Popular languages are almost not mutually intelligible with APL at all. In other words, people who have been taught to write and read popular languages will likely not be able to read APL and vice versa.

I believe that APL isn't mutually intelligible with popular languages because, unlike popular languages, APL uses symbols for built-in function calls. 

### The use of symbols for built-in function calls

Languages often come with functions that the developer can use for common tasks. When I was solving the first problem of AOC 2022 in Clojure, I used the `map`, `partition-by`, and `reduce` functions, among others, which were provided by the Clojure runtime. In popular languages like Clojure, to call one of these functions, a developer must use the English name of this function. For example, if I wanted to use the `map` function in Clojure to take a vector `v` and return a new vector with every element incremented by 1, I would do this: `(map inc v)`.

APL also has a runtime that provides functions that the developer can use. In APL, the functions equivalent to the ones that I mentioned above are: `Each`, `Partition`, and `Reduce`, respectively. However, in APL, to call these functions, you don't use their English names. You use symbol that represents that function. For example, if I wanted to use the `Each` function in APL to take a vector `v` and return a new vector with every element incremented by 1, I would do this: `+∘1¨v`<sup><a id="fnr.2" class="footref" href="#fn.2" role="doc-backlink">1</a></sup>. In this APL expression, the glyph `¨` represents the `Each` function. Similarly, `⊆` represents `Partition` and `/` represents `Reduce`.

This is the case because APL treats functions and operators as one-and-the-same. In many popular languages, functions and operators are distinct. For example, in Python, operators are always symbols that are applied using infix notation (e.g. `1+2`). Functions are applied using English names using prefix notation (e.g. `map(some_fn, some_iterable)`). In contrast, in APL, the entity for addition `+` is a function that behaves just like `¨`. Both of these are infix functions that take two arguments, which must be invoked using a symbol instead of an English name. From the standpoint of a popular language, one might say that APL basically forces every function to behave like an operator.

Since APL uses symbols to invoke built-in functions, its source code will look very concise compared to popular languages. However, this is a trade-off. If a developer were to read a function call that uses the English name of the function, this English name will provide context to the developer about what that function is doing. The same isn't the case with symbols. If a non-Clojure developer were to see this Clojure expression out-of-context: `(partition-by empty? coll)`, I believe they would be able to somewhat detect that the `partition-by` function probably takes some collection as input and partitions it based in some criteria. In contrast, if a non-APL developer were to see the equivalent APL expression, out-of-context: `((0≠≢¨)⊆⊢)coll`, I don't think they would be able to gather much meaningful insight.

## Further APL Complexity

Even if a developer of a popular language were able to get past the initial intimidation of non-ASCII symbols, they may get deterred from continuing to learn because additional particularities of APL:
- There are some functions that APL offers that should logically take three or more arguments. However, since every function in APL must be called using infix notation, to call these functions you need to use some strange syntax.
- APL requires extensive use of combinatory logic for writing idiomatic programs. Combinatory logic is rarely used in popular languages. So it can be quite hard for newcomers to understand idiomatic array language expressions.
- There are some non-intuitive things about the way rank polymorphism works (e.g. `f¨⊂Y` is not the same as `f Y`).

### Strange syntax for functions that should logically take three or more arguments

The functions that are built-in to programming languages often have different arities. Some take one argument, others take two, some take three or more.

Since APL makes all functions infix, all functions provided by APL technically take either one argument or two, but no more than two.

At the same time, APL provides built-in functions that, in other languages, take 3 arguments or more. A good example is the `Replace` function. In Python if you have a string `s` and you want to replace all instances of the character "a" in `s` with "b", you can do: `s.replace("a", "b")`. This `replace` function can be thought of as taking three arguments: `s`, `"a"`, and `"b"`. The question is, how does APL make the `Replace` function take three arguments if it can only be applied using infix notation? Well, APL gets around this problem by using [currying](https://en.wikipedia.org/wiki/Currying).

In APL, the symbol for replace is `⎕R`. To do the same in APL, you would need to do this: `('a'⎕R'b')s`. This expression calls the `Replace` function with two arguments: `'a'` and `'b'`. This call returns a new function that takes one string argument and does the replacing.

Okay, this doesn't seem so bad. But here's where things get ugly. Now suppose we want to write a `Replace` function that is case insensitive. This would be a 4 argument function. In python we could do this by importing the `re` library and using the `sub` function: `re.sub('a', 'b', s, flags=re.IGNORECASE)`. In Dyalog APL, to do this, we would have to pass 

For the most part, APL has a very simple order-of-operations that I really appreciate. APL evaluates expressions right to left. For the most part, every function in-between two operands will take as little as possible from its left side and as much as possible from its right side.

This works well for functions that take one or two arguments at most. Consider this simple APL expression: `f⍋3⍴1 2`, where `f` is a user-defined function: `{⊃⍵}`. This expression will be evaluated as: `(f⍋(3⍴1 2))`.

Popular languages often provide built-in functions that should take more than two arguments there are some built-in APL functions like for example: `Stencil`, `Replace`, and `Search`, thatk 

For example, consider the following APL expressions: `f⌺1⊢1 2`.

This expression seems to have a very similar structure to the expression I presented earlier: `<user-defined-function> <glyph> <number> <glyph> <number> <number>`. However, this expression will have a different evaluation order. This expression will evaluate like so: `(f⌺1)(⊢(1 2))`. There are reasons for this, and these reasons might be obvious to a seasoned APL developer. However, this is unintuitive to a newcomer.

You could avoid the order-of-operations ambiguity in the second example by wrapping the first part in parenthesis: `(f⌺1)⊢1 2`. At this point, a newcomer may realize that they can simplify the expression to `(f⌺1)1 2`. Unfortunately, this form is not idiomatic APL. Idiomatic APL seems to be more about terseness than readability for newcomers. Since `(f⌺1)1 2` is 8 characters and `f⌺1⊢1 2` is 7, a newcomer might be more likely to see `f⌺1⊢1 2` over `(f⌺1)1 2`.

Although this is unintutive, I think I can understand why APL allows for this ambiguity in order-of-operations. `Stencil` was designed to be a function that makes it easy to [iterate over an array, updating each element according to some rules about its neighbors](https://en.wikipedia.org/wiki/Iterative_Stencil_Loops). This function is ideal for simulating [Conway's game of life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life). To write this function in a C-family language, you would likely make it take three arguments: a function `f` that operates on a given sliding window, some configuration object `c` that specifies the size and movement of the sliding window, and finally the matrix which will be iterated through with windows specified by `c`, which will in turn get passed to function `f`. However, in APL, since all functions are infix, it's impossible to make `Stencil` a 3-argument function. So, the best you can do is make it a two-argument function that returns a function that accepts a single argument. 


## Derivative of APL

I thought APL was fun to learn (and I still have a lot to learn), but as I was learning, I started to think about how I could make an array language that would be kind of like a derivative of APL.

The language would be different in that it would:

-   Use English words for function primitives instead of using single-character glyphs or ASCII digraphs. This would hopefully make it more of a beginner-friendly language because it won't suffer from the language barrier problem. In this respect, it would be like [Ivy](https://pkg.go.dev/robpike.io/ivy).
-   All function primitives will be prefix, not infix.
-   Use based array theory [like BQN](https://mlochbaum.github.io/BQN/doc/based.htmlinstead), instead of [nested array theory](https://aplwiki.com/wiki/Array_model#Nested_array_theory).

The language would be similar to APL in that it would:
-   Be an array language with rank polymorphism
-   Have [combinators](https://raw.githubusercontent.com/codereport/Content/main/Publications/Combinatory_Logic_and_Combinators_in_Array_Languages.pdf), like the "I" combinator (identity), the "K" combinator (const), the "S" combinator (hook), the "B" combinator (composition), the "C" combinator (flip), and finally, the "W" combinator (join).


## With jq

Also, I want to take this language in an interesting direction that is not common for array languages. I want this language to be a DSL for file scripting. In other words, I want to be able to use this language to be optimized almost exclusively for reading files as input, the same way that JQ is optimized to be used exclusively for reading JSON files as input.

My language and jq would be different in that:

-   It will be optimized for CSV files, not JSON files.
-   jq allows you to run the same source file in a variety of different ways by specifying different command line flags. My language will allow you to specify different "run-modes" as special directives at the top. This will make programs a little more portable. The idea is that you would can get a source file of my program and run it without needing to also get learn how to specify the correct arguments and run it.

## Footnotes

<sup><a id="fn.1" class="footnum" href="#fnr.1">1</a></sup> When I say "APL", I'm referring to Dyalog APL using "dfn style".

<sup><a id="fn.2" class="footnum" href="#fnr.2">2</a></sup> Of course, in APL, there is a much more idiomatic way to do this: `v + 1`. However, for this example, I wanted to demonstrate the `Each` function.

<sup><a id="fnr.3" class="footref" href="#fn.3" role="doc-backlink">3</a></sup> I believe that in J, what I refer to as "functions" are actually [called "verbs"](https://www.jsoftware.com/books/pdf/brief.pdf).
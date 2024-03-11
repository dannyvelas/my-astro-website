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

I believe that APL is not so popular because:
- It is not mutually intelligible with popular languages
- It has no universal LSP

Even if APL were popular, I feel like it can be improved in some ways. Here's what I don't like about APL:
- Infix notation
- APL requires extensive use of combinatory logic for writing idiomatic programs. Combinatory logic is rarely used in popular languages. So it can be quite hard for newcomers to understand idiomatic array language expressions.
- There are some non-intuitive things about the way rank polymorphism works (e.g. `f¨⊂Y` is not the same as `f Y`).

I'll expand on these points below.

### Mutual intelligibility of APL

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

This is the case because APL treats functions and operators as one-and-the-same. In many popular languages, functions and operators are distinct. For example, in Python, operators are always symbols that are applied using infix notation (e.g. `1+2`). Functions are applied using English names using prefix notation (e.g. `map(some_fn, some_iterable)`). In contrast, in APL, the entity for addition `+` is a function that behaves just like `¨`. Both of these are infix functions that take two arguments, which must be invoked using a symbol instead of an English name. From the standpoint of a popular language, one might say that APL basically forces every function to behave like an operator.

Since APL uses symbols to invoke built-in functions, its source code will look very concise compared to popular languages. However, this is a trade-off. If a developer were to read a function call that uses the English name of the function, this English name will provide context to the developer about what that function is doing. The same isn't the case with symbols. If a non-Clojure developer were to see this Clojure expression out-of-context: `(partition-by empty? coll)`, I believe they would be able to somewhat detect that the `partition-by` function probably takes some collection as input and partitions it based in some criteria. In contrast, if a non-APL developer were to see the equivalent APL expression, out-of-context: `((0≠≢¨)⊆⊢)coll`, I don't think they would be able to gather much meaningful insight.

## Suboptimal support for editors

If you're a developer that wants to start using APL, you have three main APL implementations to choose from: [Dyalog APL](https://www.dyalog.com/), [GNU APL](https://www.gnu.org/software/apl/), and [dzaima/APL](https://github.com/dzaima/APL/).

If you're a developer, the first lines of code that you wrote in your current language of choice were most likely in an IDE or in an editor like Eclipse or IntelliJ or RStudio or PyCharm or Visual Studio Code. Your first lines of APL code will most likely be in a REPL. In contrast to popular languages, APL seems to be a lot more REPL-oriented than many, if not most, popular languages.

To use Dyalog APL, you have to download [the official Dyalog IDE](https://www.dyalog.com/download-zone.htm). After downloading, you can use the main window of this IDE as a REPL to write APL. To use [GNU APL](https://www.gnu.org/software/apl/apl-intro.html#CH_2) or [dzaima/APL](https://github.com/dzaima/APL/blob/5eb0a4205e27afa6122096a25008474eec562dc0/readme.md) you have to download their interpreter and execute it through your shell. This would spawn an APL REPL.

If you wanted to write your APL in a file, using your preferred editor, you certainly could. But, I feel like there isn't much tooling available in the APL community to make this as good as it could be. 

Using a REPL is nice. But many times you want to write APL inside of a file. Writing code inside of a file has multiple benefits: you can check your code into version control, you can more easily share your code with others, and you can write your code in your preferred editor.

If you wanted to write your APL in a file, you could do so by using Dyalog APL and putting [a special shebang at the top of the file](https://www.dyalog.com/uploads/documents/Dyalog_V182_highlights.pdf). You could also execute code from a file with [GNU APL](https://www.gnu.org/software/apl/apl-intro.html#CH_2). 

Now, if you want any help from your editor when you're using it to write APL, you are absolutely out of luck. As much as your Visual Studio Code or Vim or Sublime editor wants to help you with helpful error messages about syntax errors, or syntax highlighting, or even formatting, it can't when you are using it to write APL. This is because there is no such thing as an APL.

## Further APL complexity

Even if a developer of a popular language were able to get past the initial intimidation of non-ASCII symbols, they may get deterred from continuing to learn because additional particularities of APL:
- APL requires extensive use of combinatory logic for writing idiomatic programs. Combinatory logic is rarely used in popular languages. So it can be quite hard for newcomers to understand idiomatic array language expressions.
- There are some non-intuitive things about the way rank polymorphism works (e.g. `f¨⊂Y` is not the same as `f Y`).

### Extensive use of combinatory logic

### Non-Intuitive Rank Polymorphism

## A new language, inspired by APL

I thought APL was fun to learn (and I still have a lot to learn), but as I was learning, I started to think about how I could make a language that would take some inspiration from APL. At the same time, I wanted this language to have some improvements over APL.

The language would be different to APL in that it would:

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
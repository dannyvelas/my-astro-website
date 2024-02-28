---
layout: "../../layouts/BlogLayout.astro"
title: 'My idea of a cool new programming language'
publishedDate: 2024-02-25
description: 'Spec of a programming language that might be cool to develop'
author: 'Daniel Velasquez'
tags: ["career"]
---

## Background: Learning APL

My background is predominantly in imperative or object-oriented languages. The first language I ever learned was C++. In college, I mostly wrote Java, C, and C++. In my career, I've mostly developed using Typescript and Go. However, I've always had a keen interest in functional programming. As such, I've tried to teach myself functional languages and patterns in my spare time.

Most recently, I've been learning how to write APL<sup><a id="fnr.1" class="footref" href="#fn.1" role="doc-backlink">1</a></sup>. APL is what's known as an "array language." An array language is a type of programming language where one can apply a function to every element of a vector or matrix without iteration. I've been solving the problems of Advent of Code (AOC) 2023 in APL. Before I started, I understood that coding in APL would be somewhat similar to coding in a functional language. I've had some experience with functional languages already. I also already solved some problems of AOC 2022 in Clojure. So, I figured that I was already equipped to have a relatively easy time learning APL. I thought that the only thing that might make APL a bit more difficult, is that I would have to learn how to type the glyphs. However, I was wrong. Typing the glyphs was easy. Writing idiomatic APL programs was very hard.

Since Clojure is a functional language, the Clojure community encourages one to solve algorithms by chaining pure functions together. As such, when I would solve AOC 2022 problems, I would create a bunch of pure functions, read the input file, pass it to a pure function, then, I would pass the output of that to another pure function, and so on, until finally, the last pure function would return the expected answer to the problem. Now that I look back at my AOC 2022 Clojure solutions, I realize that some of the functions I wrote may not be so idiomatic from a functional programming perspective. Some functions that I wrote were translations of what I would do in an imperative language like Go. For example, I noticed that in many of my Clojure functions I decided to use the "loop" construct. The logic of the loop would be very similar to the logic I would write in Go. I believe that instead of writing iteration logic in Clojure, it would have been more idiomatic to have a chain of functions that transform the input of the function to some desired output. I probably did not do it this way, because I could not think of a way to implement the function in such a way.

Writing APL was difficult for me because in APL (and array languages in general) it is much more uncomfortable to do the equivalent of a Clojure "loop", or more generally, iteration through recursion. It seems to me that to write idiomatic code in an array language, one must write algorithms as a chain of functions that transform the input of the function into some desired output. In other words, array languages force you to think only in terms of transformations, not iterations. If you tried to do iteration through recursion in an array language, you would end up with a pretty long and complicated program. As such, array languages seem like a really good medium to sharpen one's functional programming skills. They don't have an easy escape hatch to resort to imperative thinking. If I ever want to guarantee that I use only functional patterns to solve a problem in a given functional language, I might choose to solve it in APL first, and then translate it to that given language.


## Language Barrier of APL

As I've gotten better at APL I've started to have some appreciation for the beauty and simplicity of array languages. It makes me wish that these array languages were more popular so that more people could use them to solve problems faster and easier than they would otherwise.

If we think of programming languages as a product, we can think of the people who choose between languages as a market. We can look at [the 51 languages with the largest market share in the StackOverflow 2023 Survey](https://survey.stackoverflow.co/2023/#technology-most-popular-technologies). Let's call these languages "popular languages".

As I looked through the list of popular languages, I noticed that APL, the most popular array language, was third-to-last on the list. And, I asked myself why array languages like APL, BQN, or Uiua don't have bigger market share. I finally concluded that it's because array languages have a sort of language barrier to entry.

Suppose we get a person who is comfortable using one of the popular languages that has never learned how to read or write an array language at random and we ask them to try to explain the workings of a program written in a language that they are not familiar with. Suppose we do this exercise twice. The first program we show them is written in a non-array language from the popular languages list. The second is a program written in an array language. I believe that:

-   The programmer would statistically be most likely to be familiar with one or several of the languages in the popular languages list.
-   Through this experience, they would most likely be able to explain what the first language is doing with moderate success.
-   Despite this experience, they would have almost no success in explaining what the array language is doing.

If this is true, this would mean two things:

-   The majority of popular languages are, to a certain degree, [mutually intelligible](https://en.wikipedia.org/wiki/Mutual_intelligibility) with other popular languages. In other words, people who have been taught to write and read a subset of popular languages can often read and (sometimes, or to a limited degree) write a distinct subset of popular languages.
-   Popular languages are almost not mutually intelligible with array languages at all. In other words, people who have been taught to write and read popular languages will likely not be able to read array languages and vice versa.

I believe array languages aren't mutually intelligible with popular languages because<sup><a id="fnr.2" class="footref" href="#fn.2" role="doc-backlink">2</a></sup>:

- They use obscure non-ASCII glyphs in their syntax. The use of these unfamiliar glyphs makes it harder to understand for a newcomer.
- Each function primitive is a glyph. This makes the language very terse because you can apply several functions to a given input in one line. For example, this is the solution to the AOC 2022, day 1 part 1 problem: `⌈/+/¨⍎¨¨((0≠≢¨)⊆⊢)⊃⎕NGET'input.txt'1`.
- Every function is called using infix notation and this can make order-of-operations seem inconsistent at times. Consider these two APL expressions: (suppose `f` is this pre-defined function: `{⊃⍵}`)
- `f⍋3⍴1 2`
- `f⌺1⊢1 2`

These two expressions have a seemingly similar structure: `<function> <glyph> <number> <glyph> <number> <number>`. However, shockingly enough, these two expressions will have a different evaluation order. The first one will evaluate strictly right-to-left, equivalent to: `f⍋(3⍴(1 2))`. The second expression, in contrast, will evaluate like so: `(f⌺1)(⊢(1 2))`. There are reasons for this, and these reasons might be obvious to a seasoned APL developer. However, this is unintuitive to a newcomer.

You could avoid the order-of-operations ambiguity in the second example by wrapping the first part in parenthesis: `(f⌺1)⊢1 2`. At this point, a newcomer may realize that they can simplify the expression to `(f⌺1)1 2`. Unfortunately, this form is not idiomatic APL. Idiomatic APL seems to be more about terseness than readability for newcomers. Since `(f⌺1)1 2` is 8 characters and `f⌺1⊢1 2` is 7, you'll often see APL developers suggest using `f⌺1⊢1 2` over `(f⌺1)1 2`.

. For example, in Dyalog APL there is [a stencil operator](https://help.dyalog.com/latest/Content/Language/Primitive%20Operators/Stencil.htm). It looks like this: `⌺`. This operator takes two arguments and returns a function. Suppose `f`, `g`, and `Y` are variables in scope. The idiomatic way to use this operator is to use syntax like this: `f⌺g⊢Y`. To a newcomer, the order of operations is not straightforward. The correct answer is that this is equivalent to `(f⌺g)⊢Y`. But, a newcomer might think that this is evaluated as `f⌺(g⊢Y)`. A newcomer would have good reason to guess the latter. 2↑3⍴0


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

<sup><a id="fn.2" class="footnum" href="#fnr.2">2</a></sup> These points are less true for array languages like J and K. These languages use ASCII characters instead. Some function primitives are one glyph, but others are digraphs formed by joining two ASCII characters. In my opinion, these differences make J and K and little bit more beginner friendly than APL, BQN, and Uiua because they are easier to type. However, they are just as unintelligible to a newcomer.
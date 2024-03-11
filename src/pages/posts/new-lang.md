---
layout: "../../layouts/BlogLayout.astro"
title: 'My idea of a cool new programming language'
publishedDate: 2024-02-25
description: 'Spec of a programming language that might be cool to develop'
author: 'Daniel Velasquez'
tags: ["apl", "functional-programming", "languages"]
---

## Background: Learning APL

In my last post (*TODO: CITE*), I wrote about how I learned APL<sup><a id="fnr.1" class="footref" href="#fn.1" role="doc-backlink">1</a></sup> and how I thought it might have been more popular if it were a bit more mutually intelligible with popular languages.

As I wrote the last post, I started thinking about how it might be interesting to create a new language that takes some of the good things about APL but changes or removes some of the things that I didn't like.

In particular, these are the things that I don't like about APL:
- Infix notation.
- Extensive use of combinatory logic for writing idiomatic programs.
- There are some non-intuitive things about the way rank polymorphism works (e.g. `f¨⊂Y` is not always the same as `f Y`).

In this post, I'll explore what a language might look like if it were like APL, except it more mutually intelligible with popular languages and without these things.

### More mutually intelligible with popular languages

In my last post, I wrote about the fact that APL uses symbols for built-in functions hurts readability for non-APL developers (*TODO: cite*).

If we wanted to make a new language like APL that was a little more readable, I think it might make sense for this language to take the same approach as [Ivy](https://pkg.go.dev/robpike.io/ivy), where each function is an English word.

### Prefix instead of infix notation

#### Infix notation adds unnecessary complexity
In my last post I wrote about how in APL, functions are applied using infix notation. I think infix notation has some decided limitations when defining functions. To get around these limitations, you have to do some pretty complex stuff.

In particular, infix notation makes it very complex to have functions that take three or more arguments. It also makes it very complex to have functions that take multiple optional arguments.

The functions that are built-in to programming languages often have different arities. Some take one argument, others take two, some take three or more. Since APL makes all functions infix, all functions provided by APL technically take either one argument or two, but no more than two.

At the same time, APL provides built-in functions that, in other languages, take 3 arguments or more. A good example is the `Replace` function. In Python if you have a string `s` and you want to replace all instances of the character "a" in `s` with "b", you can do: `s.replace("a", "b")`. This `replace` function can be thought of as taking three arguments: `s`, `"a"`, and `"b"`. The question is, how does APL make the `Replace` function take three arguments if it can only be applied using infix notation? Well, APL gets around this problem by using [currying](https://en.wikipedia.org/wiki/Currying).

In APL, the symbol for replace is `⎕R`. To do the same in APL, you would need to do this: `('a'⎕R'b')s`. This expression calls the `Replace` function with two arguments: `'a'` and `'b'`. This call returns a new function that takes one string argument and does the replacing.

Of course this works, but it feels to me to be a little bit clunky. I believe that a function `f` that takes 4 arguments in APL might look like this: `(arg3(arg1 f arg0)arg2)` or like this `(((arg1 f arg0)arg2)arg3)`. I don't like this because it seems to me to add unnecessary complexity. For every additional argument or set of arguments, you have to return an additional function. Because of infix notation, in our example, in the worst case, for `f` to work, it must be a function that returns a function that returns a function. If we didn't have infix notation, it would be much simpler to define `f`. We would simply make it take 4 arguments. That's it. End of story.

You might say that Haskell suffers from the same problem. After all, technically, all Haskell functions can only take at most one argument. Functions that seem to take `n` arguments are just a function returning a function, returning a function...`n` times. While this is true, there is decided difference that makes this a non-problem in Haskell. Haskell makes it extremely easy and natural to write functions that return functions because that's just the standard way to write functions. The syntax hides this from you so much that you don't even realize you're doing it. Your functions will look very similar to functions in an imperative language. In contrast, I don't think that writing functions that return functions is so easy and natural in APL. It seems to me that if you wanted to write a function that needed three or more inputs, you would have to carefully write some particular and nuanced code to do so.

Some functions in APL, like `Replace`, make use of the `⍠` operator. For example, if you wanted to replace all instances of `"a"` to `"b"` in `s` in a case insensitive way, you would have to do this: `('a'⎕R'b'⍠'IC'1)s`. `"IC"` could have been treated as an additional argument to use as a flag, but instead it was used to modify the call to `⎕R`. If you wanted to add other additional optional configuration options to `⎕R`, you would simply add the `⍠` operator again: `('a'⎕R'b'⍠ 'Mode' 'D' ⍠ 'NEOL' 1 ⍠ 'EOL' 'LF')s`. The `⍠` operator helps a lot. Without it, I'm not sure how one would express functions that take multiple optional arguments in APL. However, it seems a bit crazy to me that Dyalog had to invent a whole new glyph and operator to solve this problem.

The `⍠` operator might make the syntax of calling the `Replace` function a little bit more clear. Without it, one might need to write the following: `(((('a'⎕R'b')'D')1)'LF')s` instead of using the syntax of the previous example. But, I'm not sure that it reduces complexity. The `⍠` operator, in essence, is a function that takes three inputs. The left argument is a function, the right argument is a configuration name. These two arguments return a function that takes one argument, the intended value for the configuration name. Suppose that you are tasked with writing a function `f` that, similar to `Replace`, needs to take optional configuration inputs. As such, You would need to write `f` in such a way that allows for it to be passed to the functions created by `⍠`, and in doing so, changes the behavior of `f`. I believe this would also require some very particular and nuanced code. In contrast, in other languages like Python, JavaScript, Java, or Clojure optional arguments is pretty trivial stuff.

#### Prefix Notation is better

Prefix notation

For the most part, APL has a very simple order-of-operations that I really appreciate. APL evaluates expressions right to left. For the most part, every function in-between two operands will take as little as possible from its left side and as much as possible from its right side.

This works well for functions that take one or two arguments at most. Consider this simple APL expression: `f⍋3⍴1 2`, where `f` is a user-defined function: `{⊃⍵}`. This expression will be evaluated as: `(f⍋(3⍴1 2))`.

Popular languages often provide built-in functions that should take more than two arguments there are some built-in APL functions like for example: `Stencil`, `Replace`, and `Search`, thatk 

For example, consider the following APL expressions: `f⌺1⊢1 2`.

This expression seems to have a very similar structure to the expression I presented earlier: `<user-defined-function> <glyph> <number> <glyph> <number> <number>`. However, this expression will have a different evaluation order. This expression will evaluate like so: `(f⌺1)(⊢(1 2))`. There are reasons for this, and these reasons might be obvious to a seasoned APL developer. However, this is unintuitive to a newcomer.

You could avoid the order-of-operations ambiguity in the second example by wrapping the first part in parenthesis: `(f⌺1)⊢1 2`. At this point, a newcomer may realize that they can simplify the expression to `(f⌺1)1 2`. Unfortunately, this form is not idiomatic APL. Idiomatic APL seems to be more about terseness than readability for newcomers. Since `(f⌺1)1 2` is 8 characters and `f⌺1⊢1 2` is 7, a newcomer might be more likely to see `f⌺1⊢1 2` over `(f⌺1)1 2`.

Although this is unintutive, I think I can understand why APL allows for this ambiguity in order-of-operations. `Stencil` was designed to be a function that makes it easy to [iterate over an array, updating each element according to some rules about its neighbors](https://en.wikipedia.org/wiki/Iterative_Stencil_Loops). This function is ideal for simulating [Conway's game of life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life). To write this function in a C-family language, you would likely make it take three arguments: a function `f` that operates on a given sliding window, some configuration object `c` that specifies the size and movement of the sliding window, and finally the matrix which will be iterated through with windows specified by `c`, which will in turn get passed to function `f`. However, in APL, since all functions are infix, it's impossible to make `Stencil` a 3-argument function. So, the best you can do is make it a two-argument function that returns a function that accepts a single argument. 

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

<sup><a id="fn.1" class="footnum" href="#fnr.1">1</a></sup> When I say "APL", I'm referring to Dyalog APL using "dfn style".

---
layout: "../../layouts/BlogLayout.astro"
title: 'My idea of a cool new programming language'
publishedDate: 2024-02-25
description: 'Spec of a programming language that might be cool to develop'
author: 'Daniel Velasquez'
tags: ["apl", "functional-programming", "languages"]
---

## Background: Learning APL

In my last post (*TODO: CITE*), I wrote about how I was learning APL<sup><a id="fnr.1" class="footref" href="#fn.1" role="doc-backlink">1</a></sup> and how I thought it might have been more popular if it were a bit more mutually intelligible with popular languages.

As I wrote the last post, I started thinking about how it might be interesting to create a new language that takes some of the good things about APL but changes or removes some of the things that I didn't like.

These are some of the things that I liked about APL:
- An emphasis on programming via a REPL, while still allowing a way to invoke the intrepeter on an arbitrary file.
- [A language server client](https://marketplace.visualstudio.com/items?itemName=OptimaSystems.vscode-apl-language-client) available in Visual Studio Code.
- Removing the distinction between an operator and a function.

In particular, these are the things that I don't like about APL:
- Not being mutually intelligible with popular languages.
- Infix notation for function calls.
- Extensive use of combinatory logic for writing idiomatic programs.
- There are some non-intuitive things about the way rank polymorphism works (e.g. `f¨⊂Y` is not always the same as `f Y`).

In this post, I'll explore what a language might look like if it had the things that I like about APL, without the things that I don't like.

### More mutually intelligible with popular languages

In my last post, I wrote about the fact that APL uses symbols for built-in functions hurts readability for non-APL developers (*TODO: cite*).

If we wanted to make a new language like APL that was a little more readable, I think it might make sense for this language to take the same approach as [Ivy](https://pkg.go.dev/robpike.io/ivy), where each function is an English word.

### Prefix instead of infix notation for function calls

#### Infix notation adds unnecessary complexity
In my last post I wrote about how in APL, functions are invoked using infix notation. As a result, all functions in APL must technically take either one argument or two, but no more than two.

At the same time, APL provides built-in functions that, in other languages, take 3 arguments or more. A good example is the `Replace` function. In Python if you have a string `s` and you want to replace all instances of the character "a" in `s` with "b", you can do: `s.replace("a", "b")`. This `replace` function can be thought of as taking three arguments: `s`, `"a"`, and `"b"`. The question is, how does APL make the `Replace` function take three arguments if it can only be applied using infix notation? Well, APL gets around this problem by using [currying](https://en.wikipedia.org/wiki/Currying).

In APL, the symbol for replace is `⎕R`. To do the same in APL, you would need to do this: `('a'⎕R'b')s`. This expression calls the `Replace` function with two arguments: `'a'` and `'b'`. This call returns a new function that takes one string argument and does the replacing.

Suppose you need to translate a translate a function `f` from an imperative language that takes four arguments to APL, you would have to use currying. You could, for example, define a function that takes two arguments that returns another function that takes two arguments, that returns a final value. The result would look like this: `(arg3(arg1 f arg0)arg2)`.

In this post, I will refer to the "final value" produced by a sequence of function invocations as a "terminal value". So, technically the `Replace` function takes at most 2 arguments. But, it needs three inputs to produce a terminal value. In our example, these values are `'a'`', `'b'`, and `s`.

In my opinion, it would only make sense for a language to require infix function calls if every function in the language can only take a maximum of two inputs before returning a terminal value. If a language were to require infix notation for function calls, it would become very difficult in that language to define functions that require three inputs to produce a terminal value. It would also become very difficult in that language to define functions that take optional inputs to produce a terminal value.

Because of infix function calls, I feel like our example of defining `f` was unnecessarily complicated. For every additional input or pair of input, you are forced to return an additional function<sup><a id="fnr.2" class="footref" href="#fn.2" role="doc-backlink">2</a></sup>.

Defining functions that take optional arguments is unnecessarily complicated too.

For functions that can take optional arguments, Dyalog APL lets you use the `⍠` operator. This operator can be used with the `Replace` function. For example, if you wanted to replace all instances of `"a"` to `"b"` in `s` in a case insensitive way, you would have to do this: `('a'⎕R'b'⍠'IC'1)s`. `"IC"` here is used to modify the call to `⎕R`. It's like a flag that stands for "case insensitive." If you wanted to add other additional configuration options to `⎕R`, you would simply add the `⍠` operator again: `('a'⎕R'b'⍠ 'Mode' 'D' ⍠ 'NEOL' 1 ⍠ 'EOL' 'LF')s`.

Fortunately the `⍠` operator allows us to use optional arguments in APL, I'm not sure how one would define functions in APL if it weren't for this magical operator. While the existence of this operator is nice, it seems a bit crazy to me that Dyalog had to invent a whole new operator to solve this problem. Also, the complexity of defining a function that uses this operator seems a bit crazy to me.

The `⍠` operator, in essence, is a function that takes three inputs. The left argument is a function, the right argument is a configuration name. These two arguments return a function that takes one argument, the intended value for the configuration name.

Suppose that you are tasked with writing a function `f` that, similar to `Replace`, needs to take optional configuration inputs. When downstream code calls `f`, it will need to use the `⍠` operator. As such, `f` will be passed as a left argument (alongside a right string argument, let's call it `s`) to a function created by `⍠`. The return value will be a function (`g`) that takes one argument (`a`). You would need to write `f` in a way that will make sure that when `g` receives `a` as an argument, `f` will acknowledge that the optional argument denoted by `s` will have a value of `a` and behave accordingly. This is pretty insane stuff. If it is difficult to understand this, you can imagine how difficult it would be to write and test logic for this.

#### Prefix Notation is better

Prefix notation for function calls is better because it does not suffer from any of those problems. Python, JavaScript, Java, and Clojure all use prefix notation for function calls. In all of these languages, it is trivial to write a function that takes more than two arguments, or takes multiple optional arguments.

For example, if you needed to define a function like `Replace` in python you could simply do something [like this](https://docs.python.org/3/library/re.html#re.sub):
```
def sub(pattern, repl, string, count=0, flags=0):
  pass
```

The `sub` function in particular from [the `re` library](https://docs.python.org/3/library/re.html) allows you to pass multiple optional arguments by using the bitwise OR `|` operator:
```
re.sub('a', 'b', s, flags=re.I|re.DOTALL)
```

I won't compare the implementation differences here of a function like `sub` in APL and Python. But I'm almost positive the Python implementation would be much simpler to write and understand.


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

<sup><a id="fn.2" class="footnum" href="#fnr.2">2</a></sup> You might say that Haskell suffers from the same problem. After all, technically, all Haskell functions can only take at most one argument. Functions that seem to take `n` arguments are just a function returning a function, returning a function...`n` times. While this is true, there is decided difference that makes this a non-problem in Haskell. Haskell makes it extremely easy and natural to write functions that return functions because that's just the standard way to write functions. The syntax hides this from you so much that you don't even realize you're doing it. Your functions will look very similar to functions in an imperative language. In contrast, I don't think that writing functions that return functions is so easy and natural in APL. It seems to me that if you wanted to write a function that needed three or more inputs, you would have to carefully write some particular and nuanced code to do so.

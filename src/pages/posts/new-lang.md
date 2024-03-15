---
layout: "../../layouts/BlogLayout.astro"
title: 'My idea of a cool new programming language'
publishedDate: 2024-02-25
description: 'Spec of a programming language that might be cool to develop'
author: 'Daniel Velasquez'
tags: ["apl", "functional-programming", "languages"]
---

## Background

My background is predominantly in imperative or object-oriented languages. The first language I ever learned was C++. In college, I mostly wrote Java, C, and C++. In my career, I've mostly developed using Go and Typescript. However, I've always had a keen interest in functional programming. As such, I've tried to teach myself functional languages and patterns in my spare time.

Most recently, I've been learning how to write APL<sup><a id="fnr.1" class="footref" href="#fn.1" role="doc-backlink">1</a></sup>. APL is what's known as an "array language." An array language is a type of programming language where one can apply a function to every element of a vector or matrix without iteration. I've been solving the problems of Advent of Code (AOC) 2023 in APL. Before I started, I understood that coding in APL would be somewhat similar to coding in a functional language. I've had some experience with functional languages already. I also already solved some problems of AOC 2022 in Clojure. So, I figured that I was already equipped to have a relatively easy time learning APL. I thought that the only thing that might make APL a bit more difficult, is that I would have to learn how to type the glyphs. However, I was wrong. Typing the glyphs was easy. Writing idiomatic APL programs was very hard.

Since Clojure is a functional language, the Clojure community encourages one to solve algorithms by chaining pure functions together. As such, when I would solve AOC 2022 problems, I would create a bunch of pure functions, read the input file, pass it to a pure function, then, I would pass the output of that to another pure function, and so on, until finally, the last pure function would return the expected answer to the problem. Now that I look back at my AOC 2022 Clojure solutions, I realize that some of the functions I wrote may not be so idiomatic from a functional programming perspective. Some functions that I wrote were translations of what I would do in an imperative language like Go. For example, I noticed that in many of my Clojure functions I decided to use the "loop" construct. The logic of the loop would be very similar to the logic I would write in Go. I believe that instead of writing iteration logic in Clojure, it would have been more idiomatic to have a chain of functions that transform the input of the function to some desired output. I probably did not do it this way, because I could not think of a way to implement the function in such a way.

Writing APL was difficult for me because in APL (and array languages in general) it is much more uncomfortable to do the equivalent of a Clojure "loop", or more generally, iteration through recursion. It seems to me that to write idiomatic code in an array language, one _must_ write algorithms as a chain of functions that transform the input of the function into some desired output. In other words, array languages force you to think only in terms of transformations, not iterations. If you tried to do iteration through recursion in an array language, you would end up with a pretty long and complicated program. As such, array languages seem like a really good medium to sharpen one's functional programming skills. They don't have an easy escape hatch to resort to imperative thinking. If I ever want to guarantee that I use only functional patterns to solve a problem in a given functional language, I might choose to solve it in APL first, and then translate it to that given language.

## Ideas for a new language
As I've learned APL, I've started thinking about how it might be interesting to create a new language that takes some of the good things about APL but changes or removes some of the things that I didn't like.

These are some of the things that I liked about APL:
- An emphasis on programming via a REPL, while still allowing a way to invoke the interpreter on an arbitrary file.
- [A language server client](https://marketplace.visualstudio.com/items?itemName=OptimaSystems.vscode-apl-language-client) available in Visual Studio Code.
- Removing the distinction between an operator and a function.

In particular, these are the things that I don't like about APL:
- Not being mutually intelligible with popular languages.
- Infix notation for function calls.
- Extensive use of combinatory logic for writing idiomatic programs.
- There are some non-intuitive things about the way rank polymorphism works (e.g. `f¨⊂Y` is not always the same as `f Y`).

In this post, I'll explore what a language might look like if it had the things that I like about APL, without the things that I don't like.

### More mutually intelligible with popular languages

Suppose we get a person who is comfortable using one of the popular languages who has never learned how to read or write APL at random and we ask them to try to explain the workings of a program written in a language that they are not familiar with. Suppose we do this exercise twice. The first program we show them is written in a popular language. The second is an APL program. I believe that:

-   The programmer would statistically be most likely to be familiar with one or several of the languages in the popular languages list.
-   Through this experience, they would most likely be able to explain what the first language is doing with moderate success.
-   Despite this experience, they would have almost no success in explaining what APL is doing

If this is true, this would mean two things:

-   The majority of popular languages are, to a certain degree, [mutually intelligible](https://en.wikipedia.org/wiki/Mutual_intelligibility) with other popular languages. In other words, people who have been taught to write and read a subset of popular languages can often read and (sometimes, or to a limited degree) write a distinct subset of popular languages.
-   Popular languages are almost not mutually intelligible with APL at all. In other words, people who have been taught to write and read popular languages will likely not be able to read APL and vice versa.

I believe that APL isn't mutually intelligible with popular languages because, unlike popular languages, APL uses symbols for built-in function calls. 

Languages often come with functions that the developer can use for common tasks. When I was solving the first problem of AOC 2022 in Clojure, I used the `map`, `partition-by`, and `reduce` functions, among others, which were provided by the Clojure runtime. In popular languages like Clojure, to call one of these functions, a developer must use the English name of this function. For example, if I wanted to use the `map` function in Clojure to take a vector `v` and return a new vector with every element incremented by 1, I would do this: `(map inc v)`.

APL also has a runtime that provides functions that the developer can use. In APL, the functions equivalent to the ones that I mentioned above are: `Each`, `Partition`, and `Reduce`, respectively. However, in APL, to call these functions, you don't use their English names. You use symbol that represents that function. For example, if I wanted to use the `Each` function in APL to take a vector `v` and return a new vector with every element incremented by 1, I would do this: `+∘1¨v`<sup><a id="fnr.2" class="footref" href="#fn.2" role="doc-backlink">2</a></sup>. In this APL expression, the glyph `¨` represents the `Each` function. Similarly, `⊆` represents `Partition` and `/` represents `Reduce`.

This is the case because APL treats functions and operators as one-and-the-same. In many popular languages, functions and operators are distinct. For example, in Python, operators are always symbols that are applied using infix notation (e.g. `1+2`). Functions are applied using English names (e.g. `map(some_fn, some_iterable)`). In contrast, in APL, the entity for addition `+` is a function that behaves just like `¨`. Both of these are infix functions that take two arguments, which must be invoked using a symbol instead of an English name. From the standpoint of a popular language, one might say that APL forces every function to behave like an operator.

Since APL uses symbols to invoke built-in functions, its source code will look very concise compared to popular languages. However, this is a trade-off. If a developer were to read a function call that uses the English name of the function, this English name will provide context to the developer about what that function is doing. The same isn't the case with symbols. If a non-Clojure developer were to see this Clojure expression out-of-context: `(partition-by empty? coll)`, I believe they would be able to somewhat detect that the `partition-by` function probably takes some collection as input and partitions it based in some criteria. In contrast, if a non-APL developer were to see the equivalent APL expression, out-of-context: `((0≠≢¨)⊆⊢)coll`, I don't think they would be able to gather much meaningful insight.

If I wanted to make an array language like APL that was a little more readable for non-APL developers, I think it might make sense for this language to take the same approach as [Ivy](https://pkg.go.dev/robpike.io/ivy), where each function is an English word.

### No infix notation for function calls

#### Infix notation adds unnecessary complexity when defining functions of more than two parameters
In my last post I wrote about how in APL, functions are invoked using infix notation. As a result, all functions in APL must technically take either one argument or two, but no more than two.

At the same time, APL provides built-in functions that, in other languages, take 3 arguments or more. A good example is the `Replace` function. In Python if you have a string `s` and you want to replace all instances of the character "a" in `s` with "b", you can do: `s.replace("a", "b")`. This `replace` function can be thought of as taking three arguments: `s`, `"a"`, and `"b"`. The question is, how does APL make the `Replace` function take three arguments if it can only be applied using infix notation? Well, APL gets around this problem by using [currying](https://en.wikipedia.org/wiki/Currying).

In APL, the symbol for replace is `⎕R`. To do the same in APL, you would need to do this: `('a'⎕R'b')s`. This expression calls the `Replace` function with two arguments: `'a'` and `'b'`. This call returns a new function that takes one string argument and does the replacing.

Suppose you need to translate a translate a function `f` from an imperative language that takes four arguments to APL, you would have to use currying. You could, for example, define a function that takes two arguments that returns another function that takes two arguments, that returns a final value. The result would look like this: `(arg3(arg1 f arg0)arg2)`.

In this post, I will refer to the "final value" produced by a sequence of function invocations as a "terminal value". So, technically the `Replace` function takes at most two arguments. But, it needs three inputs to produce a terminal value. In our example, these values are `'a'`', `'b'`, and `s`.

In my opinion, it would only make sense for a language to require infix function calls if every function in the language can only take a maximum of two inputs before returning a terminal value. If a language were to require infix notation for function calls, it would become very difficult in that language to define functions that require three inputs to produce a terminal value. It would also become very difficult in that language to define functions that take optional inputs to produce a terminal value.

Because of infix function calls, I feel like our example of defining `f` was unnecessarily complicated. For every additional input or pair of input, you are forced to return an additional function<sup><a id="fnr.3" class="footref" href="#fn.3" role="doc-backlink">3</a></sup>. 

#### Infix notation adds unnecessary complexity when defining functions of more than two parameters

Defining functions that take optional arguments is unnecessarily complicated too.

For functions that can take optional arguments, Dyalog APL lets you use the `⍠` operator. This operator can be used with the `Replace` function. For example, if you wanted to replace all instances of `"a"` to `"b"` in `s` in a case insensitive way, you would have to do this: `('a'⎕R'b'⍠'IC'1)s`. `"IC"` here is used to modify the call to `⎕R`. It's like an optional flag that stands for "case insensitive." If you wanted to add other additional optional arguments to `⎕R`, you would simply add the `⍠` operator again: `('a'⎕R'b'⍠'IC' 1 ⍠ 'Mode' 'D' ⍠ 'NEOL' 1)s`.

I'm not sure how one would define functions in APL if it weren't for this magical operator. While the existence of this operator is nice, it seems a bit crazy to me that Dyalog had to invent a whole new operator to solve this problem. Also, the complexity of defining a function that uses this operator seems a bit crazy to me.

The `⍠` operator, in essence, is a function that takes three inputs. The left argument is a function, the right argument is a string. These two arguments return a function that takes one argument of any type.

Suppose that you are tasked with writing a function `f` that, similar to `Replace`, needs to take optional configuration inputs. When downstream code calls `f`, it will need to use the `⍠` operator. You would need to write `f` in a way that when `f` is passed alongside an arbitrary string argument `s` to `⍠`, it will return a function that will take one argument `a` and return a function that will behave like `f` except with an optional argument with name `s` set to `a`. This is pretty insane stuff. If it is difficult to understand this, you can imagine how difficult it would be to write and test logic for this.

#### Infix notation makes order-of-operations seem a bit inconsistent at times

Infix notation for function calls has another subtle problem that makes the language a little bit more difficult.

For the most part, APL has a very simple order-of-operations that I really appreciate. APL evaluates expressions right to left. For the most part, every function in-between two operands will take as little as possible from its left side and as much as possible from its right side.

This works well for functions that need one or two inputs at most before producing a terminal value. Consider this simple APL expression: `f⍋3⍴1 2`, where `f` is a user-defined function: `{⊃⍵}`. This expression will be evaluated as: `(f⍋(3⍴1 2))`.

In the case that a function, needs three inputs to produce a terminal value, things get more tricky. For example, consider the following APL expression which makes use of the [`Stencil` (`⌺`)](https://help.dyalog.com/latest/index.htm#Language/Primitive%20Operators/Stencil.htm) function: `f⌺1⊢1 2`.

This expression seems to have a very similar structure to the expression I presented earlier: `<user-defined-function> <glyph> <number> <glyph> <number> <number>`. However, this expression will have a different evaluation order. This expression will evaluate like so: `(f⌺1)(⊢(1 2))`. Since `Stencil` is a function that takes two arguments and returns a function, it will bind tightly to `f` and `1`. 

The fact that the evaluation order is different in these two expressions is confusing and can hurt readability. You could avoid the order-of-operations ambiguity in the second example by wrapping the first part in parenthesis: `(f⌺1)⊢1 2`. At this point, a newcomer may realize that they can simplify the expression to `(f⌺1)1 2`. Unfortunately, this form is not idiomatic APL. Idiomatic APL seems to be more about terseness than readability for newcomers. Since `(f⌺1)1 2` is 8 characters and `f⌺1⊢1 2` is 7, a newcomer might be more likely to see `f⌺1⊢1 2` over `(f⌺1)1 2`.

#### Prefix notation is better

Prefix notation for function calls is better because it does not suffer from any of those problems. Lisp languages are the perfect example of this. They all use prefix notation for function calls. In all of these languages, it is trivial to write a function of more than two parameters, or with optional parameters. The syntax for function calls in Lisp languages also entirely avoids the order-of-operations ambiguity presented in the APL example above.

For example, if you needed to define a function in Clojure with optional parameters that would be equivalent to APL's `Replace` (at least a simpler version that would work with the example above), all you would have to do is use a rest parameter that can receive a map. With some de-structuring you can set default values if any or all of the arguments after the first three are omitted:

```clojure
(defn apl-replace [s pattern repl & {:keys [ic mode neol] :or {:ic false :mode \L :neol false}}])
```

I won't compare the implementation differences here of a function like `Replace` in APL and Clojure. But I'm almost positive that the Clojure implementation would be much simpler to write and understand for developers of equal proficiency in each language.

### Extensive use of combinatory logic

[The first problem of Advent of Code 2022](https://adventofcode.com/2022/day/1), asks you to read a file. There are two kinds of lines in the file, lines containing nothing but a numeric string, and empty lines. The first part of the problem is to create a nested array where adjoining lines of numeric strings are grouped together.

To do this in a functional language, after reading the file into a string and splitting by new lines, one popular way of creating this nested array is to use a partition function. In Clojure one could use the `partition-by` function that takes two arguments, a function that returns a boolean and a collection. If the function returns true for an index `i`, then the collection will be partitioned at that index.

When I tried to solve this problem in APL, I realized that partitioning works differently. APL's partition function (`⊆`) does not accept a function that returns a boolean. Instead, it expects an array of 1s and 0s, let's call it `b`. You can call it like this: `b ⊆ a`. If `b[i]` is a 1, then `a` would be partitioned at index `i`. When I learned this, I tried to solve this problem by doing the following:

```apl
(~{''≡⍵}¨file) ⊆ file
```

If you are a developer, chances are that the first thing that came to your mind as a way to do this is to use a `filter` function. In JavaScript, this would look like this:
```javascript
const evens = ints.filter(x => x % 2 == 0);
```

`filter` functions are really common. Almost every popular language has a built-in `filter` function. They are especially useful in functional languages. Despite APL having functional qualities, it does not have a `filter` function. When I was first learning APL, if I were given the problem statement above, I would have probably written the following to get around the lack of a `filter` function:

```apl
(~2|ints)/ints
```
However, I believe that a more idiomatic way to do this would be the following:
```apl
((~2∘|)⊢⍤/⊢)
```

In essence, this expression creates a binary array `b`. If `b[i]` is a 1, that means that `ints[i]` is odd. Next, I invert `b` so that 1s are 0s and 0s are 1s. Next, I use the `Replicate` function to return each element of `ints[i]`, `b[i]` times. If `b[i]` is 0, then `ints[i]` will get removed. If `b[i]` is 1, then `ints[i]` will remain.


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

<sup><a id="fn.2" class="footnum" href="#fnr.2">2</a></sup> Of course, in APL, there is a much more idiomatic way to do this: `v + 1`. However, for this example, I wanted to demonstrate the `Each` function.

<sup><a id="fn.3" class="footnum" href="#fnr.3">3</a></sup> You might say that Haskell suffers from the same problem. After all, technically, all Haskell functions can only take at most one argument. Functions that seem to take `n` arguments are just a function returning a function, returning a function...`n` times. While this is true, there is decided difference that makes this a non-problem in Haskell. Haskell makes it extremely easy and natural to write functions that return functions because that's just the standard way to write functions. The syntax hides this from you so much that you don't even realize you're doing it. Your functions will look very similar to functions in an imperative language. In contrast, I don't think that writing functions that return functions is so easy and natural in APL. It seems to me that if you wanted to write a function that needed three or more inputs, you would have to carefully write some particular and nuanced code to do so.

---
title: "Reflection on fasterthanlime's post on Go"
date: 2024-04-16
description: "I reflect on fasterthanlime's post on Go: \"I want off Mr.
  Golang's Wild Ride\""
publish: true
layout: ../../layouts/BlogLayout.astro
tags:
  - programming-languages
  - go

---

I recently read a post by [fasterthanlime](https://fasterthanli.me/): [I want to get off Mr. Go's Wild Ride](https://fasterthanli.me/articles/i-want-off-mr-golangs-wild-ride). I will refer to this post, for brevity, as "Mr. Go's Wild Ride". Also for brevity, I'll refer to the author by their first name, Amos, instead of their moniker `fasterthanlime`.

I'm a big fan of Go. I use it for my work and occasionally for my personal projects. Even though this post is very anti-Go, I really enjoyed reading it because I found it useful as a means to learn more about programming languages. Many of the flaws that the author pointed out were things I had never come across, or things that I hadn't realized were flaws.

## At a glimpse

At a glimpse, I believe that Amos was trying to make the following points:

- When a program interfaces with a complex entity, it will inevitably inherit complexity.
- Abstracting complexity is not the same as removing complexity.
- Go markets itself as removing complexity, when in reality it is abstracting complexity.
- It is a bad thing if a tool abstracts complexity in such a way that either takes away users' ability to manage complexity or indicates incorrect information.
- Go does this.

## Amos: Go sacrifices correctness in its file API for Windows

Amos gives a few examples of how Go sacrifices correctness in the name of simplicity in its file system API. Go's file system API is very specific to Unix. Amos seems to make the point that as a result of this, Go's file system API is awkward and inaccurate.

For example: file modes aren't really a thing in Windows. Instead, Windows has [File Attributes](https://learn.microsoft.com/en-us/windows/win32/fileio/file-attribute-constants). If you were on Windows and asked Go to get you the mode of a file, Go will read its file attributes, and translate their equivalents to a Unix mode. Amos seems to make the point that Go shouldn't even let you read the mode of a file in a Windows environment. It should only let you get its file attributes. The file mode that Go returns for a Unix file might be a close *equivalent* of the file attributes, but these two things are not the same.

Amos discusses the `os.Chmod` function as another inaccuracy in Go's file API. Again, since modes don't exist in Windows, this function does its best to do the Windows equivalent of the Unix command `chmod`. Turns out, the only thing that this function can do is set or clear the read-only bit. This function receives a value of type `uint32` that will be treated more like a `bool`. Either [use `0400` to make a file read-only, or `0600` to make it writable and readable](https://cs.opensource.google/go/go/+/refs/tags/go1.22.2:src/os/file.go;l=589-590). According to Amos, in this context, it doesn't make sense to use a type of `uint32`, because a `uint32` type can represent 2<sup>32</sup>-1 values. This type argument is not accurately reflecting what the function is actually doing.

It seems like overall, Amos feels like Windows support for the Go's file API was an after-thought: as if Go is trying to fit a round peg in a square hole by making Windows file operations work in the context of Unix functions. It seems like Amos would have wanted for Go to have a file API that can be divided into two parts: Unix file operations (which would only be usable in Unix-family machines) and Windows file operations (which would only be usable in Windows).

Amos goes on to give an example of a file API that provides good support for both Unix and Windows file operations, the Rust file API.

### My reaction

I see where Amos is coming from. Yes, Go's `os` package, the file API that Amos is referring to, is Unix-centric. It's declared proudly in the [first line of the package description](https://pkg.go.dev/os):

> Package os provides a platform-independent interface to operating system functionality. The design is Unix-like...

Yes, this means that the `os` package could be awkward to use on Windows.

I just wanted to comment on one thing here to advocate for Go a little bit. If you really wanted to write Go code for Windows that interfaces with the Windows file API, you could directly use the `syscall` package that Go provides. Go does this thing where certain packages, including `syscall`, have a different API for each OS environment. So, `syscall` has its own dedicated API for OSX (`darwin/amd64`), Windows (`Windows/amd64`), Linux (`linux/amd64`) and even WebAssembly (`js/wasm`). By using the `syscall` package for Windows, you could directly call Windows-specific functions like `GetFileAttributes` or `GetFileInformationByHandle`.

Having said that, I agree that it's not enough. It does feel one-sided that the `os` package is biased to Unix. If you wanted to write cross-platform code, it seems like you would have to use the `os` package for Unix machines and, in some cases, `syscall` for Windows machines. And, it would be nicer to only need to use the `os` package.

I agree that the Rust file API, while more complex, probably has a better interface for writing cross-platform code. As Amos writes, it exposes "only what all supported operating systems have in common." If you needed to write code that is specific to Unix, you would use libraries that would only compile on Unix. And, I believe the same would go for Windows.

## Amos: Go sacrifices correctness in its file API, for Unix as well

Amos makes the point that Go not only sacrifices correctness in its file API for Windows. Amos gives examples of how Go over-simplifies things, even in Unix environments that lead to inaccuracies.

One example is file paths: Across Go standard library packages, notably the `os` and `path/filepath` packages, Go uses the `string` type to represent file paths. This is very simple. However, technically, Unix supports arbitrary sequences of bytes as file paths. Paths can be composed of bytes outside of the UTF-8 character set. On the other hand, Go strings can only contain bytes within the UTF-8 character set. As a result, if there was ever a file path that was not valid UTF-8, Go would silently fail in being able to represent it.

In another example, Amos shows that Go's `path/filepath.Ext` function doesn't quite work as expected for some inputs, like for example: `filepath.Ext("/.foo")` returns `".foo"`.

Amos gives two other examples of how Go's `Ext` function doesn't work in the way they expect. In the first example, Amos says that `Ext` returns `.txt\bar` as the extension for the input `C:\foo.txt\bar` on Unix. But, this seems fine to me. Rust does the same thing in a Unix environment. In the second example, Amos writes that Go is unable to give a different extension for `"/foo."` and `"/foo"`. But, I could not replicate this. To me, [this gives consistent behavior](https://go.dev/play/p/Ch1d6YmucL5) with Rust as well. Go returns `"."` instead of `Some("")` and `""` instead of `None`. But these are semantically equivalent in the Go API. Go consistently uses the empty string as a path to represent `None`. It also consistently includes the `.` character in the extensions it returns.

### My reaction

My immediate reaction to the first two examples is that these are tiny imperfections that I don't care about. Sure, maybe using `strings` for Unix file paths isn't perfectly compliant. But, does it really matter? After all, even the native `ls` command doesn't function properly when you have files without UTF-8 characters! The return value for the second example seems not a fault of Go, but rather the result of an authoritative spec of what constitutes a file extension. These examples seem a bit contrived.

But, I can't judge this post on the basis of these two points. I think Amos's point is not that Go is bad because of these two imperfections in isolation. I think that their point is that there are many tiny correctness imperfections in Go that quickly add up. All of these correctness sacrifices stem from its core philosophy of prioritizing simplicity.

## Amos: Go sacrifices correctness in its use of types

Amos quickly seems to indicate that Go's simple type system is another example of Go abstracting complexity in a way that sacrifices correctness.

Go does not have support for `Result` sum types. Amos writes that one could theoretically call a Go function that returns a invalid value and an error, ignore the error, and then use the invalid value when they're not supposed to:

> With a Go function, if you ignore the returned error, you still get the result - most probably a null pointer.

### My Reaction:

Indeed, one could theoretically ignore an error and use an invalid value. But I don't think this is a flaw in Go's type system or a quality that impacts its correctness. Go has such a strong convention about never blindly using a value that a function returns before checking for its error, that it would be really strange and really rare to see code that does so. I suspect very few bugs in production code are rooted in this problem, and the ones that are I suspect are written by beginners in the language that probably shouldn't have pushed to production without first learning the basics of the language. The blame for a circumstance like this can't be pinned on Go.

I know that there's a lot of love out there — especially from functional programming enthusiasts — for Sum types like "Option" and "Result." I grew to see their value after my experience writing Elm. I can see that "Option" is valuable because it has a clean way to communicate the absence of a value. I can see that "Result" is valuable because it has a clean way to communicate the success or failure of an operation. I just personally think that Go is already able to do these things, for the most part, without needing `Option` and `Result`. Go already can communicate the absence of a value by using zero values. Also, it can already communicate failure by returning an `error` as the second return type of a function.

Of course, it's not perfect. I think there's a happy medium between having a really strong static type system and a really weak dynamic type system. Perhaps Go could benefit from being a bit closer to the former. But, I don't think it's too far off and it's not one of the things that actively bother me about the language.

## Summary of the rest of the article

Okay. I planned to go over every point in the entire article. But, I started realizing that if I continued things might get a little redundant because the majority of the remainder of the article are two examples to highlight the same overall point: Go abstracts complexity in a way that sacrifices correctness and takes power away from the user.

The first example seems to be about how Go's build constraints can be hard to maintain, biased to Unix (again), and insufficiently powerful (to the extent that a lot of Go code resorts to executing platform-specific behavior at run-time instead of compile-time). The second example is about how the Go team introduced the ability to use monotonic time in a simple way. In doing so, they ended up making a very subtle breaking change, made the API degrade in correctness for edge cases, and made all users pay an unavoidable performance cost.

## Why I believe there's a difference in our perspective

I originally wrote this post because I wanted to see if Amos's post could uncover things that I never knew about Go that would disillusion me from loving the language. But that didn't happen. I still like it. I think the reason for the stark difference in perspective between Amos and me is that we are expecting a different utility of Go. Go is good at the things I need it for. Go is bad at the things that Amos needs it for.

Amos seems to be focused on stuff that is a little more low-level than many of the things that I've worked on. I use Go for medium to large-scale micro-services and data pipelines. These are vastly different use cases. I rarely have to fidget with Go's file API, let alone carefully write code that compiles across platforms. It makes sense that Amos loves Rust. Rust is a lot more specialized for the sorts of things that (I believe) that Amos does.

## Something I learned from this post: Go is not really a nicer C

I've heard on some occasions from different people that Go is a "nicer C." It makes sense at first glance. After all, the syntax can look similar in some places, it also has a simple type system, it has some reputation of being faster than many other general purpose languages like Java and Python, and it can also compile to a binary. After you take into account the fact that Go additionally offers garbage collection, a pretty killer concurrency model, and an expansive standard library, it can definitely seem like a nicer C.

After reading this post, I came to realize that this is not true. Go's philosophy of favoring simplicity over lower-level control and accuracy throws a wrench into that analogy. The Go team seems to have two goals that are at odds:

- Making a simple and intuitive language.
- Making it an expressive language that gives the programmer full access to all the gory details of the messy world that their software runs on.

It seems to me like the Go team simply gives higher value to the first one than the second. I think a good testament to this is that Rob Pike, a big figure in the design and development of Go, [retrospectively realized](https://youtu.be/yE5Tpp2BSGw?si=JN3az8j80xm9mqza) that he would have added arbitrary-precision integers to the language. This is certainly a stance that prefers simplicity and protection over low-level control and performance.

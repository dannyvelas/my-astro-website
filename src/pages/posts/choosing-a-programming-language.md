---
title: 'Choosing a programming language'
date: '2026-01-06'
publish: true
layout: ../../layouts/BlogLayout.astro
tags:
  - programming-languages

---

I've spent that last few months playing around with different back-end programming languages.

When I was newer to programming, I thought that the most important attributes of a programming languages lied in its syntax. I would say that I liked Python more than Java because I didn't have to write curly braces, or because the ternary conditional operator felt more readable.

Later on, after programming for some years, I started realizing that there's a lot more depth to programming languages. There are many topics and concepts to discuss when comparing programming languages, that are much more interesting than: "hey, does this language require semicolons?"

Because language syntax is much easier to see and understand than language semantics, a lot of internet discussion about a programming language will revolve around silly syntax stuff. These discussions miss the point of what, I think, newer programming languages should try to do if they want to be successful — offer a unique combination of features that fills an unmet need.

The languages I've been playing with do precisely this. They are the result of a very specific vision to fill a very specific need. These needs can be so specific though, that sometimes it can be hard to differentiate between the use-case for one language and another. For example, Rust and Zig are both newer systems languages that offer excellent modern tooling and advanced meta programming capabilities. Without delving deeper, it can be hard to see when it would make more sense to choose one over the other.

To remember the use-cases for each language I've played around with, I created this decision flowchart. I'm posting it here because I figured it might be useful to other people.

This flowchart isn't meant to be an "end-all be-all" tool to pick a programming language for any use-case, for any person. That would be a herculean undertaking. This flowchart is made for people who are:

- Not optimizing for programming language popularity or maturity.
- Not building a quick little script, instead actually building a project
- Trying to pick a general purpose language
- Specifically targeting an embedded/computer/server environment, not mobile or front-end

```mermaid
flowchart TD
  A(["Start"])
  A --> memoryMgmt{"Do you need control of memory management"}
  memoryMgmt --> |Yes please| powerOrSimpleNoGC{"Power or simplicity?"}
  powerOrSimpleNoGC --> |Bare-bones simplicity| C
  powerOrSimpleNoGC --> |Some power, some simplicity| cOrGo{"Do you prefer C syntax or Go syntax?"}
  cOrGo --> |C| C3
  cOrGo --> |Go| Odin
  powerOrSimpleNoGC --> |Full Power| cInterop{"Do you need good C interop?"}
  cInterop --> |No| Jai
  cInterop --> |Yes| borrowOrFast{"Is a steeper learning curve and complexity worth rigorous compile-time guarantees?"}
  borrowOrFast --> |"Yes"| Rust
  borrowOrFast --> |"No"| Zig
  memoryMgmt --> |Nope!| powerOrSimplicityGC{Power or simplicity?}
  powerOrSimplicityGC --> |Most simple| functionalQuestion{"Do you like purely functional programming?"}
  functionalQuestion --> |No| Go
  functionalQuestion --> |Yes| concurrencyVsProcessing{What's more important: concurrency or raw processing speed?}
  concurrencyVsProcessing --> |Concurrency| Gleam
  concurrencyVsProcessing --> |Raw processing speed| Roc
  powerOrSimplicityGC --> |Some power, some simplicity| V
  powerOrSimplicityGC --> |Slightly more power and less simplicity| Nim
  powerOrSimplicityGC --> |Most power| ooExpressivenessVsJVM{"is OO expressiveness worth being on the JVM?"}
  ooExpressivenessVsJVM --> |No| OCaml
  ooExpressivenessVsJVM --> |Yes| Scala
```

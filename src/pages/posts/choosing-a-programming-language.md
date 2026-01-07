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

The languages I've been playing with do precisely this. They are the result of a very specific vision to fill a very specific need. These needs can be so specific though, that sometimes it can be hard to differentiate between the use-case for one language and another. For example, Rust and Zig are both newer systems languages that offer excellent modern tooling and advanced meta-programming capabilities. Without delving deeper, it can be hard to see when it would make more sense to choose one over the other.

To remember the use-cases for each language I've played around with, I created this decision flowchart. I'm posting it here because I figured it might be useful to other people.

Some caveats:

- This flowchart isn't meant to be an "end-all be-all" tool to pick a programming language for any use-case, for any person. That would be a pretty massive chart. This flowchart is made for people who are:
  - Not necessarily optimizing for a popular language. Instead, optimizing for technically "the right tool for the job".
  - Building a project, as opposed to writing a script or solving an algorithmic problem.
  - Aiming for a general purpose language.
  - Specifically targeting a computer or server environment, not embedded, mobile, or front-end.
- This flowchart ignores domain-specific cases where one language is the de-facto standard. Like for example, in competitive programming C++ is the standard. But, that's not mentioned here.
- If you're not optimizing to necessarily use the right tool for the job, and instead are optimizing for fun and learning, ignore this chart! Choosing a technology solely for fun/learning can be a valid use-case.

```mermaid
flowchart TD
  A(["Start"])
  A --> memoryMgmt{"Do you need control of memory management"}
  memoryMgmt --> |Yes please| powerOrSimplicityNoGC{"Expressive power or simplicity?"}
  powerOrSimplicityNoGC --> |Bare-bones simplicity| C
  powerOrSimplicityNoGC --> |Some power, some simplicity| cOrGo{"Do you prefer C syntax or Go syntax?"}
  cOrGo --> |C| C3
  cOrGo --> |Go| Odin
  powerOrSimplicityNoGC --> |Full Power| gameOrGPU{"Are you coding a AAA game?"} 
  gameOrGPU --> |No| learningCurveWorthBorrow{"Is a steeper learning curve and complexity worth rigorous compile-time guarantees?"}
  gameOrGPU --> |Yes| standardQuestion{"Is using the industry standard important to you?"}
  standardQuestion -->|No| Jai
  standardQuestion -->|Yes| C++
  learningCurveWorthBorrow --> |No| lowLevelQuestion{"How low-level are we talking?"}
  lowLevelQuestion --> |"Low."| Zig
  lowLevelQuestion --> |"Ehh not that low"| NimNoGC["Nim (No GC)"]
  learningCurveWorthBorrow --> |Yes| Rust
  memoryMgmt --> |Ew, no.| shipFastQuestion{Do you need to ship something from scratch really fast?}
  shipFastQuestion --> |No| messyDomain{"Are you coding in a messy domain where you need killer modeling power (e.g. complex class hierarchies/HKTs/Type classes/metaprogramming)?"}
  shipFastQuestion --> |Yes| JS/TS/Python 
  messyDomain --> |What does HKT stand for?| functionalQuestion{"Do you like functional programming?"}
  functionalQuestion --> |Not really...| expressivePowerOrPopularity{"Expressive power or Veteran status? Pick one."}
  expressivePowerOrPopularity --> |Expressive Power| V
  expressivePowerOrPopularity --> |Veteran status| Go
  functionalQuestion --> |I do!| lispQuestion{How do you feel about Lisp?}
  lispQuestion --> |Eh| concurrencyVsProcessing{Great concurrency or raw processing speed, pick one}
  lispQuestion --> |Love it!| Clojure
  concurrencyVsProcessing --> |Great concurrency| Gleam
  concurrencyVsProcessing --> |Raw processing speed| Roc
  messyDomain --> |Yes| enterpriseScale{"Are you aiming for enterprise-scale maintainability or a lone-genius masterpiece?"}
  enterpriseScale --> |A lone genius masterpiece| functionalQuestionPower{Do you like purely functional programming?}
  functionalQuestionPower --> |Not really...| Nim["Nim (GC)"]
  functionalQuestionPower --> |I do!| Haskell
  enterpriseScale --> |Enterprise-scale maintainability| standardQuestionNoGC{"Is using the industry standard important to you?"}
  standardQuestionNoGC --> |No| ooExpressivenessVsJVM{Is OO support worth running a JVM?}
  ooExpressivenessVsJVM --> |No| OCaml
  ooExpressivenessVsJVM --> |Yes| Scala
  standardQuestionNoGC --> |Yes| Java
```

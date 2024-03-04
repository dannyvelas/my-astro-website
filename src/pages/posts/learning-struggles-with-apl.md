---
layout: "../../layouts/BlogLayout.astro"
title: 'My idea of a cool new programming language'
publishedDate: 2024-02-25
description: 'Spec of a programming language that might be cool to develop'
author: 'Daniel Velasquez'
tags: ["career"]
---

## Learning struggles with APL

Even if a developer of a popular language were interested in learning APL, they may get deterred from continuing to learn because of some difficulties:
- Every function is called using infix notation and this can make order-of-operations seem inconsistent at times.
- Array languages require extensive use of combinatory logic for writing idiomatic programs. Combinatory logic is rarely used in popular languages. So it can be quite hard for newcomers to understand idiomatic array language expressions.
- There are some non-intuitive things about the way rank polymorphism works (e.g. `f¨⊂Y` is not the same as `f Y`).


### Order-of-operations seem inconsistent at times

Consider these two APL expressions: (suppose `f` is this user-defined function: `{⊃⍵}`)
- `f⍋3⍴1 2`
- `f⌺1⊢1 2`

These two expressions have a seemingly similar structure: `<function> <glyph> <number> <glyph> <number> <number>`. However, shockingly enough, these two expressions will have a different evaluation order. The first one will evaluate strictly right-to-left, equivalent to: `f⍋(3⍴(1 2))`. The second expression, in contrast, will evaluate like so: `(f⌺1)(⊢(1 2))`. There are reasons for this, and these reasons might be obvious to a seasoned APL developer. However, this is unintuitive to a newcomer.

You could avoid the order-of-operations ambiguity in the second example by wrapping the first part in parenthesis: `(f⌺1)⊢1 2`. At this point, a newcomer may realize that they can simplify the expression to `(f⌺1)1 2`. Unfortunately, this form is not idiomatic APL. Idiomatic APL seems to be more about terseness than readability for newcomers. Since `(f⌺1)1 2` is 8 characters and `f⌺1⊢1 2` is 7, you'll often see APL developers suggest using `f⌺1⊢1 2` over `(f⌺1)1 2`.


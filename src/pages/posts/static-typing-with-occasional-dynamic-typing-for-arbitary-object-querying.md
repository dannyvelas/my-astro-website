---
title: 'Static typing with occasional dynamic typing for arbitrary object querying'
date: 2024-04-21
publish: true
layout: ../../layouts/BlogLayout.astro
tags:
  - programming-languages
  - go
  - typescript

---

I recently came across a paper titled: [Static Typing Where Possible, Dynamic Typing When Needed: The End of the Cold War Between Programming Languages](https://www.researchgate.net/publication/213886116_Static_Typing_Where_Possible_Dynamic_Typing_When_Needed_The_End_of_the_Cold_War_Between_Programming_Languages).

The basic idea of this paper is that two groups of people disagree with each other: those that are strongly in favor of static typing, and those that are strongly in favor of dynamic typing. Developers of type systems, instead of trying to create purely static and purely dynamic type systems, should try to create a type system that is somewhere in between. Type systems that are static as much as possible, but allow the developer to occasionally resort to dynamic typing, would be able to leverage the strengths of both static and dynamic typing.

I agree that people can be very one-sided when it comes to discussions about type systems. Even programming languages can feel very one-sided. The type systems of some programming languages are predominantly dynamic. They make it difficult, if not impossible, to occasionally statically type some values. Clojure might be a good example of this. The type systems of other programming languages are predominantly static. They require every value to have a type that is determined at compile-time. It can be taxing or annoying to define types meticulously all the time. Go could be an example of this.

Typescript might be a good example of a language that has a type system that is somewhere in the middle. Typescript encourages you to use static typing as much as possible. However, it lets you "turn off" static typing for some values by declaring them with a type of "any". Using "any" in typescript might be generally frowned upon. But, I find it useful sometimes. When writing Typescript, I've found myself in situations where I need to write a program that interfaces with untyped data. In these cases, I could spend 30 minutes looking up typing documentation and creating complex datatypes so that I can satisfy the compiler. Or, I could simply declare a variable as "any." In some cases, it's made more sense for me to opt for the latter approach. The cost of time and effort in defining types is sometimes not worth the benefits of static typing.

I agree that ideally, a programming language should encourage you to use static typing as much as possible and resort to dynamic typing when needed. I think there are two ways that a programming language could do this:

- The type system of the programming language allows for both static and dynamic types (like Typescript). Let's call this a "hybrid" type system.
- The type system of the programming language is fully static, but it allows you to mimic dynamic behavior via library functions.

I believe that the second approach might be better. The second approach, to me, seems to discourage the use of dynamic types a little bit more. As such, it makes it harder for weakly typed values to virally spread through a codebase or a call stack.

It would be ideal to use a language that encourages static typing but allows you to opt for dynamic typing when accessing deeply nested fields of arbitrary JSON objects. I will give an example of how a programming language with a "hybrid" type system would allow you to do this, and an example of how a programming language with a static type system would allow you to do this via functions.

## Accessing deeply nested fields of a JSON object with a hybrid type system

Suppose you have a JSON value as a string that looks like this, stored in a variable called `jsonString`:

```json
{"some": {"value": [{"which": {"is": {"deeply": "nested"}}}]}}
```

In Typescript, if you wanted to access the most deeply nested field of `jsonString`, you could do something like this:

```typescript
const parsedJSON = JSON.parse(jsonString)
const nested = parsedJSON.some.value[0].which.is.deeply
```

This works because `JSON.parse` returns a value of type `any`. Static typing is off, so you could query for any arbitrary path of `parsedJSON` without the compiler screaming at you.

Of course, if you tried to access a non-existing path of `jsonString`, e.g. `parsedJSON.some.nonexisting.path.here`, this would throw a type error exception:

```
Uncaught TypeError: Cannot read properties of undefined (reading 'path')
```

In this case, it might be better to use something like the `lodash` [get function](https://lodash.com/docs/4.17.15#get), which would simply return `undefined`.

```typescript
const nested = _.get(parsedJSON, "some.nonexisting.path.here") // undefined
```

## Accessing deeply nested fields of a JSON object with a static type system

I'll use Go to demonstrate this example. In Go, you could use a library like `gjson`:

```go
result := gjson.Get(jsonString, "some.value[0].which.is.deeply").String()
```

This is really cool because you get the same conciseness as you get in Typescript, but the output value is not an `any` value that switches off static typing guarantees. `result` is a statically typed value.

There are just two issues with this solution in Go:

- It's not a widely supported method. It's not a common idiom and this method is not in the standard library. So, it would be pretty rare in practice to see code like this. More likely, you'll see people define a bunch of datatypes and unmarshal the JSON into those datatypes.
- This solution does not use the ["comma ok" idiom](https://go.dev/doc/effective_go#maps). Right now, with `gjson` the only way to differentiate between a return value from the `Get` function for a field that does not exist, and a field that does exist, but is set to empty is by doing an additional functional call. One would have to call [`result.Exists()`](https://pkg.go.dev/github.com/tidwall/gjson#Result.Exists). It would be cleaner if one `gjson.Get()` could return something like `(gjson.Result, bool)`. This way it would be more concise to check for existence or non-existence of values.

It would be cool to see a language that has static typing, built-in support for arbitrary object-querying, and a concise way for checking for existence.

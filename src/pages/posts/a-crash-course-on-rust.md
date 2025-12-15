---
title: 'A crash-course on Rust'
date: '2025-12-15'
publish: true
layout: ../../layouts/BlogLayout.astro
tags:
  - rust

---

I wrote this article to serve as a crash-course on Rust for my reference and possibly for the benefit of other people interested in learning the language. This article serves a different purpose than [the Rust book](https://doc.rust-lang.org/book). It is meant to provide a high-level overview of what are, in my opinion, the most important semantics to understand in the language as a beginner. As such, in contrast to the Rust book, this article wastes no time on syntax (variables, conditionals, control-flow, functions, etc) doesn't go as in-depth into some concepts (lifetimes), and omits other concepts entirely (concurrency, generics, packages, among others).

## Motivation

Let's start with why Rust was created. In other words, what problems Rust solves that weren't being solved by any language before it. Unfortunately, it seems like there's some misconception on this area. I've heard people explain that the "killer feature" of Rust is that it allows you to write programs with no memory leaks, without the need for a garbage collector. They seem to think that one of the jobs of the borrow checker is to statically check for memory leaks in your program, refusing to compile your program if one is found.

But, none of this is true. Rust does not prevent memory leaks. And no, this isn't a sly or tongue-in-cheek statement to talk about the dangers of `unsafe`. *In totally `safe` Rust, you can write code which leaks memory*. There are even functions in the standard library that allow you to leak memory like `std::mem::forget`. But, you could alternatively leak memory in many other ways, like creating a cycle of `Rc` objects, or [initializing a collection full of values with destructors, and then starting an infinite loop that never references it](https://doc.rust-lang.org/nightly/nomicon/leaking.html).

The mission of Rust is actually to prevent *undefined behavior*. Why? Because undefined behavior in your program's execution is a correctness issue at best, and a major security vulnerability at worst. In Rust, memory leaks are not considered *undefined behavior* because leaking memory and heap exhaustion (although undesirable) are well-defined behaviors that can't be exploited.[^1]

Rust uses built-in tooling to prevent undefined behaviors. The developers who made Rust realized that if you follow a given set of rules whenever you write a program, that program will be free of undefined behavior. So, the Rust developers built checks into the Rust compiler to make sure that those rules are being followed. These checks will give you an error that prevents your program from compiling if you are violating one or more rules. In essence, this means that if your Rust program compiles, it passes the rules, and therefore doesn't have undefined behavior. There are exceptions to this though. Rust allows you to compile programs that violate its rules if you use the `unsafe` keyword. This keyword is an escape hatch you can apply when you feel like the compiler is being overly restrictive in a situation where you know better.

The main types of undefined behavior errors in the wild are:

- Using memory after it's been freed: "use after free"
- Freeing memory twice: "double free"
- Null dereference
- Race conditions
- Data races

There are three kinds of checks that Rust runs, ownership checks, lifetime checks, and type checks:

- Ownership checks make sure that there are no "double free" errors, race conditions, and data races in a program.
- Lifetime checks make sure that there are no "use after free" errors in a program.
- Type checks make sure that there is no undefined behavior from null dereference in a program.

<details class="my-4">

<summary><strong class="text-2xl font-bold">Kinds of undefined behavior</strong></summary> 

<div class="px-4">
  <details class="my-4">
  <summary><strong class="text-xl">Use after free</strong></summary> 

A "use after free" error is kind-of self-explanatory.

Suppose you allocated some memory on the heap at memory location `0xABCD` to hold some object called `my_object`. A "use after free" error happens when you call `free(0xABCD)` and then continue to use `my_object`.

This is undefined behavior because when your code continues to use `my_object`, it could theoretically continue running, assuming that `0xABCD` still holds a valid `my_object`. The actual contents of `0xABCD` are totally non-deterministic and as such can cause random behavior. `0xABCD` could now be holding a totally different value of a totally different type, or maybe a part of one.

If an attacker can somehow reliably cause a "use after free" error in your program, and set a new value of their choosing at `0xABCD`, they could maliciously alter the control-flow of your program. They could set `0xABCD` to some value that, when interacting with your code, will expose a sensitive value or interact with a private resource in an undesirable way.

  </details>

  <details class="my-4">
  <summary><strong class="text-xl">Double free</strong></summary> 

A `double free` is undefined behavior because it can cause a "use after free" error.

Suppose there exists some object `my_object` at `0xABCD`, and your code attempts to free `my_object` more than once.

The first "free" will free `my_object` as intended. After this though, there might be some other object `other_object` that gets allocated at `0xABCD`. A subsequent free intended for `my_object` will accidentally free `other_object`. After this, any code expecting `other_object` to still exist at `0xABCD` will cause a "use after free" error.

If there isn't some other object allocated at `0xABCD`, then "use after free" won't occur. But still, memory corruption might happen and this is still undefined behavior. If your memory allocator uses a "[free-list](https://en.wikipedia.org/wiki/Free_list)" data structure to keep track of free memory, the second call to "free" will add the memory block at `0xABCD` to the "free-list" a second time. This corrupts your memory allocators internal state, which means that future and totally unrelated interactions with it will start to behave in strange and unpredictable ways.

  </details>

  <details class="my-4">
  <summary><strong class="text-xl">Null dereference</strong></summary> 

"null dereference" is when your code expects a variable to hold a valid memory address, but that variable actually holds `null` instead.

Most of the time, this just results in a segmentation fault where your program crashes. But [in certain cases](https://en.wikipedia.org/wiki/Null_pointer#C), your program might actually try to read data from memory address `0`, the underlying value of `null`. In this context, your program will continue to execute, behaving non-deterministically based on whatever data was found at address `0`.

In this case, if a hacker can control the data at address `0`, they'll be able to control your program to some extent.

  </details>

  <details class="my-4">
  <summary><strong class="text-xl">Race conditions and data races</strong></summary> 

[No, these are not the same](https://blog.regehr.org/archives/490). And no, one is not a special case within the other; you could have one without the other.

A race condition is when some order of events transpire in your program, and as a result, the correctness of your program is compromised. A race condition can happen in a totally single-threaded context (no parallelism).

For example, suppose there are two references to the same object, called `my_object`, and one of the references is an iterator. Suppose that given a particular set of inputs, your program executes a path where one reference mutates `my_object`, and because of this, the iterator reference gets invalidated. Now that this iterator reference is invalidated, it will behave in an unpredictable way. Had the inputs been different, the control-flow of your program may have executed instructions in a different order which would not have corrupted the iterator. This is an example of a single-threaded race condition.

A data race when multiple threads are trying to read or write to the same section of data with no synchronization.

For example, suppose there are two threads that reference `my_object`. When both threads try to update `my_object` at the same time, it's unknown which thread will ultimately succeed. They may both succeed in partially updating `my_object`, leaving it in a corrupted state.

  </details>

</div>

</details>

<details class="my-4">

<summary><strong class="text-2xl font-bold">Ownership checks</strong></summary> 

<div class="px-4">
  <details class="my-4">
  <summary><strong class="text-xl">How ownership checks prevent double free errors</strong></summary> 

In Rust, just like in almost any other programming language, there exists the concept of a value. Values look like this: `"hi there"`, `123`, or `MyClass{...}`. Values are usually stored somewhere, like a variable: `let a = "hi there";` or `let a = foo();`. But, values can also be stored in a struct field: `MyClass{fieldOne: 123}`. The place where a value is stored is called the "owner" of that value.

There are two kinds of values, values that use resources and values that don't use resources.

Values that use resources:

- Values that use resources usually have a "destructor" function that frees those resources. For example, a `Vec` value, which allocates memory in the heap, has a destructor which will free that memory. An `OwnedFd` value (which stores an opened file descriptor) has a destructor which will close that file descriptor. In Rust, these destructor functions are called `drop`. If a value has this function, it is said to "implement the `Drop` trait".
- When a value that uses resources goes out of scope, it is the "owner"'s job to `drop` that value. Of course, `drop` should only be called once. For this reason, Rust dictates that every value should have exactly one "owner".

Values that don't use resources:

- Values that don't use resources are those that don't use the heap at all. They exist entirely on the stack or static memory. These values don't implement the `Drop` trait because there are no resources that should be freed. For example, simple values of a primitive type like `"hi there"` or `123` don't implement the `Drop` trait. So, in the statement: `let x = 123;`, when `x` goes out of scope, it won't `drop` anything.

#### Values that use resources

To demonstrate how ownership works in Rust for values that use resources, let's consider the following snippet, which uses a `String::from("hello")` value. This value is of type `String`, which allocates memory on the heap:

```rust
fn main() {
  // define a variable to hold a string
  let s1 = String::from("hello");

  // assign s1 to s2
  let s2 = s1;

  // print s1
  println!("{s1}, world!");
}
```

In this snippet, we're storing `String::from("hello")` into a variable called `s1`, we're assigning `s1` to `s2` and then we're printing `s1`. Seems pretty straightforward right? Well...it turns out that this code actually won't work. The Rust syntax is correct, but the borrow-checker won't be happy with this code.

In this example, we have a value that looks like this: `String::from("hello")`. As of the first line of the program, the owner of this value is `s1`. Next, we assign `s1` to `s2`. Remember that every value must have exactly one owner. As such, `String::from("hello")` can only be owned by `s1` or `s2`, but not both. As such, when this assignment happens, `s2` becomes the new owner of `String::from("hello")`. When `s1` loses its ownership, it shouldn't be usable anymore. As such, it will not be printable in the last line. For this reason, Rust gives us an error.

Whenever the ownership of a value changes from one variable or field to another, it is called a *move*.

#### Values that don't use resources

Now let's consider this other snippet of code which uses a value of type `&str`, which exists as a header on the stack, which points to static memory:

```rust
fn main() {
  // define a variable to hold a string
  let s1 = "hello";

  // assign s1 to s2
  let s2 = s1;

  // print s1
  println!("{s1}, world!");
}
```

In contrast to the previous example, this works perfectly without any problems. In the first line gives `s1` ownership over the value `"hello"`. The second line seemingly moves ownership from `s1` to `s2`. The last line prints `s1` with no issues.

The fact that `s1` is printable at the end, seems to suggest that `s1` retained ownership of `"hello"`. This would mean that both `s1` and `s2` are "owners" of the value `"hello"`. As such, this would contradict what we said earlier about how there can only be one "owner" per value.

But, that isn't quite accurate. The assignment, `let s2 = s1;`, didn't make both `s1` and `s2` co-owners of `"hello"`. This assignment actually created a brand new `"hello"` value for `s2`. So, in essence, `s1` retained ownership of the old `"hello"` value and `s2` got a brand-new `"hello"` value.

But, why did `s2` in this example get a brand-new identical copy of `s1`'s value, when `s2` in the previous example took ownership away from `s1`? This is because values that don't use resources usually have a `Copy` trait. This means that they will clone themselves on assignment instead of moving ownership. Rust forbids values that implement the `Copy` trait from also implementing the `Drop` trait. This means that if your value uses resources, it won't be able to clone itself on assignment. And, this makes sense. If a value `v` uses resources and gets cloned to another value `k`, they'll both point to the same resource (a shallow-copy). When both go out of scope, their respective owners will call `drop` and try to free that same resource, a double free error.

  </details>

  <details class="my-4">
  <summary><strong class="text-xl">How ownership checks prevent race conditions</strong></summary> 

A common kind of race condition is "iterator invalidation." This happens when you have an iterator `it` that references a container `my_container`, and something mutates `my_container` before `it` has finished reading `my_container`. This mutation makes `it` invalid. `it` was expecting `my_container` to remain unchanged.

In this example, the borrow-checker would have prevented this by statically making sure that `my_container` is referenced at all times by either A) multiple readers or B) one writer, but never both.

So, Rust would let you have multiple "read-only" references:

```rust
fn main() {
    // define container
    let my_container = vec![1, 2, 3];

    // multiple read-only references
    let it1 = my_container.iter();
    let it2 = my_container.iter();

    for i in it1 {
        println!("{i}");
    }
    for i in it2 {
        println!("{i}");
    }
}
```

And a single "write-and-read" reference:

```rust
fn main() {
    // define container
    let mut my_container = vec![1, 2, 3];

    // one write and read reference
    let write_ref = &mut my_container;
    write_ref[2] = 99;

    for i in my_container {
        println!("{i}");
    }
}
```

But Rust would not allow you to have multiple write-and-read references that are live at the same time:

```rust
fn main() {
    // define container
    let mut my_container = vec![1, 2, 3];

    // multiple write and read references
    let write_ref1 = &mut my_container;  //  --┐ write and read
    let write_ref2 = &mut my_container;  //    | reference "write_ref1"   --┐ write and read
    write_ref1[2] = 99;                  //  --┘ is live                    | reference "write_ref2"
    write_ref2[3] = 99;                  //                               --┘ is live

    for i in my_container {
        println!("{i}");
    }
}
```

Or a write-and-read reference that is live at the same time a read-only reference is live:

```rust
fn main() {
    // define container
    let my_container = vec![1, 2, 3];

    // one read-only reference         //                           -┐
    let it = my_container.iter();      //                            |
                                      //                            | read-only reference
    let write_ref = &mut my_container; // --┐ write and read         | "it" is live
    write_ref[0] = 99;                 // --┘ reference "write_ref"  |
                                      //     is live                |
    for i in it {                      //                            |
        println!("{i}");               //                            |
    }                                  //                           -┘
}
```

Thanks to this rule, race conditions like iterator invalidation is impossible in Rust.

For the purposes of this example, the "read-only" reference looked like this: `my_container.iter()` and the "write-and-read" reference looked like this: `&mut my_container`. But, a "read-only" reference to `my_container` would normally look like this: `&my_container`. Actually, this is the latter is usually called a "mutable borrow" and the former is usually called an "immutable borrow". This example shows the intuition behind the name *borrow*. The variables `it` and `write_ref` were never assuming ownership of `vec![1,2,3]`, they were merely borrowing it from `my_container` to temporarily read this vector, or write to it.

  </details>

  <details class="my-4">
  <summary><strong class="text-xl">How ownership checks prevent data races</strong></summary> 

Actually, Rust prevents data races in the same way that it prevents "double free" errors: by making sure that there is only one owner of a value. If a thread wants to mutate that value, it *must* assume ownership. The only exception to this is if the value is boxed inside of a `Mutex`. In this case, Rust would let you get a mutable reference to that value, but only once you do proper synchronization like locking and unlocking.

So, the following snippet would not work because `s1` becomes invalid in the `main` function after the thread spawns:

```rust
use std::thread;

fn main() {
    // define a string
    let s1 = String::from("Hello, World");

    // spawn a thread and move ownership into it
    let handle = thread::spawn(move || {
        let mut s = s1;
        s.push_str(" from Thread!");
        println!("{s}");
    });

    // print s1 again (this line will have a compile-time error)
    println!("{}", s1);

    handle.join().unwrap();
}
```

If Rust let `s1` still exist in the `main` function, then there would be two threads with unsynchronized access to the same underlying `String` data.

  </details>
</div>

</details>

<details class="my-4">

<summary><strong class="text-2xl font-bold">Lifetime checks</strong></summary> 

<div class="px-4">
  <details class="my-4">
  <summary><strong class="text-xl">How lifetime checks prevent "use after free" errors</strong></summary> 

Let's consider this snippet where a "use after free" error would happen:

```rust
fn main() {
  let x = get_string();
  println!("hi!");
}

fn get_string() -> &str {
  let new_string = String::from("hi!");
  return &new_string;
}
```

In this snippet, we're creating a new string (`String::from("hi!")`) which allocates some memory in the heap. We are then returning a reference to that value. However, the owner of `String::from("hi!")` is `new_string`, which goes out of scope when the `get_string` function returns. As the owner, `new_string` will call the `Drop` function of `String::from("hi!")` when `get_string` returns. This means that the value that `x` gets initialized to would now be referencing deallocated memory.

Rust's borrow-checker has the concept of a `lifetime`. A lifetime is just some static annotation for how long a value is expected to live.

In this case, Rust is able to deduce that since the `get_string` function does not take any arguments, it cannot possibly return a reference to data that will outlive its scope. So, it emits an error message that essentially says: "unless `get_string` returns a string that lives in static memory (and as such will exist for the entire duration of the program), this function is definitely going to return something that will be imminently deallocated. So fix it."

To fix this, we would have to make the `get_string` function return the `String` value itself, instead of a reference to it:

```rust
fn get_string() -> String {
  let new_string = String::from("hi!");
  new_string
}
```

This might seem problematic for a second. We said earlier `new_string`, as the owner, will call the `Drop` function of `String::from("hi!")` when `get_string` returns. Wouldn't this also lead to a dangling pointer problem?

Actually it won't. This is because now, when `get_string` returns, the ownership of `String::from("hi!")` will get taken away from `new_string` and given to `x` (in the `main` function). Remember the earlier example when `String::from("hello")` moved from `s1` to `s2`? Well, the exact same thing is happening here from `new_string` to `x`.

This means that the lifetime of `String::from("hi!")` has now been extended to be the entirety of the `main` function after the initialization of `x`.

  </details>
</div>

</details>

<details class="my-4">

<summary><strong class="text-2xl font-bold">Type checks</strong></summary> 

<div class="px-4">

  <details class="my-4">
  <summary><strong class="text-xl">How type checks prevent undefined behavior from null dereference</strong></summary> 

Safe Rust prevents null dereference through its type-checker. This is because every variable of type `T` that could potentially hold `null` has a special type. This type is usually `Option<T>`. Whenever a variable `v` is of type `Option<T>`, Rust does not allow your code to assume that `v` is set to some value. Rust forces you to first check whether `v` is `Option::None`. If your code does not first check whether `v` is `Option::None`, it will refuse to compile your program.

Okay, that isn't entirely true. You could theoretically use `expect` or `unwrap`. These functions let you get the value of `v` without checking whether it is set. If it turns out that `v` is actually unset, these functions would make your Rust program panic.

It might seem counter-intuitive that Rust allows developers to use `expect` or `unwrap` without an `unsafe` block. It seems as if `expect` and `unwrap` allow you to do null dereference. Since null dereference is undefined behavior, it seems like Rust is breaking its promise of not allowing undefined behavior by permitting use of these functions. `expect` and `unwrap` Do allow you to dereference values that are potentially unset, like `Option` values. But, this kind of null dereference is actually not undefined behavior. Actually, it is perfectly well-defined — Rust will make your program panic if a variable is unset.

  </details>
</div>

</details>

[^1]: I should mention that the majority of Rust programs that developers write probably free all resources correctly thanks to Rust's semantics. But still, preventing memory leaks is not quite the mission of Rust. It just happens to help prevent memory leaks to a considerable extent.

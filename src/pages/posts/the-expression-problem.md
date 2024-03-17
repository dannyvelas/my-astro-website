---
layout: "../../layouts/BlogLayout.astro"
title: 'The Expression Problem'
publishedDate: 2023-11-01
description: 'An explanation on what The Expression Problem is, how to solve it, and how to not solve it'
author: 'Daniel Velasquez'
tags: ["design-patterns", "clojure", "polymorphism"]
---

When I was a university student, my favorite class was a graduate class called "Compiler Construction." It was also the hardest class I've ever taken. Back in those days, I would track my time using [Toggl](https://toggl.com/). And, I realized that I spent somewhere between 30 to 40 hours per week, just on that one class. Although it was very time-consuming, I enjoyed every minute of it. We had a capstone project of building our own compiler within teams of three. Our compiler would read a language very similar to a subset of Python with static typing and emit RISC V assembly code. I remember going to sleep at late hours, crunching out some final lines of code for that project with sheer excitement about waking up early to go to my team standup first thing in the morning. I can't pinpoint exactly why I was so excited but I think it was a mix of being proud about the code I wrote and being very interested in the subject matter. I think this made me eager to share my updates and come up with new plans in standup.

I think I was interested in low-level development and programming languages before I took that class. But I think that class kind of cemented my interest in these topics because of how much fun I had. Nowadays, I'm trying to see how I can work on projects that gravitate around these interests either personally or professionally.

As I was working on my compiler I realized that I needed some way to recursively descend a syntax tree when doing type analysis and when generating assembly code. Thanks to [Bob Nystrom's Crafting Interpreters](https://craftinginterpreters.com/), I realized I could use the visitor pattern for this. 

Before explaining what the visitor pattern is, [Nystrom writes about why we need it](https://craftinginterpreters.com/representing-code.html#the-expression-problem). He writes that each language has a certain "grain" to it. Functional languages make it easy to add functions (behaviors), and object-oriented languages make it easy to add classes (representations). If you try to extend representations in functional languages or behaviors in object-oriented languages...well, good luck. It's not so easy to do. This is The Expression Problem.

Back then I had pressing deadlines so I didn't really delve deep on what this really meant. It's not that intuitive. If you search StackOverflow overflow for The Expression Problem, you'll find [answers that are outright wrong about what it is](https://stackoverflow.com/a/22180495/11587741).

I always remained curious in the back of my mind about it. Recently, I had some extra time on my hands so I decided to take a crack at understanding it. One of the best ways for me to learn things is to document them as a way to teach others. So, that's what this article is: it's me explaining to you what The Expression Problem is. 

The Expression Problem is a design-pattern problem in Computer Science. A computer scientist named this issue after the subject matter in which they experienced it: they were trying to parse or evaluate expressions. Suppose there is a base package of representations. And suppose that these representations will be imported by downstream packages. The goal is to define the base package in such a way that downstream packages can extend the base package with both new behaviors and representations, without necessitating any modifications to the source of the base package, while using static types and without using separate compilation.


## Terminology

For a reader to fully grasp this definition, they would need to fully understand the definition of the words "behavior" and "representation."


### Behavior

By "behavior," I mean a unit of logic that takes input and returns some output. Usually a unit of logic is called a "function". However, a unit of logic could also be, for example, one branch of a "switch" statement. Of course, "unit" here is very vaguely defined. For now, we can satisfy ourselves with the idea that a "unit" can be anywhere from one line of code to thousands, such that the start of the unit takes in some form of input. And the end of the unit returns some form of output. Again, "input" and "output" here are very vague. "Input" can refer to one or more variables in scope, that are used inside of a unit of logic, or an argument, in the case that the unit of code is a function. "Output" can refer to the last variable (or variables) that are set at the end of a unit of logic, or a return value, in the case that the unit of code is a function.


### Representation

By "Representation," I mean a collection of behaviors that conceptually represent an entity. In object-oriented languages, this is usually referred to as a "class", and each behavior is referred to as a "method." In functional programs, this is usually a module, which has several related functions that have some conceptual similarity.


## Example

To demonstrate this problem, I'm going to present [an example problem, similar to one originally presented in a post by Bob Nystrom](https://journal.stuffwithstuff.com/2010/10/01/solving-the-expression-problem/). To solve this problem, we would effectively solve The Expression Problem. I will present many non-solutions to this problem. In the end, I will show the only real solution that I've found to this problem.

Suppose we're developing a note-taking application. The application will be released for the first time with support for three modes: prose mode, whiteboard mode, and spreadsheet mode. Each mode has three core functionalities: users can load, edit, and save a file in each mode. After it is released, we will need to make a second release. The second release should have support for a few more modes: picture mode, video mode, and voice mode. The second release should also have support for more functionalities in each mode; users want to export, format, and select regions, in every mode.

We can think of modes as representations and functionalities as behaviors. Imagine a table where each column symbolizes a behavior, and each row symbolizes a representation that implements those behaviors. The implementation of the behavior of a representation will be symbolized by an `x` at the intersection of a row with a column. In the first release of our application, our note-taking app will have a base package that looks something like this:

|             | Loading | Editing | Saving |
|----------- |------- |------- |------ |
| Prose       | x       | x       | x      |
| Whiteboard  | x       | x       | x      |
| Spreadsheet | x       | x       | x      |

When we work on the second release, we would like to add both rows and columns to this table. There is one important restriction we must follow: the code of the first release will live in a base package. After the first release, any modification to this base package is off-limits. When we work on the second release, we would need to add new modes and new functionalities to each mode without touching the base package. The code of the second release must be separate.

We are in charge of working on the first release. **The problem statement is:** how can we model the modes and functionalities of the first release in such a way that both can be extended in the second release, without any modifications to the base package?

This problem statement comes with a restriction: whenever we add a new mode, the compiler should help us make sure that we implement every functionality for that mode. Equivalently, whenever we add a new functionality, the compiler should help us make sure that we implement that functionality for every mode. In other words, whenever we add a new row (or column) we should have an easy way to make sure there is an `x` for every intersecting column (or row). For the compiler to help us here, it needs to statically check all of the mode classes and the behaviors that are defined for them. So, the first restriction is that we must solve it in a statically typed language without resorting to dynamic casts.

This problem statement comes with one more restriction: we should use language features that don't require separate compilation.

We will show many different non-solutions to modeling this problem. Some approaches will be in a functional language, others will be in an object-oriented language. We will measure each approach against four criteria to gauge its effectiveness in solving The Expression Problem. These criteria are based on the criteria from [Dr. Ralf Laemmel's lecture on The Expression Problem](https://www.youtube.com/watch?v=FWW87fvBKJg). The more criteria an approach satisfies, the closer it is at solving the problem. If an approach satisfies all criteria, the approach effectively solves The Expression Problem. The four criteria are:

1.  Is it easy to add new behaviors in downstream packages without modifying the base package?
2.  Is it easy to add new representations in downstream packages without modifying the base package?
3.  Does this solution use static type checking?
4.  Does this solution require separate compilation?


## Non-solution: using sum types in a functional language

For our first approach, we will model this problem using a functional language using sum types. We will see at the end if this approach satisfies all four criteria for solving The Expression Problem.


### Base package

If we used sum types to model the problem in our first release, the "mode" type would look something like this in the base package:

```ocaml
type mode = Prose | Whiteboard | Spreadsheet
```

Per this approach, the natural next step would be to use pattern-matching functions for functionalities. Each branch of a pattern-matching function would correspond to a branch of the "mode" type. The code for functionalities in the base package would look something like this:

```ocaml
let load = function
| Prose ->       ;; prose load behavior
| Whiteboard ->  ;; whiteboard load behavior 
| Spreadsheet -> ;; spreadsheet load behavior


let edit = function
| Prose ->       ;; prose edit behavior
| Whiteboard ->  ;; whiteboard edit behavior 
| Spreadsheet -> ;; spreadsheet edit behavior

let save = function
| Prose ->       ;; prose save behavior
| Whiteboard ->  ;; whiteboard save behavior 
| Spreadsheet -> ;; spreadsheet save behavior
```


### Extending behaviors

Now that we've established an idea of what the base package looks like, let's see how we can extend the behaviors of the base package without modifying it. The simplest approach would be to import the base package to another module. In that module, we can create one pattern-matching function for each functionality we would like to add. Here are the definitions for export, format, and select in a module that imports the base package:

```ocaml
let export = function
| BasePackage.Prose ->       ;; prose export behavior
| BasePackage.Whiteboard ->  ;; whiteboard export behavior 
| BasePackage.Spreadsheet -> ;; spreadsheet export behavior

let format = function
| BasePackage.Prose ->       ;; prose format behavior
| BasePackage.Whiteboard ->  ;; whiteboard format behavior 
| BasePackage.Spreadsheet -> ;; spreadsheet format behavior

let select = function
| BasePackage.Prose ->       ;; prose select behavior
| BasePackage.Whiteboard ->  ;; whiteboard select behavior 
| BasePackage.Spreadsheet -> ;; spreadsheet select behavior
```

With this approach, our new package, which imports the base package, adds new behaviors to the base package. And, no new modifications to the base package were required.

### Extending representations

With this simple and idiomatic approach, if we wanted to add a new mode type, like "Picture", our approach would require us to modify the base package. This is because the simplest way to add a new representation of the "Picture" mode would be to add a new "Picture" branch to the "mode" type. Once we add this branch, we will also need to modify all of the pattern-matching functions of the base package. This is because the "load", "edit", and "save" functions won't compile if their pattern-matching expression is not exhaustive of all of the mode types. So, we would need to add one new "Picture" branch to each of those functions as well.


### Evaluation

In this approach, it was very easy to add columns to the table (behaviors) without modifying the base package. Yet it was impossible to add rows (representations) without modifying the base package. In total, this approach passed 3 out of 4 of our criteria:

| Criteria                   | Pass | Fail |
|-------------------------- |---- |---- |
| Extensible Behaviors       | x    |      |
| Extensible Representations |      | x    |
| Static Type Checking       | x    |      |
| No Separate Compilation    | x    |      |


## Non-solution: using classes and methods in an object-oriented language
Now, let's model our problem using classes and methods in an object-oriented language and see how many criteria this approach passes.

### Base package

In an object-oriented language, if we used classes and methods to represent modes and functionalities, respectively, the base package would look something like this:

```java
class Prose {
  public void load() { /* prose load behavior */ }
  public void edit() { /* prose edit behavior */ }
  public void save() { /* prose save behavior */ }
}
class Whiteboard {
  public void load() { /* whiteboard load behavior */ }
  public void edit() { /* whiteboard edit behavior */ }
  public void save() { /* whiteboard save behavior */ }
}
class Spreadsheet {
  public void load() { /* spreadsheet load behavior */ }
  public void edit() { /* spreadsheet edit behavior */ }
  public void save() { /* spreadsheet save behavior */ }
}
```

### Extending behaviors

With this approach, it is very difficult to add a new behavior, like "export", to the original modes without modifying the base package.

This approach would require us to add a new "export" method to the "Prose/Whiteboard/Spreadsheet" classes. It's impossible to add a new method to these classes in a statically typed way without editing the files where these classes are defined.

### Extending representations

At the same time, this abstraction makes it very easy to add new mode representations, without modifying the base package. In another file, we can create new classes:

```java
class Picture {
  public void load() { /* picture load behavior */ }
  public void edit() { /* picture edit behavior */ }
  public void save() { /* picture save behavior */ }
}
class Video {
  public void load() { /* video load behavior */ }
  public void edit() { /* video edit behavior */ }
  public void save() { /* video save behavior */ }
}
class Voice {
  public void load() { /* voice load behavior */ }
  public void edit() { /* voice edit behavior */ }
  public void save() { /* voice save behavior */ }
}
```

### Evaluation

In this approach, it was very easy to add rows to the table without modifying the base package, but it was impossible to add behaviors without modifying the base package. In total, this approach passed 3 out of 4 of our criteria:

| Criteria                   | Pass | Fail |
|-------------------------- |---- |---- |
| Extensible Behaviors       |      | x    |
| Extensible Representations | x    |      |
| Static Type Checking       | x    |      |
| No Separate Compilation    | x    |      |


## Non-solution: using dynamic type checking in an object-oriented language

We can use an abstraction that makes it easy to add behaviors to a class, outside of its definition by defining a function outside of a class. The first parameter of this function would be an instance of the class. The body of the function will be the definition of the behavior.

If we extend this idea to work for multiple classes, the type of the first parameter of this function would be a base class. This would allow us to pass instances of derived classes to our function. We can then use a control statement to define branches of behavior and associate each branch to a derived class. The control statement would dynamically check the type of the instance and dispatch the corresponding branch.


### Base package

If we were to take this approach to define our base package, it would look something like this:

```java
class Mode { }
class Prose extends Mode       { }
class Whiteboard extends Mode  { }
class Spreadsheet extends Mode { }

class Behaviors {
  void load(Mode mode) {
    if (mode instanceof Prose)            { /* prose load behavior */       }
    else if (mode instanceof Whiteboard)  { /* whiteboard load behavior */  }
    else if (mode instanceof Spreadsheet) { /* spreadsheet load behavior */ }
    else { throw new ArgumentException(); }
  }
  void edit(Mode mode) { /* omitted for brevity */ }
  void save(Mode mode) { /* omitted for brevity */ }
}
```


### Extending behaviors

The behavior functions in this solution resemble the approach above where we used pattern matching functions when modeling this problem in a functional language. We can easily extend the behaviors of Modes by adding a new function that will take a mode as an argument:

```java
class MoreBehaviors extends Behaviors {
  void export(Mode mode) {
    if (mode instanceof Prose)            { /* prose export behavior */ }
    else if (mode instanceof Whiteboard)  { /* whiteboard export behavior */ }
    else if (mode instanceof Spreadsheet) { /* spreadsheet export behavior */ }
    else { throw new ArgumentException(); }
  }
  void format(Mode mode) { /* omitted for brevity */ }
  void select(Mode mode) { /* omitted for brevity */ }
}
```


### Extending representations

Unfortunately, it is difficult to add a new class. If we were to add a `Picture` class, for example, we would need to go to the `load`, `edit`, and `save` functions in the Behaviors class of our base package, and add a new branch to each function for our new `Picture` mode class.


### Evaluation

This approach resembles the approach where we used pattern-matching functions. As such, this approach similarly does not solve The Expression Problem. This approach made it easier to add behaviors in downstream packages and simultaneously made it harder to add representations.

There's another concern with this approach; the behavior functions in this solution have a performance issue that the pattern matching functions don't have. The behavior functions here have a time complexity of O(n) to find the branch that corresponds to the input mode. If we have `n` modes, a behavior function will need to execute `n` checks before it finds the branch that corresponds to the last mode. This can be very slow for large `n`. In contrast, a pattern-matching function will dispatch the branch corresponding to a mode in constant time, as long as its argument is a sum type.<sup><a id="fnr.1" class="footref" href="#fn.1" role="doc-backlink">1</a></sup>

This solution is also different from the pattern-matching solution in that it sacrifices static-type safety. As we develop our program and add Mode classes, we may occasionally forget to add a new branch to every control statement. In this case, our compiler won't be able to tell us. We'll simply get a runtime ArgumentException.

This approach passes only 2 of 4 criteria:

| Criteria                   | Pass | Fail |
|-------------------------- |---- |---- |
| Extensible Behaviors       | x    |      |
| Extensible Representations |      | x    |
| Static Type Checking       |      | x    |
| No Separate Compilation    | x    |      |


## Non-solution: The Visitor Pattern

If we want to separate the behaviors of class from its definition, it is a much better approach to use the visitor pattern. The visitor pattern also allows us to define a function in a downstream package and associate it with an imported class. It is a better approach than using dynamic type checking because the visitor pattern allows your code to dispatch behavior functions in constant time, instead of linear. Also, the visitor pattern doesn't prescribe dynamic type checking. So, your compiler can guide you to make sure all behavior functions are implemented.


### Base package

In the visitor pattern, you define one class for each behavior. These classes are called "visitors". Going back to our example, we can have three visitors: a loading visitor, an editing visitor, and a saving visitor. Visitors behave like columns in our table. Every visitor will have one method for each representation. In our example, every visitor will have the following methods: "visitProse", "visitWhiteboard", and "visitSpreadsheet". Visitor methods behave like rows in our table. If the base package from our example had been implemented using this pattern, our visitors would look something like this:

```java
public interface Visitor {
  void visitProse(Prose mode);
  void visitWhiteboard(Whiteboard mode);
  void visitSpreadsheet(Spreadsheet mode);
}

class LoadVisitor implements Visitor {
  public void visitProse(Prose mode)             { /* prose load behavior       */ }
  public void visitWhiteboard(Whiteboard mode)   { /* whiteboard load behavior  */ }
  public void visitSpreadsheet(Spreadsheet mode) { /* spreadsheet load behavior */ }
}
class EditVisitor implements Visitor {
  public void visitProse(Prose mode)             { /* prose edit behavior       */ }
  public void visitWhiteboard(Whiteboard mode)   { /* whiteboard edit behavior  */ }
  public void visitSpreadsheet(Spreadsheet mode) { /* spreadsheet edit behavior */ }
}
class SaveVisitor implements Visitor {
  public void visitProse(Prose mode)             { /* prose save behavior       */ }
  public void visitWhiteboard(Whiteboard mode)   { /* whiteboard save behavior  */ }
  public void visitSpreadsheet(Spreadsheet mode) { /* spreadsheet save behavior */ }
}
```

Each `Mode` type must have an `accept` method:

```java
class Mode {
  @Override
  public void accept(Visitor visitor) {
    throw new ArgumentException();
  }
}
class Prose extends Mode { 
  @Override
  public void accept(Visitor visitor) {
    return visitor.visitProse(this);
  }
}
class Whiteboard extends Mode { 
  @Override
  public void accept(Visitor visitor) {
    return visitor.visitWhiteboard(this);
  }
}
class Spreadsheet extends Mode { /* omitted for brevity */ }
```

With this in place, one can call the behavior of a mode like so:

```java
Visitor loadVisitor = new LoadVisitor();

Mode whiteboard = new Whiteboard();
Mode prose = new Prose();

whiteboard.accept(loadVisitor); 
prose.accept(loadVisitor);
```

In contrast to the approach where we used dynamic type checking, the loading function of the `Whiteboard` instance on line 6 and the loading function of the `Prose` instance on line 7 both dispatch instantly.


### Extending behaviors

With the visitor pattern, we can easily extend the behavior of representations in downstream packages, in a way that is similar to the control statement approach, or the pattern matching approach. All we need to do is define new visitors:

```java
class ExportVisitor implements Visitor {
  public void visitProse(Prose mode)             { /* prose export behavior       */ }
  public void visitWhiteboard(Whiteboard mode)   { /* whiteboard export behavior  */ }
  public void visitSpreadsheet(Spreadsheet mode) { /* spreadsheet export behavior */ }
}
class FormatVisitor implements Visitor {
  public void visitProse(Prose mode)             { /* prose format behavior       */ }
  public void visitWhiteboard(Whiteboard mode)   { /* whiteboard format behavior  */ }
  public void visitSpreadsheet(Spreadsheet mode) { /* spreadsheet format behavior */ }
}
class SelectVisitor implements Visitor {
  public void visitProse(Prose mode)             { /* prose select behavior       */ }
  public void visitWhiteboard(Whiteboard mode)   { /* whiteboard select behavior  */ }
  public void visitSpreadsheet(Spreadsheet mode) { /* spreadsheet select behavior */ }
}
```


### Extending representations

Unfortunately, with this approach, we can't extend the representations of the base package, without modifying it. For example, if we add a `Picture` class and if we want it to have `load`, `edit`, and `save` functionality, we will need to modify the `LoadVisitor`, `EditVisitor`, or `SaveVisitor` classes of the base package.


### Evaluation

In essence, this approach is very similar to the pattern-matching approach because we were able to extend behaviors but not representations. This approach was better than the approach where we used dynamic type casting because we did not incur performance costs when dispatching behavior functions and we maintained static type safety. This approach passed 3 out of 4 criteria:

| Criteria                   | Pass | Fail |
|-------------------------- |---- |---- |
| Extensible Behaviors       | x    |      |
| Extensible Representations |      | x    |
| Static Type Checking       | x    |      |
| No Separate Compilation    | x    |      |


### Non-solution: re-visiting extending representations in The Visitor Pattern by using inheritance

In the last section, we saw that the visitor pattern passed all but the first criterion. We weren't able to extend representations in the visitor pattern.

I wrote that if we wanted to add, say, the `Picture` class in a downstream package and associate it with loading, editing, and visiting behavior, we would need to add a `visit(Picture mode)` method to `LoadVisitor`, `EditVisitor`, and `SaveVisitor`. Actually, this isn't entirely true.

We could associate our new `Picture` class with loading, editing, and saving behavior by creating three new visitor classes that inherit the behaviors of `LoadVisitor`, `EditVisitor`, and `SaveVisitor`. We're not allowed to touch the original `Visitor` definition, since it's in the base package. But, we can define a `VisitorWithPicture` interface that extends it.

```java
public interface VisitorWithPicture extends Visitor {
  void visitPicture(Picture mode);
}

class LoadVisitorWithPicture extends LoadVisitor implements VisitorWithPicture {
  public void visitPicture(Picture mode) { /* picture load behavior */ }
}
class EditVisitorWithPicture extends EditVisitor implements VisitorWithPicture {
  public void visitPicture(Picture mode) { /* picture edit behavior */ }
}
class SaveVisitorWithPicture extends SaveVisitor implements VisitorWithPicture {
  public void visitPicture(Picture mode) { /* picture save behavior */ }
}
```

Our `Picture` class would look something like this:

```java
class Picture extends Mode { 
  @Override
  public void accept(Visitor visitor) {
    if(visitor instanceof VisitorWithPicture) {
      VisitorWithPicture visitorWithPicture = (VisitorWithPicture) visitor;
      return visitorWithPicture.visitPicture(this);
    }
    throw new ArgumentException();
  }
}
```


### Evaluation

In this way, were were able to adapt the Visitor pattern to pass the first criterion, but unfortunately, to do this, we had to resort to using dynamic casting.

Notice that the `accept` method of the `Picture` class must have an argument of type `Visitor` to properly extend the `Mode` class. We needed to cast this visitor to be of type `VisitorWithPicture` to make this approach work. All in all, this approach passed 3 of 4 criteria:

| Criteria                   | Pass | Fail |
|-------------------------- |---- |---- |
| Extensible Behaviors       | x    |      |
| Extensible Representations | x    |      |
| Static Type Checking       |      | x    |
| No Separate Compilation    | x    |      |


## Non-solution: Multimethods in Clojure

[According to Eli Bendersky](https://eli.thegreenplace.net/2016/the-expression-problem-and-its-solutions/), we can try to use multimethods to solve The Expression Problem. Since Clojure is a dynamically typed language, similar to the previous approach, this approach will also pass all criteria except for the one about static type checking. In contrast to the previous approach, this approach is much more simple and elegant.


### Base package

In Clojure we can define our `Mode` types as records, and our functionalities as methods:

```clojure
(defrecord Prose)
(defrecord Whiteboard)
(defrecord Spreadsheet)

(defmulti load- class)
(defmethod load Prose []
  ;; prose load behavior
)
(defmethod load- Whiteboard []
  ;; whiteboard load behavior
)
(defmethod load- Spreadsheet []
  ;; spreadsheet load behavior
)

;; definitions of edit and save multimethods look the same to load. They are omitted for brevity
```


### Extending behaviors

It's straightforward to add new behaviors in downstream packages, like `export`:

```clojure
(defmulti export class)
(defmethod export Prose []
  ;; prose export behavior
)
(defmethod export Whiteboard []
  ;; whiteboard export behavior
)
(defmethod export Spreadsheet []
  ;; spreadsheet export behavior
)
```


### Extending representations

It's also straightforward to add new representations in downstream packages, like `Picture`:

```clojure
(defrecord Picture)
(defmethod load Picture []
  ;; picture load behavior
)
(defmethod edit Picture []
  ;; picture edit behavior
)
(defmethod save Picture []
  ;; picture save behavior
)
```


### Evaluation

As mentioned before, multi-methods in Clojure solve 3 of 4 criteria:

| Criteria                   | Pass | Fail |
|-------------------------- |---- |---- |
| Extensible Behaviors       | x    |      |
| Extensible Representations | x    |      |
| Static Type Checking       |      | x    |
| No Separate Compilation    | x    |      |


## Non-solution: protocols in Clojure

In addition to using multimethods in Clojure, we can also try to use protocols to solve The Expression Problem. Of course, this approach will not pass the static-type checking criterion. But, it is interesting and instructional to see how we can easily pass the other three criteria.


### Base package

Just as before, we can define our `Mode` types as records. For behaviors, instead of using multimethods, we can use `defprotocol` to define a `Loadable` protocol with one method, `load`.

```clojure
(defrecord Prose)
(defrecord Whiteboard)
(defrecord Spreadsheet)

(defprotocol Loadable
  (load [this]))

(defmethod load Prose []
  ;; prose load behavior
)
(defmethod load Whiteboard []
  ;; whiteboard load behavior
)
(defmethod load Spreadsheet []
  ;; spreadsheet load behavior
)

;; definitions of edit and save multimethods look the same to load. They are omitted for brevity.
```


### Extending behaviors

We can add a new behavior in downstream packages, like `export`, by defining a new protocol with `defprotocol` and making sure that the base types implement this new protocol by using `extend-protocol`:

```clojure
(defprotocol Export
  (export [this]))

(extend-protocol Export
  Prose
  (export [_] (comment "prose export impl here"))
  Whiteboard
  (export [_] (comment "whiteboard export impl here"))
  Spreadsheet
  (export [_] (comment "spreadsheet export impl here")))
```


### Extending representations

It's also straightforward to add new representations in downstream packages. If we want to add a new `Picture`, we can simply do it by making sure that we implement the base protocols:

```clojure
(deftype Picture []
  Loadable
  Editable
  Saveable
  (load- [_] (comment "picture load impl here"))
  (edit [_] (comment "picture edit impl here"))
  (save [_] (comment "picture edit impl here")))
```


### Evaluation

As mentioned before, protocols in Clojure solve 3 of 4 criteria:

| Criteria                   | Pass | Fail |
|-------------------------- |---- |---- |
| Extensible Behaviors       | x    |      |
| Extensible Representations | x    |      |
| Static Type Checking       |      | x    |
| No Separate Compilation    | x    |      |

## Solution: Typeclasses in Haskell

While I have been able to find many non-solutions to The Expression Problem, I have only been able to find only one real solution. The only language where it seems possible to solve The Expression Problem is Haskell. I found this solution thanks to [Eli Bendersky's post on The Expression Problem](https://eli.thegreenplace.net/2018/more-thoughts-on-the-expression-problem-in-haskell/).

We can solve The Expression Problem in Haskell because of [Typeclasses](https://learnyouahaskell.com/types-and-typeclasses#typeclasses-101). Typeclasses allow you to extend both behaviors and representations.

### Base package
To solve The Expression Problem for this example in Haskell, we would want to define three data types, one for each representation:

```haskell
data Prose       = Prose deriving (Show)
data Whiteboard  = Whiteboard deriving (Show)
data Spreadsheet = Spreadsheet deriving (Show)
```

Next, we need to unify these data types somehow. Here's where Typeclasses come in. We can define an empty Typeclass, and make each of our three data-types instances of this Typeclass:

```haskell
class Mode e

instance Mode Prose
instance Mode Whiteboard
instance Mode Spreadsheet
```

Finally, we can define our `load`, `edit`, and `save` functions for each `Mode`:

```haskell
class (Mode m) => Load m where
  load :: m -> ()

instance Load Prose where
  load Prose = () -- prose load functionality

instance Load Whiteboard where
  load Whiteboard = () -- whiteboard load functionality

instance Load Spreadsheet where
  load Spreadsheet = () -- spreadsheet load functionality

-- definitions of edit and save instances look the same to load. They are omitted for brevity.
```

### Extending behaviors

If we wanted to add a new behavior in downstream packages, like `export`, we could define a new `Export` Typeclass that is a subclass of the `Mode` Typeclass. This new Typeclass will have an implementation of the `export` function for each `Mode`:

```haskell
class (Mode m) => Export m where
  export :: m -> ()

instance Export Prose where
  export Prose = () -- prose export functionality

instance Export Whiteboard where
  export Whiteboard = () -- whiteboard export functionality

instance Export Spreadsheet where
  export Spreadsheet = () -- spreadsheet export functionality
```

### Extending representations

If we wanted to add a new `Mode` representation, like `Picture`, and make sure that it has all the functionalities that `Mode`s have, we could simply define a new `Picture` data type, declare it as a part of the `Mode` Typeclass, and also add one instance for each `Mode` functionality:

```haskell
data Picture = Picture deriving (Show)

instance Mode Picture

instance Load Picture where
  load Picture = () -- picture load functionality

instance Edit Picture where
  edit Picture = () -- picture edit functionality

instance Save Picture where
  save Picture = () -- picture save functionality
```

### Evaluation

This approach solves all four criteria. We were able to add new behaviors by creating a new Typclass that is a subclass of the `Mode` Typeclass; we were able to add new representations by creating a new data type that implements the `Mode` Typeclass; And, we were able to do this without any type assertions or separate complication!

| Criteria                   | Pass | Fail |
|-------------------------- |---- |---- |
| Extensible Behaviors       | x    |      |
| Extensible Representations | x    |      |
| Static Type Checking       | x    |      |
| No Separate Compilation    | x    |      |

While this does technically solve the four criteria I listed, there is a subtle problem with this approach that most likely renders it unusable for real-world purposes. The problem is that in this approach, we lose the ability to return a `Mode` from a function. This is because `Mode` is not a compile-time type, it is a Typeclass. This problem can be side-stepped with some clever tricks, but these tricks add significant complexity. I won't get into this problem here because this post is becoming too long. But, I highly suggest you read [Eli Bendersky's post on the matter](https://eli.thegreenplace.net/2018/more-thoughts-on-the-expression-problem-in-haskell/).

## Conclusion

The Expression Problem is about discovering some way to have code that is open for extension but closed for modification for both data types and functions, without separate compilation and dynamic typing. There is only one known way to technically solve this problem in Haskell. But, this solution comes with a slew of drawbacks.

I've learned that this problem may not even be worth solving. It is nice in concept to be able to write code that won't get modified. But, realistically speaking, developers of growing projects will almost always need to make code changes to base packages because of constantly changing business requirements and environmental factors. This might seem like a bad thing. But it's really not. It is the job of good developers to write code that is adaptable to change. As Eli Bendersky writes in his post, constant change in a codebase can be a sign of health.

So, while The Expression Problem might be nice to solve in concept, in practice, there doesn't seem to be any usable solution. And, that's not a bad thing. Even if there were a solution, I believe that codebases that were able to use this solution may not be any better than equivalent codebases that don't.

## Q+A with myself as I studied this topic

-   Why use a multimethod in Clojure? Isn't this equivalent to using a pattern-matching function?
    -   There's no such thing as native pattern-matching functionality in Clojure. At least, not in the way it exists in typed functional languages like OCaml or Haskell. The closest thing is `cond` or `condp`.
    -   You could use these functions instead of multimethods but there is one big advantage to multimethods: the branches of multimethods can be extended in downstream files. The branches of `cond` expressions cannot. This means that multimethods can be used to solve The Expression Problem in Clojure (if we ignore the restriction of using static types).
-   Why use the visitor pattern in object-oriented languages? Isn't this equivalent to using a switch statement?
    -   It is not. It dispatches a behavior function in constant time, unlike a switch statement.
-   In languages with support for Sum types, like Rust/Scala, is there a need for the visitor pattern?
    -   Probably not, you can use pattern matching instead.

## Footnotes

<sup><a id="fn.1" class="footnum" href="#fnr.1">1</a></sup> One might ask if we could use switch statements to dispatch the branch corresponding to a mode in constant time. But the answer is no. For a switch statement to dispatch the correct branch in constant time, the compiler must make the switch statement behave like a jump table. A jump table needs the switch argument to be a variable with a type that can be used to index a set of cases. Characters and integers are the only types that satisfy this criterion, not strings. Since we use string names for modes, we had to resort to using an if/else-if statement instead. In other object-oriented languages like Java (as of version 7) and Go, there is support for switch statements that take an input of type string. But compilers for these languages don't dispatch the correct case in constant. Instead, they search for the correct case linearly or with a binary search. There are some object-oriented languages with support for sum types, like Rust and Scala (and maybe even C++). In these languages, it would be possible to implement a behavior function as a pattern-matching function that dispatches the branch corresponding to a mode in constant time.
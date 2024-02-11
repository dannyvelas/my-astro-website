---
layout: "../../layouts/BlogLayout.astro"
title: 'The Expression Problem'
publishedDate: 2023-02-04
description: 'An explanation on what the expression problem is, how to solve it, and how to not solve it'
author: 'Daniel Velasquez'
tags: ["Design Patterns", "Clojure", "Multiple Dispatch"]
---


The expression problem is a design-pattern problem in Computer Science. A computer scientist named this issue after the subject matter in which they experienced it: they were trying to parse or evaluate expressions. Suppose there is a base package of representations. And suppose that these representations will be imported by downstream packages. The goal is to define the base package in such a way that downstream packages can extend the base package with both new behaviors and representations, without necessitating any modifications to the source of the base package, while using static types and without using separate compilation.


## Terminology

For a reader to fully grasp this definition, they would need to fully understand the definition of the words "behavior" and "representation."


### Behavior

By "behavior," I mean a unit of logic that takes input and returns some output. Usually a unit of logic is called a "function". However, a unit of logic could also be, for example, one branch of a "switch" statement. Of course, "unit" here is very vaguely defined. For now, we can satisfy ourselves with the idea that a "unit" can be anywhere from one line of code to thousands, such that the start of the unit takes in some form of input. And the end of the unit returns some form of output. Again, "input" and "output" here are very vague. "Input" can refer to one or more variables in scope, that are used inside of a unit of logic, or an argument, in the case that the unit of code is a function. "Output" can refer to the last variable (or variables) that are set at the end of a unit of logic, or a return value, in the case that the unit of code is a function. 


### Representation

By "Representation," I mean a collection of behaviors that conceptually represent an entity. In object-oriented languages, this is usually referred to as a "class", and each behavior is referred to as a "method." In functional programs, this is usually a module, which has several related functions that have some conceptual similarity.


## Example

To demonstrate this problem, I'm going to present [an example problem, similar to one originally presented in a post by Bob Nystrom](https://journal.stuffwithstuff.com/2010/10/01/solving-the-expression-problem/). To solve this problem, we would effectively solve the expression problem. I will present many non-solutions to this problem before showing real solutions.

Suppose we're developing a note-taking application. The application will be released for the first time with support for three modes: prose mode, whiteboard mode, and spreadsheet mode. Each mode has three core functionalities: users can load, edit, and save a file in each mode. After it is released, we will need to make a second release. The second release should have support for a few more modes: picture mode, video mode, and voice mode. The second release should also have support for more functionalities in each mode; users want to export, format, and select regions, in every mode.

We can think of modes as representations and functionalities as behaviors. Imagine a table where each column symbolizes a behavior, and each row symbolizes a representation that implements those behaviors. The implementation of the behavior of a representation will be symbolized by an `x` at the intersection of a row with a column. In the first release of our application, our note-taking app will have a base package that looks something like this:

<table border="2" cellspacing="0" cellpadding="6" rules="groups" frame="hsides">


<colgroup>
<col  class="org-left" />

<col  class="org-left" />

<col  class="org-left" />

<col  class="org-left" />
</colgroup>
<thead>
<tr>
<th scope="col" class="org-left">&#xa0;</th>
<th scope="col" class="org-left">Loading</th>
<th scope="col" class="org-left">Editing</th>
<th scope="col" class="org-left">Saving</th>
</tr>
</thead>

<tbody>
<tr>
<td class="org-left">Prose</td>
<td class="org-left">x</td>
<td class="org-left">x</td>
<td class="org-left">x</td>
</tr>
</tbody>

<tbody>
<tr>
<td class="org-left">Whiteboard</td>
<td class="org-left">x</td>
<td class="org-left">x</td>
<td class="org-left">x</td>
</tr>
</tbody>

<tbody>
<tr>
<td class="org-left">Spreadsheet</td>
<td class="org-left">x</td>
<td class="org-left">x</td>
<td class="org-left">x</td>
</tr>
</tbody>
</table>

When we work on the second release, we would like to add both rows and columns to this table. There is one important restriction we must follow: the code of the first release will live in a base package. After the first release, any modification to this base package is off-limits. When we work on the second release, we would need to add new modes and new functionalities to each mode without touching the base package. The code of the second release must be separate.

We are in charge of working on the first release. **The problem statement is:** how can we model the modes and functionalities of the first release in such a way that both can be extended in the second release, without any modifications to the base package?

This problem statement comes with a restriction: whenever we add a new mode, the compiler should help us make sure that we implement every functionality for that mode. Equivalently, whenever we add a new functionality, the compiler should help us make sure that we implement that functionality for every mode. In other words, whenever we add a new row (or column) we should have an easy way to make sure there is an `x` for every intersecting column (or row). For the compiler to help us here, it needs to statically check all of the mode classes and the behaviors that are defined for them. So, the first restriction is that we must solve it in a statically typed language without resorting to dynamic casts.

This problem statement comes with one more restriction: we should use language features that don't require separate compilation.

We will show many different non-solutions to modeling this problem. Some approaches will be in a functional language, others will be in an object-oriented language. We will measure each approach against four criteria to gauge its effectiveness in solving the expression problem. These criteria are based on the criteria from [Dr. Ralf Laemmel's lecture on The Expression Problem](https://www.youtube.com/watch?v=FWW87fvBKJg). The more criteria an approach satisfies, the closer it is at solving the problem. If an approach satisfies all criteria, the approach effectively solves the expression problem. The four criteria are:

1.  Is it easy to add new representations in downstream packages without modifying the base package?
2.  Is it easy to add new behaviors in downstream packages without modifying the base package?
3.  Does this solution use static type checking?
4.  Does this solution require separate compilation?


## Using Sum Types in a Functional Language

For our first approach we will model this problem using a functional language using sum types. We will see at the end if this approach satisfies all four criteria of solving the expression problem.


### Base Package

If we used sum types to model the problem in our first release, the "mode" type would look something like this in the base package:

    type mode = Prose | WhiteBoard | Spreadsheet

Per this approach, the natural next step would be to use pattern matching functions for functionalities. Each branch of a pattern matching function would correspond to a branch of the "mode" type. The code for functionalities in the base package would look something like this:

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


### Extending Behaviors

Now that we've established an idea of the base package looks like, let's see how we can extend the behaviors of the base package without modifying it. The simplest approach would be to import the base package to another module. In that module, we can create one pattern matching function for each functionality we would like to add. Here are the definitions for export, format, and select in a module that imports the base package:

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

With this approach, our new package, which imports the base package, adds new behaviors to the base package. And, no new modifications to the base package were required.


### Extending Representations

With this simple and idiomatic approach we've taken, if we wanted to add a new mode type, like "Picture", our approach would require us to modify the base package. This is because the simplest way to add a new representation of the "Picture" mode would be to add a new "Picture" branch to the "mode" type. Once we add this branch, we would also need to modify all of the pattern matching functions of the base package. This is because the "load", "edit", and "save" functions won't compile if their pattern matching expression is not exhaustive of all of the mode types. So, we would need to add one new "Picture" branch to each of those functions as well.


### Evaluation

In this approach, it was very easy to add columns to the table (behaviors) without modifying the base package. Yet it was impossible to add rows (representations) without modifying the base package. In total, this approach passed 3 out of 4 of our criteria:

<table border="2" cellspacing="0" cellpadding="6" rules="groups" frame="hsides">


<colgroup>
<col  class="org-left" />

<col  class="org-left" />

<col  class="org-left" />
</colgroup>
<thead>
<tr>
<th scope="col" class="org-left">Criteria</th>
<th scope="col" class="org-left">Pass</th>
<th scope="col" class="org-left">Fail</th>
</tr>
</thead>

<tbody>
<tr>
<td class="org-left">Extensible Representations</td>
<td class="org-left">&#xa0;</td>
<td class="org-left">x</td>
</tr>


<tr>
<td class="org-left">Extensible Behaviors</td>
<td class="org-left">x</td>
<td class="org-left">&#xa0;</td>
</tr>


<tr>
<td class="org-left">Static Type Checking</td>
<td class="org-left">x</td>
<td class="org-left">&#xa0;</td>
</tr>


<tr>
<td class="org-left">No Separate Compilation</td>
<td class="org-left">x</td>
<td class="org-left">&#xa0;</td>
</tr>
</tbody>
</table>


## Using Classes and Methods in an Object Oriented Language

Now, lets model our problem using classes and methods in an object oriented language and see how many criteria this approach passes.


### Base Package

In an object oriented language, if we used classes and methods to represent modes and functionalities, respectively, the base package would look something like this:

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


### Extending Representations

This abstraction makes it very easy to add new mode representations, without modifying the base package. In another file, we can create new classes:

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


### Extending Behaviors

With this approach, it is very difficult to add a new behavior, like "export", to the original modes without modifying the base package.

This approach would require us to add a new "export" method to the "Prose/Whiteboard/Spreadsheet" classes. It's impossible to add a new method to these classes in a statically-typed way without editing the files where these classes are defined.


### Evaluation

In this approach, it was very easy to add rows to the table without modifying the base package, but it was impossible to add behaviors without modifying the base package. In total, this approach passed 3 out of 4 of our criteria:

<table border="2" cellspacing="0" cellpadding="6" rules="groups" frame="hsides">


<colgroup>
<col  class="org-left" />

<col  class="org-left" />

<col  class="org-left" />
</colgroup>
<thead>
<tr>
<th scope="col" class="org-left">Criteria</th>
<th scope="col" class="org-left">Pass</th>
<th scope="col" class="org-left">Fail</th>
</tr>
</thead>

<tbody>
<tr>
<td class="org-left">Extensible Representations</td>
<td class="org-left">x</td>
<td class="org-left">&#xa0;</td>
</tr>


<tr>
<td class="org-left">Extensible Behaviors</td>
<td class="org-left">&#xa0;</td>
<td class="org-left">x</td>
</tr>


<tr>
<td class="org-left">Static Type Checking</td>
<td class="org-left">x</td>
<td class="org-left">&#xa0;</td>
</tr>


<tr>
<td class="org-left">No Separate Compilation</td>
<td class="org-left">x</td>
<td class="org-left">&#xa0;</td>
</tr>
</tbody>
</table>


## Using Dynamic Type Checking in an Object Oriented Language

We can use an abstraction that makes it easy to add behaviors to a class, outside of its definition by defining a function outside of a class. The first parameter of this function would be an instance of the class. The body of the function will be the definition of the behavior.

If we extend this idea to work for multiple classes, the type of the first parameter of this function would be a base class. This would allow us to pass instances of derived classes to our function. We can then use a control statement to define branches of behavior, and associate each branch to a derived class. The control statement would dynamically check the type of the instance and dispatch the corresponding branch.


### Base Package

If we were to take this approach to define our base package, it would look something like this:

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


### Extending Behaviors

The behavior functions in this solution resemble the approach above where we used pattern matching functions when modeling this problem in a functional language. We can easily extend the behaviors of Modes by adding a new function that will take a mode as an argument:

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


### Extending Representations

Unfortunately, it is difficult to add a new class. If we were to add a `Picture` class, for example, we would need to go to the `load`, `edit`, and `save` functions in the Behaviors class of our base package, and add a new branch to each function for our new `Picture` mode class.


### Evaluation

This approach resembles the approach where we used pattern matching functions. As such, this approach similarly does not solve the expression problem. This approach made it easier to add behaviors in downstream packages and simultaneously made it harder to add representations.

There's another concern with this approach; the behavior functions in this solution have a performance issue that the pattern matching functions don't have. The behavior functions here have a time complexity of O(n) to find the branch that corresponds to the input mode. If we have `n` modes, a behavior function will need to execute `n` checks before it finds the branch that corresponds to the last mode. This can be very slow for large `n`. In contrast, a 
pattern matching function will dispatch the branch corresponding to a mode in constant time, as long as it it's argument is a sum type.<sup><a id="fnr.1" class="footref" href="#fn.1" role="doc-backlink">1</a></sup>

This solution is also different to the pattern matching solution in that it sacrifices static type safety. As we develop our program and add Mode classes, we may occasionally forget to add a new branch to every control statement. In this case, our compiler won't be able to tell us. We'll simply get a runtime ArgumentException.

This approach passes only 2 of 4 criteria:

<table border="2" cellspacing="0" cellpadding="6" rules="groups" frame="hsides">


<colgroup>
<col  class="org-left" />

<col  class="org-left" />

<col  class="org-left" />
</colgroup>
<thead>
<tr>
<th scope="col" class="org-left">Criteria</th>
<th scope="col" class="org-left">Pass</th>
<th scope="col" class="org-left">Fail</th>
</tr>
</thead>

<tbody>
<tr>
<td class="org-left">Extensible Representations</td>
<td class="org-left">&#xa0;</td>
<td class="org-left">x</td>
</tr>


<tr>
<td class="org-left">Extensible Behaviors</td>
<td class="org-left">x</td>
<td class="org-left">&#xa0;</td>
</tr>


<tr>
<td class="org-left">Static Type Checking</td>
<td class="org-left">&#xa0;</td>
<td class="org-left">x</td>
</tr>


<tr>
<td class="org-left">No Separate Compilation</td>
<td class="org-left">x</td>
<td class="org-left">&#xa0;</td>
</tr>
</tbody>
</table>


## The Visitor Pattern

If we want to separate the behaviors of class from its definition, it is a much better approach to use the visitor pattern. The visitor pattern also allows us to define a function in a downstream package and associate them to an imported class. It is a better approach than using dynamic type checking because the visitor pattern allows your code to dispatch behavior functions in constant time, instead of linear. Also, the visitor pattern doesn't prescribe dynamic type checking. So, your compiler can guide you to make sure all behavior functions are implemented.


### Base Package

In the visitor pattern, you define one class for each behavior. These classes are called "visitors". Going back to our example, we can have three visitors: a loading visitor, an editing visitor, and a saving visitor. Visitors behave like columns in our table. Every visitor will have one method for each representation. In our example, every visitor will have the following methods: "visitProse", "visitWhiteboard", and "visitSpreadsheet". Visitor methods behave like rows in our table. If the base package from our example had been implemented using this pattern, our visitors would look something like this:

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

Each `Mode` type must have an `accept` method:

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

With this in place, one can call the behavior of a mode like so:

    Visitor loadVisitor = new LoadVisitor();
    
    Mode whiteboard = new Whiteboard();
    Mode prose = new Prose();
    
    whiteboard.accept(loadVisitor); 
    prose.accept(loadVisitor);

In contrast to the approach where we used dynamic type checking, the loading function of the `Whiteboard` instance on line 6 and the loading function of the `Prose` instance on line 7 both dispatch instantly.


### Extending Behaviors

With the visitor pattern, we can easily extend the behavior of representations in downstream packages, in way that is similar to the control statement approach, or the pattern matching approach. All we need to do is define new visitors:

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


### Extending Representations

Unfortunately, with this approach, we can't extend the representations of the base package, without modifying it. For example, if we add a `Picture` class and if we want it to have `load`, `edit`, and `save` functionality, we will need to modify the `LoadVisitor`, `EditVisitor`, or `SaveVisitor` classes of the base package.


### Evaluation

In essence, this approach is very similar to the pattern matching approach because we were able to extend behaviors but not representations. This approach was better than the approach where we used dynamic type casting because we did not incur performance costs when dispatching behavior functions and we maintained static type safety. This approach passed 3 out of 4 criteria:

<table border="2" cellspacing="0" cellpadding="6" rules="groups" frame="hsides">


<colgroup>
<col  class="org-left" />

<col  class="org-left" />

<col  class="org-left" />
</colgroup>
<thead>
<tr>
<th scope="col" class="org-left">Criteria</th>
<th scope="col" class="org-left">Pass</th>
<th scope="col" class="org-left">Fail</th>
</tr>
</thead>

<tbody>
<tr>
<td class="org-left">Extensible Representations</td>
<td class="org-left">&#xa0;</td>
<td class="org-left">x</td>
</tr>


<tr>
<td class="org-left">Extensible Behaviors</td>
<td class="org-left">x</td>
<td class="org-left">&#xa0;</td>
</tr>


<tr>
<td class="org-left">Static Type Checking</td>
<td class="org-left">x</td>
<td class="org-left">&#xa0;</td>
</tr>


<tr>
<td class="org-left">No Separate Compilation</td>
<td class="org-left">x</td>
<td class="org-left">&#xa0;</td>
</tr>
</tbody>
</table>


### Re-visiting Extending Representations in The Visitor Pattern By Using Inheritance

In the last section, we saw that the visitor pattern passed all but the first criterion. We weren't able to extend representations in the visitor pattern.

I wrote that if we wanted to add, say, the `Picture` class in a downstream package and associate it with loading, editing, and visiting behavior, we would need to add a `visit(Picture mode)` method to `LoadVisitor`, `EditVisitor`, and `SaveVisitor`. Actually, this isn't entirely true.

We could associate our new `Picture` class with loading, editing, and saving behavior by creating three new visitor classes that inherit the behaviors of `LoadVisitor`, `EditVisitor`, and `SaveVisitor`. We're not allowed to touch the original `Visitor` definition, since it's in the base package. But, we can define a `VisitorWithPicture` interface that extends it.

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

Our `Picture` class would look something like this:

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


### Evaluation

In this way, were were able to adapt the Visitor pattern to pass the first criterion, but unfortunately, to do this, we had to resort to use dynamic casting.

Notice that the `accept` method of the `Picture` class must have an argument of type `Visitor` to properly extend the `Mode` class. We needed to cast this visitor to be of type `VisitorWithPicture` to make this approach work. All in all, this approach passed 3 of 4 criteria:

<table border="2" cellspacing="0" cellpadding="6" rules="groups" frame="hsides">


<colgroup>
<col  class="org-left" />

<col  class="org-left" />

<col  class="org-left" />
</colgroup>
<thead>
<tr>
<th scope="col" class="org-left">Criteria</th>
<th scope="col" class="org-left">Pass</th>
<th scope="col" class="org-left">Fail</th>
</tr>
</thead>

<tbody>
<tr>
<td class="org-left">Extensible Representations</td>
<td class="org-left">x</td>
<td class="org-left">&#xa0;</td>
</tr>


<tr>
<td class="org-left">Extensible Behaviors</td>
<td class="org-left">x</td>
<td class="org-left">&#xa0;</td>
</tr>


<tr>
<td class="org-left">Static Type Checking</td>
<td class="org-left">&#xa0;</td>
<td class="org-left">x</td>
</tr>


<tr>
<td class="org-left">No Separate Compilation</td>
<td class="org-left">x</td>
<td class="org-left">&#xa0;</td>
</tr>
</tbody>
</table>


## Multimethods in Clojure

[According to Eli Bendersky](https://eli.thegreenplace.net/2016/the-expression-problem-and-its-solutions/), we can try to use multimethods to solve the expression problem. Since Clojure is a dynamically typed language, similar to the previous approach, this approach will also pass all criteria except for the one about static type checking. In contrast to the previous approach, this approach is much more simple and elegant.


### Base Package

In Clojure we can define our `Mode` types as records, and our functionalities as methods:

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


### Extending Behaviors

It's straightforward to add new behaviors in downstream packages, like `export`:

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


### Extending Representations

It's also straightforward to add new representations in downstream packages, like `Picture`:

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


### Evaluation

As mentioned before, multi-methods in Clojure solve 3 of 4 criteria: 

<table border="2" cellspacing="0" cellpadding="6" rules="groups" frame="hsides">


<colgroup>
<col  class="org-left" />

<col  class="org-left" />

<col  class="org-left" />
</colgroup>
<thead>
<tr>
<th scope="col" class="org-left">Criteria</th>
<th scope="col" class="org-left">Pass</th>
<th scope="col" class="org-left">Fail</th>
</tr>
</thead>

<tbody>
<tr>
<td class="org-left">Extensible Representations</td>
<td class="org-left">x</td>
<td class="org-left">&#xa0;</td>
</tr>


<tr>
<td class="org-left">Extensible Behaviors</td>
<td class="org-left">x</td>
<td class="org-left">&#xa0;</td>
</tr>


<tr>
<td class="org-left">Static Type Checking</td>
<td class="org-left">&#xa0;</td>
<td class="org-left">x</td>
</tr>


<tr>
<td class="org-left">No Separate Compilation</td>
<td class="org-left">x</td>
<td class="org-left">&#xa0;</td>
</tr>
</tbody>
</table>


## Protocols in Clojure

In addition to using multimethods in Clojure, we can also try to use protocols to solve the expression problem. Of course, we will not passing the static type checking criterion. But, it is interesting and instructional to see how we can easily pass the other three criteria.


### Base Package

Just as before, we can define our `Mode` types as records. For behaviors, instead of using multimethods, we can use `defprotocol` to define a `Loadable` protocol with one method, `load`.

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
    
    ;; definitions of edit and save multimethods look the same to load. They are omitted for brevity


### Extending Behaviors

We can add a new behavior in a downstream packages, like `export`, by defining a new protocol with `defprotocol` and making sure that the base types implement this new protocol by using `extend-protocol`:

    (defprotocol Export
      (export [this]))
    
    (extend-protocol Export
      Prose
      (export [_] (comment "prose export impl here"))
      Whiteboard
      (export [_] (comment "whiteboard export impl here"))
      Spreadsheet
      (export [_] (comment "spreadsheet export impl here")))


### Extending Representations

It's also straightforward to add new representations in downstream packages. If we want to add a new `Picture`, we can simply do it by making sure that we implement the base protocols:

    (deftype Picture []
      Loadable
      Editable
      Saveable
      (load- [_] (comment "picture load impl here"))
      (edit [_] (comment "picture edit impl here"))
      (save [_] (comment "picture edit impl here")))


### Evaluation

As mentioned before, protocols in Clojure solve 3 of 4 criteria: 

<table border="2" cellspacing="0" cellpadding="6" rules="groups" frame="hsides">


<colgroup>
<col  class="org-left" />

<col  class="org-left" />

<col  class="org-left" />
</colgroup>
<thead>
<tr>
<th scope="col" class="org-left">Criteria</th>
<th scope="col" class="org-left">Pass</th>
<th scope="col" class="org-left">Fail</th>
</tr>
</thead>

<tbody>
<tr>
<td class="org-left">Extensible Representations</td>
<td class="org-left">x</td>
<td class="org-left">&#xa0;</td>
</tr>


<tr>
<td class="org-left">Extensible Behaviors</td>
<td class="org-left">x</td>
<td class="org-left">&#xa0;</td>
</tr>


<tr>
<td class="org-left">Static Type Checking</td>
<td class="org-left">&#xa0;</td>
<td class="org-left">x</td>
</tr>


<tr>
<td class="org-left">No Separate Compilation</td>
<td class="org-left">x</td>
<td class="org-left">&#xa0;</td>
</tr>
</tbody>
</table>


## Q+A with myself as I studied this topic

-   Why use a multimethod in Clojure? Isn't this equivalent to using a pattern matching function?
    -   first of all, there's no such thing as native pattern matching functionality in clojure. at least, not in the way it exists in typed functional languages like OCaml or Haskell. The closest thing is `cond` or `condp`.
    -   You could use these functions instead of multimethods but there is one big advantage to multimethods: the branches of multimethods can be extended in downstream files. The branches of `cond` expressions cannot. This means that multimethods can be used to solve the expression problem in clojure (if we ignore the restriction of using static types)
-   Why use the visitor pattern in object oriented languages? Isn't this equivalent to using a switch statement?
    -   Answered: it is not. it dispatches a behavior function in constant time, unlike a switch statement.
-   I know that in an object-oriented language, the visitor pattern allows one to add behaviors to a class in a base package without modifying the class by adding a method to it. You can add behaviors in downstream packages and associate those behaviors to that class. But, that's only one part of the solution expression problem. A complete solution to the expression problem must define a way for one to add new classes in a downstream package as well. Is it possible to define a new class `D` in a downstream package and have a visitor class that has some visitMethods for the behaviors of a base class, and other visit methods for the behaviors of `D`?
    -   it is possible through method overriding, however it would violate our static type checking criteria
-   In languages with support for Sum types, like Rust/Scala, is there a need for the visitor pattern?
    -   probably not, you can use pattern matching instead
-   So far, in my example, I've assumed that 3 modes and 3 behaviors exist: Prose,Whiteboard,Spreadsheet and load,edit,save respectively, in the base package. I've stated the expression problem as a way to make it possible to add modes and behaviors without modifying the base package. However, logically it seems like this is an impossible task, regardless of the pattern or language feature: if one were to add a new mode outside of the base package, and if they wanted that mode to support loading, editing, and saving, they will need to modify the base package. They will need to change the load, edit, and save functions in the base package to accommodate for the new mode. Perhaps I posed the expression problem incorrectly or too strictly?
    -   First of all, it's not an impossible task. If you were using an object-oriented language for example, you would be able to easily add a new mode by creating a new class outside of the base package and adding 3 methods to it: one for load, another for edit, another for save. This might be impossible if you're using a pattern matching approach. In this case, you would have to edit the load, edit, and save pattern matching functions in the base package.
    -   You defined the expression problem correctly. It may seem impossible, but its not. It's just difficult. There are solution to it after all. There is a solution using type classes in Haskell. There are even solutions in clojure, but of course these do not have static type checking.


## Footnotes

<sup><a id="fn.1" href="#fnr.1">1</a></sup> One might ask if we could use switch statements to dispatch the branch corresponding to a mode in constant time. But the answer is no. For a switch statement to dispatch the correct branch in constant time, the compiler must make the switch statement behave like a jump table. A jump table needs the switch argument to be a variable with a type that can be used to index a set of cases. Characters and integers are the only types that satisfy this criteria, not strings. Since we use string names for modes, we had to resort to using an if/else-if statement instead. In other object-oriented languages like Java (as of version 7) and Go, there is support for switch statements that take an input of type string. But compilers for these languages don't dispatch the correct case in constant. Instead, they search for the correct case linearly or with binary search. There are some object-oriented languages with support for sum types, like Rust and Scala (and maybe even C++). In these languages, it would be possible to implement a behavior function as a pattern matching function that dispatches the branch corresponding to a mode in constant time.

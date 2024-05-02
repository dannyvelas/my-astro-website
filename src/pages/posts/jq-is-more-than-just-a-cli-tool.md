---
title: 'jq is more than just a CLI tool'
date: 2024-04-23
publish: true
layout: ../../layouts/BlogLayout.astro
tags:
  - programming-languages
  - jq

---

If you are a developer, you've most likely heard of [jq](https://jqlang.github.io/jq) before.

jq markets itself as a "command-line" JSON processor. It's a good tool to use whenever you need to query for deeply-nested JSON values. Suppose you have a file, `nested.json`, that has the following content:

```json
{"some": {"value": [{"which": {"is": {"deeply": "nested"}}}]}}
```

Suppose you want to access the value for "deeply" in your command line. With jq you could simply do this:

```sh
cat nested.json | jq '.some.value[0].which.is.deeply'
```

Of course, you can pipe more than just files to jq. You can pipe any sort of JSON stream to jq. For instance, as [the tutorial mentions](https://jqlang.github.io/jq/tutorial/), you can pipe the return value of `curl` commands. This makes jq a very good for interfacing with JSON endpoints or files, whether you are analyzing data or writing shell scripts.

I suspect that for the most part, jq is used for tasks like these.

However, I've come to notice that jq is much more than just a way to easily interface with JSON. jq [is a turing complete language](https://github.com/jqlang/jq/issues/1361#issuecomment-284206217). And, it's more powerful than it lets on. People have actually implemented programming languages in jq. For instance, [someone implemented](https://github.com/thaliaarchi/wsjq) [the Whitespace programming language interpreter](https://en.wikipedia.org/wiki/Whitespace_\(programming_language\)) in jq, and [someone else implemented](https://github.com/itchyny/brainfuck/tree/main) [a brainfuck interpreter](https://en.wikipedia.org/wiki/Brainfuck) interpreter in jq.

Shockingly enough, someone even made a [jq interpreter in jq](https://github.com/wader/jqjq/tree/master)!

Because of the nature of my role, I've had to use jq extensively. I've used it more as a scripting language to transform JSON streams, rather than as a means to quickly query JSON objects. Many of the jq scripts I've written vary in length from 10 to 30 lines of code. Through this experience, I've grown to appreciate jq as a language and admire some of its features. In the future, I'll write more about these individual features in detail.

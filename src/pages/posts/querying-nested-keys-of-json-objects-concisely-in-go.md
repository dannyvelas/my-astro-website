---
title: Querying nested keys of JSON objects concisely in Go
date: 2024-04-21
publish: true
layout: ../../layouts/BlogLayout.astro
tags:
  - programming-languages
  - go
  - typescript

---

Occasionally in some code, I'll have to access some deeply nested fields of some untyped JSON object. While this is straightforward in a dynamically-typed language, it can be pretty annoying and verbose to do this in a statically-typed language like Go.

## Example

Suppose you have a JSON value that looks like this, stored in a variable called `jsonBytes`:

```json
{"some": {"value": [{"which": {"is": {"deeply": "nested"}}}]}}
```

## How could you access the value of the most nested key in Go?

To access the value of the most nested key in Go, there are two options:

1. Create datatypes that mirror the structure of your JSON content. Unmarshal your JSON content into those datatypes. Use member expressions to access nested fields.
2. Unmarshal your JSON content into `map[string]any`. Use map index expressions and type assertions to access nested fields.

The first option is the most popular option. But, as you can see, defining nested structs can be a bit verbose:

```go
type NestedObject struct {
	Some struct {
		Value []struct {
			Which struct {
				Is struct {
					Deeply string `json:"deeply"`
				} `json:"is"`
			} `json:"which"`
		} `json:"value"`
	} `json:"some"`
}

var nestedObject NestedObject
if err := json.Unmarshal(jsonBytes, &nestedObject); err != nil {
	// handle error
}

fmt.Println(nestedObject.Some.Value[0].Which.Is.Deeply)
```

The second option saves you the trouble of having to define a bunch of datatypes. However, it can become similarly verbose:

```go
var nestedObject map[string]any
if err := json.Unmarshal(jsonBytes, &nestedObject); err != nil {
	// handle error
}

valueObj, ok := nestedObject["some"].(map[string]any)
if !ok {
	// handle error
}

whichObjs, ok := valueObj["value"].([]any)
if !ok || len(whichObjs) == 0 {
	// handle error
}

firstWhichObj, ok := whichObjs[0].(map[string]any)
if !ok {
	// handle error
}

// and so on...
```

Both of these solutions are admittedly pretty bad.

## How is this done in TypeScript?

If you wanted to access the most deeply nested field of `jsonBytes`, you could do something like this:

```typescript
const parsedJSON = JSON.parse(jsonBytes)
const nested = parsedJSON.some.value[0].which.is.deeply
```

This much shorter than both approaches in Go. However, it comes with a caveat.

This works because `JSON.parse` returns a value of type `any`. This means that static typing was turned off for the variable `parsedJSON`. So, you could query for any arbitrary path of `parsedJSON` without the compiler screaming at you. If you tried to access a non-existing path of `jsonBytes`, e.g. `parsedJSON.some.nonexisting.path.here`, this would throw a type error exception:

```
Uncaught TypeError: Cannot read properties of undefined (reading 'path')
```

In this case, it might be better to use something like the `lodash` [get function](https://lodash.com/docs/4.17.15#get), which would simply return `undefined`.

```typescript
const nested = _.get(parsedJSON, "some.nonexisting.path.here") // undefined
```

## A good solution for Go

With this solution of using a library in mind, we can come up with a similarly concise solution for Go. In Go, we could use a library like `gjson`:

```go
result := gjson.Get(jsonBytes, "some.value[0].which.is.deeply").String()
```

This is really cool because you get the same conciseness as you get in Typescript, but the output value is not an `any` value that switches off static typing guarantees. `result` is a statically typed value that can be introspected.

There are just two issues with this solution in Go:

- It's not a widely supported method. It's not a common idiom and this method is not in the standard library. So, it would be pretty rare in practice to see code like this. More likely, you'll see people define a bunch of datatypes and unmarshal the JSON into those datatypes.
- This solution does not use the ["comma ok" idiom](https://go.dev/doc/effective_go#maps). Right now, with `gjson` the only way to differentiate between a return value from the `Get` function for a field that does not exist, and a field that does exist, but is set to empty is by doing an additional functional call. One would have to call [`result.Exists()`](https://pkg.go.dev/github.com/tidwall/gjson#Result.Exists). It would be cleaner if one `gjson.Get()` could return something like `(gjson.Result, bool)`. This way it would be more concise to check for existence or non-existence of values.

It would be interesting if there were a statically-typed language that had something like `gjson`s `Get` function built-in to the syntax or the standard library.

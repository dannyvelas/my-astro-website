---
title: 'Streams in Go'
date: 2024-04-30
publish: true
layout: ../../layouts/BlogLayout.astro
tags:
  - go
  - programming-languages

---

Lately, I've been thinking about how different languages allow you to implement streams. In this note, I'll talk about how Go implements streams.

The code in this post can be found [on github](http://localhost:4321/posts/streams-in-go).

## Definition

By "stream" I mean some sort of medium or channel that some running code can use to pass values to some other code that is running concurrently. The code that is passing values through the channel is sometimes called a "producer." The code that is receiving the values is sometimes called a "consumer." A value that is placed into a stream can only be consumed once.

I defined a "producer" and "consumer" very ambiguously on purpose. Producers and consumers are different things in different contexts. In the context of the shell, the "producer" and "consumer" would usually be processes. In the context of Go, the "producer" and "consumer" would usually be goroutines. In the context of the C pthread library, it would be OS threads. In the context of distributed computing, the "producer" and "consumer" could be microservices.

The medium by which producers and consumers communicate varies across contexts as well. Unix shells create a medium of communication between two processes when you have a pipe (`|`) between them. In Go, there are two ways that goroutines can communicate. The way is to use a [channel](https://gobyexample.com/channels). But, in specific contexts,  `io.Writer` (for the producer) and `io.Reader` (for the consumer) can be used as well. In distributed computing, the medium for message passing between two services can vary. But, I've seen streaming platforms like [Kafka](https://en.wikipedia.org/wiki/Apache_Kafka), as well as queues like [RabbitMQ](https://www.rabbitmq.com/), used for this.[^1]

## Example

Suppose that you have a large text file with millions of lines. You need to write a program that prints out the length of each line to `stdout`.

Naively, you might be tempted to read the entire file into memory; you could create a slice with a million `string` elements, where each element would correspond to a line of your large text file. Next, you could iterate through this array and print out the length of each element. This approach has a problem. If the file does fit in memory, the program may crash when the OS non-deterministically decides it is time to kill it as a process.

The better solution would be to read the first line, print the length, and then read the second line, print the length, and so on until you've read all of the lines. That way, your program only ever holds one line in memory at any given time.

This is a streaming solution.

## Streams in Go

It would be quite easy to do this in Go. It would be something like:

```go
func main() {
	scanner := bufio.NewScanner(os.Stdin)
	for scanner.Scan() {
		line := scanner.Text()
		fmt.Println(len(line))
	}
	if err := scanner.Err(); err != nil {
		fmt.Fprintln(os.Stderr, "error reading standard input:", err)
	}
}
```

But, to highlight streams in Go, let's add some restrictions. Suppose, that we want to implement this in such a way that the code that is reading from `stdin` is separate from the code that is doing the computation (aka calculating the length). In other words, let's have one function whose only job is to read input from `stdout` and forward it on some medium. Let's have another function whose only job is to listen to that medium, do computation, and print to `stdout`.

### Channels

This would be pretty easy to do with channels:

```go
package main

// imports omitted for brevity

func producer(ch chan<- []byte) {
	defer close(ch)
	scanner := bufio.NewScanner(os.Stdin)
	for scanner.Scan() {
		line := scanner.Bytes()
		ch <- line
	}
	if err := scanner.Err(); err != nil {
		fmt.Fprintln(os.Stderr, "reading standard input:", err)
	}
}

func consumer(ch <-chan []byte) {
	for line := range ch {
		fmt.Printf("%d\n", len(line))
	}
}

func main() {
	byteCh := make(chan []byte)
	var wg sync.WaitGroup
	wg.Add(2)

	go func() { producer(byteCh); wg.Done() }()
	go func() { consumer(byteCh); wg.Done() }()

	wg.Wait()
}
```

### `io` Writers and Readers

You could also do this with the `io.PipeWriter` and `io.PipeReader`. You can use these as a medium of communication between two go routines, just like a channel:

```go
package main

// imports omitted for brevity

func producer(writer *io.PipeWriter) {
	defer writer.Close()
	scanner := bufio.NewScanner(os.Stdin)
	for scanner.Scan() {
		line := scanner.Text()
		if _, err := writer.Write([]byte(line + "\n")); err != nil {
			fmt.Fprintf(os.Stderr, "error writing to writer: %v\n", err)
		}
	}
	if err := scanner.Err(); err != nil {
		fmt.Fprintf(os.Stderr, "error reading standard input: %v\n", err)
	}
}

func consumer(reader *io.PipeReader) {
	scanner := bufio.NewScanner(reader)
	for scanner.Scan() {
		line := scanner.Bytes()
		fmt.Printf("%d\n", len(line))
	}
	if err := scanner.Err(); err != nil {
		fmt.Fprintf(os.Stderr, "error reading from reader: %v\n", err)
	}
}

func main() {
	reader, writer := io.Pipe()
	var wg sync.WaitGroup
	wg.Add(2)

	go func() { producer(writer); wg.Done() }()
	go func() { consumer(reader); wg.Done() }()

	wg.Wait()
}
```

You could run both programs like so:

```sh
go build -o main main.go
cat bigfile.txt | ./main
```

### `io` Writers and Readers vs Channels

This bears the question: if `io` Writers and Readers can be used as a medium of communication between go routines when would you ever need channels?

Well, channels are more powerful. an `io` Reader can only be consumed by one go routine at a time (unless you use mutexes). On the other hand, channels were designed to be read by any arbitrary amount of go-routines. Also, channels can hold any sort of Go datatype inside of them. `io` Writers and Readers only operate on byte slices.

[^1]: I guess Kafka may not be a good example of a "stream" in the way that I've defined it, because you can consume messages multiple times from Kafka if you reset offsets. Kafka does purge messages, but not after they are consumed. Kafka purges messages before their lifetime becomes greater than the topic's retention time.

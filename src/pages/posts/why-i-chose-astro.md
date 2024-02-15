---
layout: "../../layouts/BlogLayout.astro"
title: 'Why I chose Astro for this site'
publishedDate: 2024-02-14
description: 'Why I chose to use the Astro framework to make this website'
author: 'Daniel Velasquez'
tags: ["web-frameworks"]
---

# Why I chose Astro

This is the third time I'm making my own blogging website. I know, embarrassing right? How hard could it be to make something as simple as a blogging website? What is this, the 90s?

I think it's taken my a while to choose the right approach to making a blogging website because I never made a careful evaluation about the tool I should use to make my blogging website. Every time I wanted to make a website I sort-of just picked a tool and went with it. It wasn't until using it for days that I realized it's suboptimal for some reason I never thought about.

This time was different. After failing twice, I sat down and defined what the platonic ideal of a tool for making a blogging website would look for me. Once I had a clear idea of this ideal, I looked at the tools available and tried to pick the one that looked the most similar.

I'll describe what the platonic ideal of a blog-building tool looks like for me and then I'll show how the first two tools that I chose shared little similarities with this platonic ideal. Finally, I'll show how Astro shares many similarities with this platonic ideal.

## Why Not Wix and Wordpress

Before I get started, I'll note that I won't write about non-technical website builders like Wix or Wordpress here, I'll only talk about client side web frameworks. This is for a few reasons. 

The biggest reason is that I feel like frameworks allow me to customize my blog much more. I've used both Wix and Wordpress on separate occasions (albeit to a limited extent) and in both occasions I found that their templates and UI are quite rigid. On both occasions I spent hours trying to make what seemed like a small change so that I could have the exact design that I had in mind. I realized that in most cases, I could settle and have a variation of the design I had in mind, but it was very difficult to get to the exact design that I had in mind. This bothered me. 

The second biggest reason is cost. I could be wrong about this one (I haven't done proper research). But, I feel like if I were to use Wix or Wordpress I might have to spend money to do some of the things that I could code up in web frameworks for free. I also feel like hosting outside of Wix or Wordpress tends to be cheaper. For example, I am using Netlify for hosting right now and it is totally free.

The last reason is laziness. I realize that I could probably become a Wix/Wordpress master and get good enough at it to achieve the customizability that I yearn for. But, right now it's faster and easier for me to get the exact results that I want in a site by using web frameworks. Why learn how to Wix/Wordpress when I don't need to? Of course, you might say that knowing how to use these is a useful skill to have. But to be honest, I have very limited time, and a long list of pending topics that I want to learn. And, Wix/Wordpress skills are very very far from being on that list.

## Criteria

1. First off, I want my blog to have a "posts" page. The "posts" page will list all of the blog posts that I have ever made. I want a tool that can automatically create this page. I don't want to manually create a list of all of my posts. I don't want to have to remember to update it every time I add or remove or rename a post. On this page, I should be able to do something like: `for post in allPosts { <li>{post.title}</li> }`.

2. I want a tool that has support for dynamic routes. I want each blog post to have some tags. Each tag should have its own page at path `/tags/<tagname>.html`. But I also don't want to manually create one HTML file per tag. I want to be able to configure something that will automatically generate one HTML file per tag at build time.

3. I want a tool that will allow me to write posts in Markdown instead of HTML. HTML is too much of a pain to write prose in.

4. I want a tool that will allow me to use Tailwind for styling. I prefer using Tailwind for styles than just CSS. It has sane defaults, it feels much easier to maintain, it allows me to not have to come up with names for a bunch of single-use CSS classes, and its classes allow me to have nice consistency across the site with respect to coloring and spacing. I was skeptical of Tailwind at first but then I realized that inline styles, despite being traditionally frowned-upon as taboo, were actually a good thing. Now I'm a big fan.

5. The tool I choose does not need to generate a site with a virtual DOM. There's no need for my blogging website to make dynamic changes to the DOM. There's no need for my blogging website to download and execute a large JavaScript bundle at startup. This feels like unnecessary overhead.

## First Attempt: Elm

The first time I tried was in 2020. At that point I had just learned Elm and I was obsessed with purely functional programming. I had also already written the entire front-end of app for a startup that I was working at in Elm. So, it seemed natural to just use Elm for a basic blogging website.

Lets see how it stacks up against the criteria above:
| Criteria                     | Pass | Fail |
|----------------------------- |----- |----- |
| Ability to create posts list | x    |      |
| Dynamic routes               | x    |      |
| Markdown support             |      | x    |
| No virtual dom               |      | x    |

Since Elm was designed to be used for building Single Page Applications, I believe one could use it to create a page with a list of posts. I know for a fact it has support for dynamic routes.

However, Elm, at least the way that I was using it, had a lot of drawbacks. 

First of all, at the time I was writing my site in Elm (and I believe this is still the case at the time of writing), Elm was only a langugage, not a framework. So this meant that I had to write a `Main.elm` file with a bunch of boilerplate routing logic that normally comes included in a framework.

Second of all, I was writing my site in Elm in such a way that I was not using Markdown files. I had committed to simply writing all of the HTML by hand. Or better said, all of the Elm representation of HTML by hand. This meant that I had some unnecessary none-negligible cognitive overhead when I was writing content for the website, which was a bit annoying. Just so you see what I mean, here's a snippet of what the code looked like:

```elm
        [ section [ css [ aboutSection ], class "py-5" ]
            [ div [ class "container" ]
                [ div [ class "row align-items-center" ]
                    [ div [ class "col-6" ]
                        [ h2 [ class "text-center" ] [ text "About Me" ] ]
                    , div [ class "col-6" ]
                        [ div [ class "row" ]
                            [ div [ class "col" ]
                                [ p [ css [ bodyText ] ]
                                    [ text
                                        """
                                        Hi, I'm Daniel Velasquez.
                                        """
                                    ]
```

Finally, as I mentioned previously, since Elm was designed to make Single Page Applications, my blogging site was rendering on client devices with a JS file that needed to be downloaded and executed, which caused unnecessary slowness/complexity.

## Second Attempt: SSG5



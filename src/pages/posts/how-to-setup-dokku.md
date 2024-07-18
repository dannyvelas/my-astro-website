---
title: How to set up Dokku
date: 2024-07-18
publish: true
layout: ../../layouts/BlogLayout.astro
tags:
  - parkspot
  - dokku

---

As mentioned [in my last post](/posts/what-is-dokku/), I used a tool called [Dokku](https://dokku.com/) to deploy an application that I maintain called [ParkSpot](https://park-spot.co/). I created this post to share my notes on setting up Dokku for the first time.

The first step of setting up a Dokku app for the first time is to install it on your server. After installing, you can use its CLI to register a new application. Let's suppose that our end goal is to deploy an application called "mybackendapp". To register this application with Dokku, you would want to run the following command: `dokku apps:create mybackendapp`.

After registering your new application, you can make Dokku become aware of the code base of the application by adding a new remote origin to the git of your application. Doing this will be very similar to adding a new git server to your application. You can do this by issuing the remote add command at the root of your repository. The syntax for this is `git remote add dokku dokku@<root-domain-of-server>:<dokku-app-name>`

For example, let's suppose we want to connect a repo to the Dokku remote origin of our server. Suppose the root domain of your server is `example.com`. The command for this would be: `git remote add dokku dokku@example.com:mybackendapp`.

After you make Dokku a remote origin of your git repo, you can deploy your application to Dokku. You can deploy to Dokku by doing a git push that points to your Dokku remote origin. This is the command: `git push dokku:main`. Every time you have a new version of your local `main` branch, and you would like to push it to Dokku, you can issue that command.

Finally, you likely want to make your application available over HTTPS by making it have SSL certificates. In my next post, I'll give instructions on how to set this up.

[This is a very useful tutorial that I used](https://shellbear.me/blog/go-dokku-deployment) that has more detailed instructions on deploying an application.

### NGINX Request forwarding

For each application, Dokku creates a docker container, it will build your application and run it within the container. Dokku uses NGINX as a proxy to route requests from the VPS to that docker container.

**Note:** If you are trying to deploy an HTTP service, make sure that your application server is listening to the IP address `0.0.0.0` inside of the docker container. If it is not, all the requests that NGINX forwards to your docker container will not resolve.

### Using subdomains

On Dokku, you configure the domain that an application will respond to. For example, suppose I have a server with an IP address that `example.com` points to. Suppose that on Dokku, I registered an application which is an HTTP server called `mybackendapp` and I would like to deploy it to `backend.example.com`. I can issue this command: `dokku domains:add mybackendapp backend.example.com`. This will tell Dokku that `mybackendapp` should be deployed to the domain `backend.example.com`.

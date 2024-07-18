---
title: What is Dokku?
date: 2024-07-17
publish: true
layout: ../../layouts/BlogLayout.astro
tags:
  - parkspot
  - dokku

---

Not too long ago, I used a tool called [Dokku](https://dokku.com/) to deploy an application that I maintain called [ParkSpot](https://park-spot.co/). I created this post to share some notes I took to learn about Dokku.

Dokku is a software tool that you can use to deploy your code to a remote server. It helps you host databases in your remote server and generate SSL certificates.

### Primer on Heroku

Dokku seems to draw a lot of inspiration from Heroku, so, to explain how Dokku works, I'll first give a primer on how Heroku works.

In Heroku, a [dyno](https://devcenter.heroku.com/articles/dynos) is an app container, kind-of similar to a Docker container. The most popular form of dynos are "web dynos". Suppose you want to deploy some code that sends and receives HTTP traffic to Heroku. To do this, you could:

- Use the Heroku CLI to create an app
- Create a [Procfile](https://devcenter.heroku.com/articles/procfile)
- Add heroku as a git remote for the repo of your app
- Push your code to the dokku git remote

In your `Procfile`, you would declare all the processes that Heroku should start-up as a means to run your application. You want Heroku to run your code which listens to HTTP requests. So, you would want to instruct Heroku to run your code in this `Procfile`. To do this, we also need to declare the "type" of process that your code is. Since your code listens to HTTP requests, the type of this process is "web". As such, the `Procfile` should have something like this: `web: npm run start`. Of course, the way to execute your code will differ by programming language. In this case, I wrote a common way to run a NodeJS process which listens to HTTP requests.

Heroku also allows you to host databases. You can configure your web apps in Heroku to connect to these databases.

### Differences between Heroku and Dokku

Heroku, the company owns a bunch of servers. Heroku allows you to deploy your code on those servers by creating an account on their website and installing a CLI tool on your laptop.

Dokku is just a software tool. It is not a company that owns a bunch of servers like Heroku. Dokku does not offer infrastructure that you can use to deploy. On the contrary, Dokku expects you to have your own server. Once you have your own server set up, you can install Dokku on that server. With Dokku running on your server, you can interface with your code running on your server almost the same way that a Heroku user would interface with their code running on a Heroku server.

Similar to Heroku, you will be able to add your Dokku instance as a git remote. Every time you want the running code in your server to be updated, you can push to that git remote.

Similar to Heroku, you can create a `Procfile` file at the root of your repo that will instruct Dokku how to execute your code.

Similar to Heroku, you can create a running instance of a database and make your app use that database. For example, Dokku has [a postgres plugin](https://github.com/dokku/dokku-postgres). You can use this plugin to run a postgres database as a Dokku app. Next, you can link this postgres database to your app. [This page](https://dokku.com/docs/deployment/application-deployment/#create-the-backing-services) has more instructions on how to create a PostgreSQL instance and link it to an application on Dokku.

In Dokku (and perhaps in Heroku as well), every app is bundled as a Docker image and executed as a Docker container. You can see all of your Dokku apps running as docker containers by running `docker ps -a` on your server. You can optionally bring your own Dockerfile if you need more fine-grained control of how to build your app and run it.

In my next post, I will discuss how to setup Dokku.

---
title: 'What I would do differently if I had to build ParkSpot again'
date: '2025-07-16'
publish: true
layout: ../../layouts/BlogLayout.astro
tags:
  - parkspot
  - learnings

---

I [wrote recently](/posts/open-sourcing-parkspot/) about the fact that I open-sourced ParkSpot. This note is to reflect on what I would have done differently if I could build it again.

## Add metrics from the very beginning

When I started working on [the backend ParkSpot code](https://github.com/dannyvelas/parkspot-backend), I wasn't very comfortable with setting up observability tools. So, I procrastinated setting them up. If I could go back, I would probably add Prometheus metrics to my codebase and configure a Grafana dashboard.

With these set up, I'd be able to look at graphs that show me the following information, as a function of time:

- How long my service is taking to respond to HTTP requests
- How many requests my service is receiving
- What the CPU/Memory utilization looks like
- How many permits are being created
- How many residents are being registered
- How many visitors of residents are being registered

These things would help me get a better idea of:

- When my service sees peak traffic
- Whether I need to make speed or memory optimizations
- How my app is being used, so I know what I should focus on

Of course, I could always gather this information without metrics. For example: I could use database queries to surmise how many permits were created, how many residents were registered, and how many visitors were registered within some range of time. I could use linux commands like `top` (or [htop](https://htop.dev/)) to monitor ongoing CPU / memory usage on the host machine. I could parse my logs with `jq` to get an idea of how long requests are taking.

However, all of these actions have a big drawback; they all involve lot of friction. With SQL queries, linux commands, or `jq` queries, it's not easy to access or visualize the data. This alone has been enough to dis-incentivize me from getting this information and taking action.

The point of metrics is that it makes this data readily-available.

## Add alerts from the very beginning

I'd like to say that I'm a great developer that has never pushed any bugs to production and has never had any incidents. But, I can't. Mistakes happen. Bugs go to production. It's a reality all developers experience. I've learned that, sometimes, being a developer is less about trying to avoid bugs from going to production, and more about setting up a good infrastructure, so that when a critical bug surfaces in production, it is easy to quickly fix it.

In the very beginning there were a few times were some sudden error in the ParkSpot code impacted users. In one case, users trying to reset their password complained of never receiving a "Reset Password" email. When I investigated, I noticed that the Gmail authentication token had expired. I noticed because I looked at the logs and saw that a log statement with a level of "error" was frequently printing.

This shouldn't have happened like this, though. The code-path that made that error log statement print, should have also had some logic to alert me. That way, I would have become aware of the problem, before the user.

Another improvement I could implement is adding a readiness probe to my service. That way, I can create an alert that will notify me if the readiness probe ever fails to respond anything other than a 200 status code.

It's never fun to realize users are being impacted and you're late to find out. I've learned that you want to be as proactive as possible in these cases.

## Maybe wait for Svelte/SvelteKit to be a liiiiiiitle more mature

Don't get me wrong, I love Svelte and SvelteKit. I've probably already written about how much I like them in other posts.

But, I do have to recognize that a considerable percent of work that went into ParkSpot was re-factoring the front-end code to the latest version of Svelte/SvelteKit. This is because both Svelte and SvelteKit went through some pretty big changes after I chose it.

Again, don't get me wrong. I'm happy that these changes happened. I do genuinely think that the team has done a great job of constantly improving the both tools. I just think that I might've been a little bit too excited to dive-in to a "bleeding-edge" technology, without fully realizing all of the work that it would involve.

## Set up some process to keep everything updated

When I created ParkSpot, I had the choice of:

- Running the application on-premises (like in my apartment or office)
- Paying for a server and hosting it from there (e.g. AWS EC2, GCP Compute, Azure VM, Digital Ocean Droplet, etc.)
- Paying for an application hosting service and hosting it from there (e.g. Railway, Fly.io, AWS Elastic Beanstalk, Google App Engine, Heroku, etc.)

I went for option #2 because it was cheaper than option #3 and I felt like I knew enough about servers to set up my own. Also, [dokku](/posts/what-is-dokku/) helped a lot.

I couldn't do the first option because I wanted ParkSpot to have as much uptime as possible. And, I knew that if I tried to host it from my apartment or office, downtime could be pretty likely because I don't have a redundant a power supply or internet connection. And, it would be too expensive/annoying for me to set that up.

The problem with option #2 is that I'm responsible to make sure that:

- The OS my VPS uses is updated
- The packages installed on my OS are updated, including Dokku
- The docker image that is used for my database is using the latest version of PostgreSQL
- The plugins I'm using within Dokku are updated, like the [Lets Encrypt plugin](/posts/how-to-setup-https-in-dokku/) that makes sure I'm always using HTTPS and not HTTP
- The data of my database is backed up

In both option #2 and option #3 I'm responsible to make sure that:

- My version of Go and Node/NPM are updated
- The dependencies I'm using in Go and in Node are updated (including Svelte/SvelteKit)

It's not hard to do these things. It's just annoying. If I had to do it again, I might try to see if there's some way to automate this work. If it's too difficult, I would consider possibly choosing option #3.

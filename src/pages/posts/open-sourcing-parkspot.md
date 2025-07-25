---
title: 'Open-Sourcing ParkSpot'
date: 2025-07-15 # originally written 2025-01-20
publish: true
layout: ../../layouts/BlogLayout.astro
tags:
  - parkspot

---

Sometime in the summer of 2019, a friend and I learned that a residential community near my home were having a lot of issues with parking. This community had enough spots for residents to park their cars overnight. However, it didn't have enough spots for residents and their visitors to park overnight. As such, the community tried to enforce parking regulations where residents would be allowed a limited number of overnight parking permits for their guests. Unfortunately, this initiative proved unsuccessful. They were using paper permits, which were easy to fake and difficult to track. Residents would often go over their limit without the administration noticing, and the problem would persist.

We built a web application for them using the good ol' LAMP stack. I had recently learned how to program at the time and was totally unaware of web frameworks like React or Vue. We ended up using PHP because the first working [Stack Overflow](https://stackoverflow.com/questions) answer we found for setting up authentication was in PHP. It seemed like a good tool for building web apps.

We eventually finished developing a full working application and delivered it to this community. Not long after, I became painfully aware of how terribly our code had been written:

- We had tons of duplicate code
- We had no separation of concern between frontend and backend (some functions had logic to both query a database and also render HTML)
- Adding functionality meant running the risk of breaking something random and unrelated
- We had 0 testing
- The list goes on...

After two years, I reached a stopping point of begrudgingly adding functionality to my mountain of spaghetti-code and decided to re-write the entire application. I had two attempts before succeeding. In my first attempt, I tried to use NodeJS/GraphQL for the backend and Elm for the frontend; in the second attempt, I tried to write the whole thing in SvelteKit. I succeeded when I tried Go for the backend and SvelteKit for the frontend. I almost used Rust instead of Go, but when I compared the libraries I needed to use in both, they were mostly all more mature in Go. Also, Go seemed generally less verbose and complex for HTTP web services than Rust.

I'm glad I chose Go and SvelteKit because these tools ended being a joy to use. Both Go and SvelteKit felt like they were optimized to be extremely easy to read and simple to write. Go has dead-simple syntax; Svelte code looks like plain HTML/JS. I seem to like tools that optimize for simplicity over expressiveness.

From Oct 2021 to July 2023 I started the journey of re-developing the backend from scratch. In the process, I probably re-wrote and re-factored my backend code like five or six times. Each time I learned why the new version was better organized, faster, or more correct.  Honestly, if I had more time these days, I would probably do another re-factor to make the code even better. I re-wrote the frontend code like three times. I also hired a designer to make a nice and intuitive UI that would work for both desktop and mobile. After 1,632 commits, I felt like the new app was ready. So, I migrated the residential community to use the new application and completely deprecated the old PHP application.

The best part is that users were totally unaffected. Even though I completely changed the application's internals like the codebase and the database engine, users only noticed improvements to the UI.

Today I decided to open-source the new ParkSpot code. You are welcome to check out the codebase of [the ParkSpot backend](https://github.com/dannyvelas/parkspot-backend), the codebase for [the ParkSpot frontend](https://github.com/dannyvelas/parkspot-frontend), as well as the codebase for the [ParkSpot landing page](https://github.com/dannyvelas/parkspot-landing).

It's been a great learning process. I'll post here some mistakes I made while building and what I would do differently if I had to do it again.

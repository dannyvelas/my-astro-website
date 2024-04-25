---
title: "The importance of good testing"
date: 2024-04-17
publish: true
layout: ../../layouts/BlogLayout.astro
tags:
  - career
  - learnings

---

In my very early days of programming, I remember that all the code that I wrote had zero testing. I always left it as an afterthought. I thought of it as something to do if I wanted to be fancy or excessive.

After some of my experiences, I've learned that good testing can be an investment that takes 20% of effort but results in 80% of positive results.

I once worked at a different company a long time ago, in a team that had absolutely no testing for their codebases. Zip. Zero. Zilch. Even more unbelievable is that these codebases were developed by engineers whose roles were much higher than mine. The codebases were a nightmare. They were nonsensical, difficult to read, and even harder to maintain.

Despite the awful tech debt of these codebases, I cared about our codebases working as intended. Accordingly, I wanted to make sure that the PRs that were merged were working as intended. To this end, every time I reviewed a PR, I mentally went through the following "checklist" before approving:

1. I understand what the code was doing before this PR
2. I understand what the code is doing after this PR
3. I understand the edge cases that the code in this PR is taking into account
4. I have some assurance that nothing is going to break in this codebase or beyond, after merging this PR

To be able to check each item, I remember that I would need to go into my terminal, pull the latest changes, checkout out the branch of the PR, and run the PR code. I would manually test it out with different inputs. This approach helped me catch a lot of bugs that I could surface to the implementer. However, there were a variety of problems with this system:

- It was unbearably time-consuming
- It was unbearably tedious
- It was incredibly fragile

I would take hours sometimes to review PRs. These hours weren't fun. They consisted of running code, scanning it line-by-line, parsing its output, and reasoning about it relative to input. Often, I would have to open several windows and keep reminding myself what I needed to check to determine validity. The mental overhead of doing this can be very high. There were moments it was so high for me, that I would sometimes make silly mistakes when determining the validity of a PR's functionality. I would be too caught up in the tedium of checking logs and outputs, that I would miss an important piece of context. As a result of missing this context, I would sometimes wrongly determine that the code was working fine, or vice versa.

Of course, it got to a point where I started avoiding or putting off PR reviews. My brain seemed to subconsciously predict that it was going to be a massive investment in time and mental energy, so it would encourage me to work on something else instead. I was one of a few people that reviewed on the team and naturally, people started getting annoyed that getting PR reviews started taking too long. In the end, people just started blindly merging PRs on the expectation that they would work. And, moments later we would have some critical bug in our codebase. This system was so bad that for a moment, my software development role became more about fire-fighting bugs than about designing, writing code, and testing code.

After leaving that role, I joined another company to bootstrap a project. In this role, I made sure that the codebases I worked on had good testing from day one. I even made sure to install a tool to check that new code changes had at minimum some percent of code coverage. Thanks to this, many of the PRs I reviewed had good testing. This good testing made it so that I could go through my checklist in a matter of minutes. Gone were the days of needing to arduously manually test every single PR to gain some sense of assurance. PR reviews became incredibly fast, reviewing became a happy experience, and the codebase functionality was much more stable.

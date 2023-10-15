---
title: 'A new Hugo-based website'
date: 2023-10-14T08:45:20-07:00
description: 'A post about my experience rebuilding my website from scratch using the static-site generator, Hugo'
tags: ['homelab', 'networking', 'selfhost', 'hugo']
showPageTitle: true
---

As of October 2023, I've decided to overhaul my website, moving from my ReactJS-based site to a minimal, statically-generated, bloat-free Hugo-based site. The entire website (as of October 14, 2023) is only 14MB. Excluding all of the music photos, it is under 3MB. The primary motivation for this rebuild is to start a blog focusing on documenting my endless projects and homelab tinkering. ReactJS, while pretty, is tedious to use if you'd like to add a brand new page for each blog post (at least, the way I had it set up). Additionally, the react-router plugin for ReactJS, which allows routing to different pages, has one large inherent flaw. Say you're viewing a web page that you've created, www.example.com/test. If you refresh this page, you will be presented with a 404 error. React client-sided routing is the culprit, and [this](https://stackoverflow.com/questions/27928372/react-router-urls-dont-work-when-refreshing-or-writing-manually) Stack Overflow discussion gives a good overview of why this issue exists.

[Hugo](https://github.com/gohugoio/hugo) is a fantastic, easy-to-use solution for those who need a simple static website. Everything is done using vanilla HTML, CSS, and JS. The backbone of Hugo is templating, where you may define a single page for re-use elsewhere. Think of it as a simple React Component, but unbelievably lightweight. You can read more about Hugo [here](https://gohugo.io/).

---
title: 'TRACE - a digital footprint tracker'
date: 2021-05-01
description: 'My senior project - a privacy-conscious service to track and manage your digital footprint'
tags: ['web', 'security', 'school']
showPageTitle: true
---

[Try TRACE here!](https://tracedigital.tk)

[My Public Profile](https://public.tracedigital.tk/u/cohenchris)

## Overview
For our senior project, myself and 5 friends decided to make a privacy-conscious, automated way to analyze your
digital footprint. We pulled inspiration from websites like [linktr.ee](https://linktr.ee/) and [campsite.bio](https://campsite.bio).
The GitHub repositories are located [here](https://github.com/TRACE-Digital/).

Please note that currently, new users are not allowed. We are keeping the website up for resume purposes.
With the increasing popularity of social media, e-commerce, and countless other services, the average person
creates accounts on dozens of websites: a situation that can quickly become hard to keep track of. While existing
tools like password managers solve the issue of storing these accounts, none are tailored to gaining an understanding
of a user’s digital footprint. Our project seeks to provide users with a convenient account tracking solution
and information security learning tool by automatically discovering and presenting a comprehensive view of their digital footprint.

## Design
We decided use a "thick client", meaning that a large majority of the data processing happens on the user's computer.
Our intention was to completely contain the user's data to their machine unless they opt to synchronize their data with our servers.
A incredibly useful system combining [PouchDB](https://pouchdb.com/) and [CouchDB](https://couchdb.apache.org)
enables this. Essentially, everything that the user does is stored in the local PouchDB database. If the user enables syncing on our website,
the local PouchDB replicates to the remote CouchDB. Then, if the user logs in on another device, all of their data will be available.
All data is securely end-to-end encrypted, ensuring that your data is always safe from prying eyes.

## Features
Here are some features available:
- Automated username search with support for 300+ websites
- Add custom websites
- Profile page editor
- Public profile page
- Public profile page analytics

## Browser Extension
Unfortunately, many websites disable CORS (Cross-Origin Resource Sharing), which is a huge part of our project. To remedy this issue,
we developed a Chrome extension that intercepts each network request and acts like any other CORS-blocking extension, like
[this one](https://mybrowseraddon.com/access-control-allow-origin.html). It also acts like a password manager, detecting any
credentials entered on the web page. If you have not added the current website to your TRACE data, it gives you the option to do so.
There are also tabs available for generating secure passwords, testing your current passwords, and checking if your usernames or emails
have been implicated in any data breach.

Our browser extension is available on [Chrome](https://chrome.google.com/webstore/detail/trace/klhmocgplcpemcdfeefpaikihedmikgk) and [Firefox](https://addons.mozilla.org/en-US/firefox/addon/trace-digital/) web stores.

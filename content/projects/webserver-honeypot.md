---
title: 'HTTPS Webserver Honeypot in Python'
date: 2020-05-01
description: 'An HTTPS honeypot server designed to lure attackers and study attack methodology.'
tags: ['network', 'security', 'web dev', 'school']
showPageTitle: true
---

## Motivation
Realizing that I lacked experience in cyber security, I decided to 
take the plunge with a large personal project. A honeypot is a term 
used in cyber security describing a network entity that purposefully 
lures attackers away from some more important part of a network. Among 
other functionalities, I decided to implement this. The full project proposal, 
source code, and final analysis/report can be found on 
my [GitHub](https://github.com/cohenchris/webserver_honeypot)

## Creating the honeypot
I began by creating a robust, legitimate-looking HTTP web server. The
final product implemented 14 different response codes, and support for 10 
different file types. There is also full-fledged graphical directory browsing,
starting at the 'server_root' folder.

Each request made to the server is stored in a local MySQL database, recording the
number of the request, time requested, source IP, source port, and hostname if the 
IP is known. This logging proved to be extremely useful for later analysis.

## Monitoring and examining requests
Parsing the server logs, I wrote a blacklisting program that would automatically ban
any IP that attempted to connect 10 or more times in 3 seconds, and returned a specialized
HTTP response code to the client. This helped decrease any excess load on the honeypot.

I temporarily mapped the subdomain 'webserver.chriscohen.dev' to the IP of the server that was
running the honeypot. In just a few days, I got hundreds of requests. The full analysis and breakdown
of the requests can be read in its GitHub repository, linked above. If you'd like to test it for yourself,
an interactive script is available that installs all dependencies, sets up the local MySQL server to log,
and creates a script that starts the server that serves the IP of your choosing.

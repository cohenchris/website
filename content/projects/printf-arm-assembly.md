---
title: 'printf() Replacement in ARM Assembly'
date: 2019-04-01
description: 'A functional replacement for printf(), written in ARM Assembly on a Raspberry Pi 3B+'
tags: ['linux', 'school', 'raspberry pi']
showPageTitle: true
---

In my Computer Architecture course, we had to implement
functionality for{" "}
**printf()'s %c, %s, %d, and %x in ARM Assembly**. %c
and %s were accomplished using loops and the function putchar(). %x was a bit
more difficult - I used bit shifting to isolate 4 bits at a time, translated
into a hex digit, and print the hex digit. %d was the toughest. I
isolated each base 10 digit and printed it, but it was much
tougher than %x since base 10 is not a multiple of 2, so bit
shifting is not possible.

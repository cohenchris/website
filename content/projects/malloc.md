---
title: 'Memory Allocation Library in C, Replacement for "stdlib.c"'
date: 2019-09-01
description: 'A memory allocation library written in C, helping me learn how traditional UNIX memory allocation works.'
tags: ['linux', 'os', 'school']
showPageTitle: true
---

This large project taught me the inner workings of memory
allocation. I created a program that has functionality for
malloc(), free(), realloc(), and calloc(). The main, most
difficult parts were managing large blocks of heap memory obtained
by sbrk() to avoid over-allocation and fragmentation of memory.
Multiple different block-finding methods were implemented - first
fit, best fit, worst fit, and next fit.

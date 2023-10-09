---
title: 'Kernel Instrumentation and Implementing Completely Fair Scheduling in XINU'
date: 2020-03-01
description: 'Implementing a scheduling algorithm for XINU that attempts to efficiently juggle CPU and I/O-bound processes based on typical behavior.'
tags: ['linux', 'os', 'school']
showPageTitle: true
---

## Ideology
The ideology behind this algorithm, currently used in Linux as of 2007, is relatively simple.
CPU-bound processes need the CPU as much as possible, so that they can finish
any needed calculations as quickly as they can. However, I/O-bound processes are not
bottle necked by the CPU, but rather, the user. Therefore, whenever an I/O-bound process is running,
we should context-switch it out until it's ready. When it's finally ready, it's immediately given
control of the CPU.

## Process Priorities
Since, in this case, priority of a process clearly changes throughout its lifetime, we cannot use
XINU's default static priorities. A new field for each process is created, which increases in parallel
to the time that it's been running. This makes it easy to balance all CPU-bound processes and make sure
they get equal control of the CPU.

## Handling Different Types of Processes
First, on creation of a process, it is created a priority value equal to the lowest priority value
in the ready list. This helps make sure that a newly created process doesn't starve any existing processes.
Just completing this simple step already makes sure that every process in the queue gets equal share of
the CPU, without starving any other process. This means that CPU-bound process scheduling is complete.

Secondly, we need to handle I/O-bound processes. There are many cases when a process would be I/O-bound,
but for simplicity in this lab, we were instructed to only handle the case of a sleeping process.
When a process is put to sleep, it is taken out of the ready list, so we don't have to worry about anything
there. However, when the process is woken up, it is given a priority value equal to the maximum priority
in the ready list. This makes it so that a woken process immediately gets the CPU. Setting the priority
value equal to the max in the list, rather than the max total, makes sure that it doesn't starve other
processes.

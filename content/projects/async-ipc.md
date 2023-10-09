---
title: 'Asynchronous IPC and Callbacks'
date: 2020-04-01
description: 'Implementation of a responsive callback function using return-oriented programming.'
tags: ['linux', 'os', 'school']
showPageTitle: true
---

# Lab Motivation
This lab was used as both illustration for how callback functions work, and training for return-oriented programming.
IPC (inter-process communication) is used for a process to signal another process, which would then execute the callback
function once the receiver is running.

# Design
The sender process first puts a message into the receiver's inbox. It will stay there until the receiver has been
context-switched back in. Once that happens, the receiver checks the inbox. If there is a message, return-oriented
programming is used to manipulate the stack. The address of the callback function overwrites the original return address,
and the original return address is moved down one space. This cases the callback function to first be executed, then the
original place in the receiver's code.

# Reflection
This is not the most responsive way to implement a callback function, but there are advantages with this method.
XINU is meant to be run on a single-core machine, and on a relatively weak back end. If we simply ran the callback
function immediately when a receiver receives a message, the overhead involved in doing so could slow down execution
significantly. XINU's single-core approach means that only one process holds the CPU at a given time, so there's no
advantage in doing it that way in the first place, since the sender can never send a message while the receiver runs.

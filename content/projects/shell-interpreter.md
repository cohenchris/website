---
title: 'Shell Interpreter in C'
date: 2019-10-01
description: 'A shell interpreter written in C to combine behavior from common shells.'
tags: ['linux', 'school', 'c']
showPageTitle: true
---

## Motivation
This month-long project covered an absurd amount of content.
We were tasked to create what is essentially a bash clone. The
lexical analysis was done using **flex and bison**,
where I tokenized certain inputs using regular expressions,
executing different code based on what was inputted.

## Challenges

### File Redirection
**File redirection** was one of the first things
that I tackled, so I learned all about juggling file descriptors
to do so. **Piping** was a bit different than file
descriptors - we had to use the pipe() system call and
read/write to/from the pipe to communicate between different
parts of the command.

### Signal Handling
The next section covered
**signals and signal handling**. Specifically, we
set up handlers for ctrl-C (terminate command), ctrl-R (search
command history), and SIGCHLD (zombie process elimination).

### Subshell
One of the most challenging parts of this project was
implementing **subshells**. For this, we had to
fork a new process, and use two different pipes to communicate
with it in order to get the output of the desired command. This
proved difficult to debug because of the fact that two processes
were being run.

### Wildcarding
We also used regular expressions and directory browsing to
implement **wildcarding**. We handled wildcarding
for '*' and '?'.

### Decoding raw input
One smaller part of this project was
**decoding raw input**, rather than canonical
input. I was able to allow the user to type as they normally
would with bash. Specifically, I handled left arrow, right
arrow, delete (and ctrl-D), backspace (and ctrl-H), home (and
ctrl-A), and end (and ctrl-E).

### Command History + Ctrl+R Searching
The last part of this project was to implement
**command history and ctrl-R searching**. Command
history was pretty straightforward, and I ended up imitating
bash's ctrl-R searching mode.

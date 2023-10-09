---
title: 'Sudoku Solver in C++'
date: 2020-01-01
description: 'A sudoku solver with 4 specialized solving algorithms, finishing using recursive brute-force when needed'
tags: ['personal', 'algorithms', 'c++']
showPageTitle: true
---

## Motivation
During my 2019-2020 Winter break, I decided to teach myself
C++, and challenge myself with a project that I had no idea
how to start. The full source code of this project can be found 
on [GitHub](https://github.com/cohenchris/sudoku_solver).

## Thought Process
I bought a sudoku book and began completing puzzles to get a
good idea of how these puzzles could be solved algorithmically
with as little guessing as possible - I ended up implementing
5 different algorithms, which helped me complete around 40-50%
of boards that I threw at it. The challenge, though, was the
rest of the boards

## Brute-Force Finish
To finish everything else off, I implemented a recursive
brute force algorithm. Basically, the idea was, when the
program got stuck, solve a random Cell with a random
candidate, then go on as usual. If the program got stuck
again, it would recurse again, choosing another random value
for another random Cell. If there were any unsolved Cells with
no candidates, that brute force attempt failed, and another
random candidate from the original Cell was chosen. If all
candidates from that Cell failed, the board is unsolvable.

---
title: 'Automatic Display Configuration with AutoRandR'
date: 2023-10-08T20:03:10-07:00
description: 'An article about how to configure the tool "autorandr", which allows you to automatically set display options when certain events happen.'
tags: ['linux', 'os']
showPageTitle: true
---

## Installing AutoRandR
To install autoRandR, execute the following. Note: this may differ based on your package manager.

```sh
paru -Syu autorandr
```

## Saving Your Laptop Configuration
Before you plug in your monitor for the first time, save the default laptop display settings using this command:

```bash
autorandr --save mobile
```

## Configuring XRandR
Once you have plugged your display cable in, you should set the XRandR settings to your liking. For my use case, I want to have my laptop closed, but displaying on my monitor, which is connected using HDMI. I need to do a few things:
1. Disable the laptop display
2. Display on the HDMI output
3. Set the HDMI output as the primary output

To figure out which displays you should use, list them using the command `xrandr`. Here is my output:
```bash
Screen 0: minimum 320 x 200, current 1920 x 1080, maximum 8192 x 8192
eDP-1 connected primary 1920x1080+0+0 (normal left inverted right x axis y axis)
   1920x1080     60.02*+  60.01    59.97    59.96    59.93
   1680x1050     59.95    59.88
   1600x1024     60.17
   1400x1050     59.98
   1600x900      59.99    59.94    59.95    59.82
   1280x1024     60.02
   1440x900      59.89
   1400x900      59.96    59.88
   1280x960      60.00
   1440x810      59.97    59.96
   1368x768      59.88    59.85
   1360x768      59.80    59.96
   1280x800      59.99    59.97    59.81    59.91
   1152x864      60.00
   1280x720      60.00    59.99    59.86    59.74
   1024x768      60.04    60.00
   960x720       60.00
   928x696       60.05
   896x672       60.01
   1024x576      59.95    59.96    59.90    59.82
   960x600       59.93    60.00
   960x540       59.96    59.99    59.63    59.82
   800x600       60.00    60.32    56.25
   840x525       60.01    59.88
   864x486       59.92    59.57
   800x512       60.17
   700x525       59.98
   800x450       59.95    59.82
   640x512       60.02
   720x450       59.89
   700x450       59.96    59.88
   640x480       60.00    59.94
   720x405       59.51    58.99
   684x384       59.88    59.85
   680x384       59.80    59.96
   640x400       59.88    59.98
   576x432       60.06
   640x360       59.86    59.83
   512x384       60.00
   512x288       60.00    59.92
   480x270       59.63    59.82
   400x300       60.32    56.34
   432x243       59.92    59.57
   320x240       60.05
   360x202       59.51    59.13
   320x180       59.84    59.32
HDMI-1 connected 1920x1080+0+0 (normal left inverted right x axis y axis)
   1920x1080     60.00*+  50.00    59.94
   1920x1080i    60.00    50.00    59.94
   1280x1024     60.02
   1280x720      60.00    50.00    59.94
   1024x768      60.00
   800x600       60.32
   720x576       50.00
   720x480       60.00    59.94
   640x480       60.00    59.94
   720x400       70.08
```

We can see that `eDP-1` is the current connected primary monitor (i.e. the laptop display). We want to turn this off.
We can also see that our HDMI cable is connected, named `HDMI-1`. We want to use this display, and make it the primary display.


The command to do this is:
```bash
xrandr --output eDP-1 --off --output HDMI-1 --auto --primary
```

To save this configuration for later use, we should run the command:

```bash
autorandr --save docked
```

## Conclusion
With these commands, your laptop should automatically switch from its own display and the HDMI display when you plug in your HDMI cable, and vice versa. If it doesn't do this automatically, simply run the command:

```bah
autorandr --load <profile_name>
```

---
title: 'Dynamic LED Album Wall'
date: 2024-01-29T14:15:02-08:00
description: 'An article on the process of building my dynamic LED album wall, integrated with Plex'
tags: ['homelab', 'linux', 'raspberry-pi', 'led', 'plex', 'music']
showPageTitle: true
preview: '/images/dynamic-led-album-wall/setup.webp'
---
![Setup](/images/dynamic-led-album-wall/demo.gif)

The Github page for this project is located [here](https://github.com/cohenchris/dynamic-led-album-wall/).

# Background
## Filling Wall Space
In November 2023, I moved into a new apartment, and was struggling to fill wall space. I'd always wanted to display some of my favorite albums, but some were way too expensive to justify, especially since I don't have a record player. I decided to pick ~30 of my favorite albums, and order plain 12x12 photo prints. This way, I could switch them out as I desired, but wouldn't have to pay a ridiculous amount of money for some vinyls that I would never play. Instead of hundreds of dollars, my total was a bit under $60. Many online print shops will have 12x12 prints, but I used [Persnickety Prints](https://www.persnicketyprints.com/) from the suggestion of a friend. As for the shelves and frames, they were bought cheaply off of Amazon for ~$40 total.

## Spotify Wrapped FOMO

Originally, I was going to display the albums plainly on my wall.

Spotify Wrapped season came around, and since I use Plex for my music, I was left wanting to see my yearly statistics, too. I spun up a docker container running [Tautulli](https://tautulli.com/), which is a very popular companion app for Plex. For the most part, people use it to see watch/listen statistics for your Plex library. Plex also has some built-in statistics, but Tautulli is infinitely more detailed.

After messing around with it a bit, I stumbled across the 'Notification Agents' section. Here, I found that Tautulli allows you to send webhooks on any custom playback event. Some of these triggers include:
- Playback start/stop/pause/resume/error
- A stream reaches the credits
- Plex server up/down
- Plex update available

and many, many more. The coolest part - you can individually configure each trigger to send custom data to any HTTP Webhook endpoint you would like.

## Inspiration
This inspired me to create this LED album wall. The basic idea was to have an LED strip under the albums, and have a Raspberry Pi listen for HTTP Webhooks. I would use Tautulli to send different commands to the Pi based on each playback event. If some album begins playing on Plex (on my Apple TV), and it is present on the display, I wanted to highlight that album. Otherwise, I would display some ambient RGB animation.


# Creating The Display

## Basic Design
This was the basic design that I sketched out. I am using Python Flask to run a web endpoint, which accepts HTTP requests.

![Flowchart](/images/dynamic-led-album-wall/flowchart.webp)

## Material List
The material list for this project is as follows:
1. Printed 12x12 album covers
2. 12x12 frames
3. 60" wide shelf
    - Fits 4 albums, size appropriately for your use case
4. Raspberry Pi Zero W
5. SD Card, sized large enough for Raspbian OS
6. WS2812B individually-addressable LED strip
    - This should be a strip that accepts 5V power.
    - If you buy a 12V LED strip, you will not be able to power this over USB. Adjust materials below accordingly.
7. Soldering toolkit
8. Long USB-A to micro-USB power cable for Pi
9. Long male-to-female DC extension cable for the LED strip
    - Pi can only power shorter LED strips, so we need external power.
10. USB to DC adapters
    - Most packs on Amazon include both male and female adapters.
11. DC Screw Terminal Barrel Plug Connector
    - Most packs on Amazon include both male and female adapters.
11. Wall-mount cable covers


## Build
### LED Strip Placement, Frame Measurements
First, I cut an LED strip to fit the shelf. I counted the number of LEDs on the cut strip, and wrote it down for reference.

Next, I laid out the frames alongside the LEDs, and made note of how many LEDs are under each frame.
After some tinkering, I had each frame evenly spaced with 1 LED on either end of the shelf, and 3 LEDs in between each album. I also wrote down the start and end LED indices for each frame, which would come in handy when writing the driver code. Having exact LED indices is essential for an accurate highlight.

Since I plan to swap out albums relatively frequently, I made a small white mark on the shelf to indicate where each album should be placed.

### Hardware Installation
#### LED Strip
At this point, the LED strip is already installed in the right location, so all that needs to be done is connect it to both power and the Pi. As I mentioned earlier, the Pi will likely not be able to provide power to a long LED strip, so we use external power. Refer to the manual for your LED strip, and connect the screw terminal barrel jack adapter to positive and negative leads.

Next, refer to [Pinout](https://pinout.xyz), and determine which GPIO pin to use for your LED strip data line. I used GPIO 18. Carefully, solder your LED data line to the GPIO pin.

![LEDs](/images/dynamic-led-album-wall/leds.webp)

#### Pi Zero W
Using `rpi-imager`, I flashed Raspbian onto an SD card. Ensure that SSH is enabled AND you have entered your Wi-Fi credentials in the installer. The Pi Zero W is wireless only, so you will need both of these to access your Pi. To install the Pi on the shelf, I used a command strip to hide it behind the rightmost album. Before fully screwing the shelf into my wall, I routed both Pi and LED strip power cables behind it. Once I plugged the cables into my power strip, I took some time to cover them with some wall-mount cable covers.

![Pi](/images/dynamic-led-album-wall/pi.webp)

## Code
At a high level, the code for this display is not complicated. However, there were a few hiccups with the development process.

First - if I wanted a constant ambient RGB animation, I would need to create a dedicated thread to run the code in an infinite loop. Fortunately, this wasn't incredibly difficult. I planned to begin the thread and let it run forever. If a request came in to turn the wall off, I would kill the thread.

I had a few different global variables to keep track of the current state of the display, including currently displayed album (if any), and variables to keep track of whether or not the ambient RGB thread was running.

It was at this point I realized that Flask is multithreaded by default. Moreover, global state variables are not kept between requests to the API endpoint - every request gets a clean slate, so I was seeing all sorts of inexplicable issues. Sometimes, there would be two ambient RGB threads at once, which created a seizure-inducing display.

I am embarrassed to say that I spent many hours of time trying to fix this issue. Fix attempts included:
- Using a SQLite database to keep track of global variables
    - This ballooned the code size
    - Later found out that, by default, SQLite is not thread-safe. I looked into using a thread-safe DB, like PostgreSQL, but this would require more external dependencies, which massively complicated the installation process.
- Global variable locks
    - Good idea, but as I mentioned earlier, Flask gives each request a clean slate. This meant that the variables were being locked, but each thread had its own set of global variables, so this ended up solving nothing.
- Using Redis as a thread-safe request queue
    - Required a total code flow redesign.
    - Each call to the API endpoint would simply add the command to the Redis queue. Then, there would be a single driver thread, which would atomically handle each request.
    - Unfortunately, same issue as PostgreSQL database - more external dependencies, complicating the installation process.

In the end, I reverted the code to its original state, and told Flask to use a single thread. This fixed *every issue* :).

You can take a look at the code for this project on Github [here](https://github.com/cohenchris/dynamic-led-album-wall).

### Final API
At the time of writing, the Flask API serves two different endpoints:
1. /albumWall
    - Primary driver endpoint.
2. /ledStatus
    - Returns the current state of the display.

# Applications
## Tautulli Webhooks
Earlier, I mentioned my original plan, where my Apple TV was supposed to drive the album wall display. After finishing the code, we can finally link it all together with Tautulli's custom Webhook Notification Agent.

### Configuration
In Tautulli's settings page, go to 'Notification Agents', and click 'Add a new notification agent'. We will be using the Webhook agent. In the 'Webhook URL' field, paste the '/albumWall' endpoint of your Pi. I set up a local DNS CNAME, so my URL is http://albumwall.lan/albumWall. The Webhook method will be 'POST'.

### Triggers
Generally, I want the following behavior:
- When playback starts, turn the display on, and send data about the currently playing album.
- When playback is paused, turn the display off.
- When playback is resumed, turn the display on, and send data about the currently playing album.
- When a playback error is detected, turn the display off.

So, I selected those four triggers.

There is also a 'playback stop' trigger, but I elected not to use this. Ideally, I would enable this trigger, and it would behave the same as 'playback pause'. However, Plex/Tautulli considers every track change as a playback stop event. This was causing issues that I could not resolve easily - on every track change, the LEDs on the wall would turn off, and then back on again. So, for now, I will not handle this trigger.

### Conditions
By default, with the above triggers, a webhook will be sent every time I begin playing some music, whether it be on my TV, computer, or phone, even when I'm not home. Since the display is right above my TV, I created some conditions to only drive this display when music is being played on my TV.


![Webhook Conditions](/images/dynamic-led-album-wall/webhookConditions.webp)

### Data
Tautulli has an incredible amount of support for custom Webhook data, including Tautulli-provided parameters. The full list is available in the 'Data' tab on your Tautulli instance.

I used two Tautulli-provided parameters - 'artist_name' and 'album_name'.

Referring to the written template from the above 'Triggers' section, this is what some of the JSON payloads will look like:

Playback Start:
```json
{
"playbackEvent": "start",
"ledStatus": "on",
"artistName": "{artist_name}",
"albumName": "{album_name}"
}
```

Playback Pause:
```json
{
"playbackEvent": "pause",
"ledStatus": "off"
}
```

## Integration into Home Assistant
Over the course of the past few months, I've been slowly integrating everything homelab-related into [Home Assistant](https://www.home-assistant.io/), a home-automation-centric application that can do just about anything. To create a simple on/off switch for the display, I utilized Home Assistant's [RESTful switch integration](https://www.home-assistant.io/integrations/switch.rest/), which allows you to create a switch using a REST API as a driver.

The Flask API hosted on the Pi Zero W accepts an 'ledStatus' field in the request to endpoint '/albumWall', which can either be set to 'on' or 'off'. This will be used by Home Assistant to turn the display on or off.

There is another endpoint '/ledStatus', which returns the state of the LEDs. This will be used by Home Assistant to determine whether or not the display is on.

Knowing these two endpoints, the switch can be created as follows:

```yaml
switch:
  - platform: rest
    name: "LED Album Wall Switch"
    resource: "http://albumwall.lan/albumWall"
    state_resource: "http://albumwall.lan/ledStatus"
    body_on: '{"ledStatus": "on"}'
    body_off: '{"ledStatus": "off"}'
    is_on_template: '{{ value_json.ledStatus == "on" }}'
    headers:
      Content-Type: application/json
```

This will create a switch named 'switch.led_album_wall_switch', which can be displayed as a basic on/off toggle switch on your dashboard.

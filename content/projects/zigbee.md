---
title: 'Zigbee-Based Smart Home'
date: 2024-07-24T16:03:05-07:00
description: ''
tags: []
showPageTitle: true
preview: '/images/zigbee/visualization.webp'
---
# Choosing a Smart Home Protocol

Smart home technology suffers from severe fragmentation - there is no single agreed upon standard for smart devices, so you **must** plan well.

There are a dizzying amount of configurations. A few examples include:
- WiFi only, which usually requires the use of the manufacturer's app to control the device.
- Mesh networks like Zigbee and Z-Wave
- Bluetooth Low-Energy (BLE)
- Other smaller mesh protocols, like Thread, Insteon, or Matter

None of these different protocols are directly compatible with each other.
What's worse, there is no regulation for a manufacturer's implementation of these protocols (except for WiFi, of course), so even if you have 2 devices which both use the same protocol, they may not work together.
Some of these devices require the use of a matching hub made from the same manufacturer.
If you use HomeAssistant, you **can** mix and match to a degree, but it will be more complicated than a unified setup.

Essentially, you have the choice of using WiFi, Zigbee, and Z-Wave, so I will cover these 3 options only.

## WiFi
Generally, I would not recommend WiFi unless there is no other option.
In my home, my only WiFi smart device is a [Reolink Video Doorbell](https://reolink.com/us/product/reolink-video-doorbell-wifi/).
Zigbee and Z-Wave are not terribly high bandwidth protocols, so they would struggle with video streaming.
I have never seen a non-WiFi (or ethernet) smart doorbell, so we're pretty much stuck.

Regardless, if you do consider this route, here are my personal pros and cons:

### Pros
**Support and Compatibility** - many manufacturers use and widely support WiFi as a smart home protocol.
I would wager that every type of smart device has a WiFi version.

**Ease of Use** - for many, it's as simple as buying a device, downloading the manufacturer's app, and following the instructions for setup.
From here, you can control the device from anywhere using this app.

**High Speed** - compared to mesh protocols like Zigbee and Z-Wave, WiFi offers significantly higher bandwidth and performance.

### Cons
Assuming you use the manufacturer's app for control, there are a few major drawbacks.

**Cloud Dependency** - if you lose internet, servers crash, or there's a bug in the app, you're totally out of luck, even if you have done nothing wrong.

**Privacy** - nearly every single WiFi smart device will send telemetry back home. Proper network segmentation and firewalling can mitigate this, but I would rather be secure by default.

**Higher Power Consumption** - WiFi is not the most power-efficient protocol, so while you may not notice anything with a few devices, it can add up.

**Network Pollution** - it's pretty simple... if you have many devices connected to your WiFi, you will see a performance hit. This may not be an issue for small setups, but if you have dozens of devices, you will notice.

## Z-Wave
### Pros
**Privacy/Locality** - Z-Wave devices are not connected to WiFi, so there is no opportunity for a manufacturer to collect telemetry.

**No Network Connection Required** - Z-Wave devices operate on their own mesh network, so they do not need to be connected to WiFi.

**No Network Pollution** - Z-Wave uses a different frequency than WiFi, so devices will not interfere with your local network.

### Cons
**Support and Compatibility** - Z-Wave is not as widely adopted as WiFi or Zigbee.

**Hub Dependency** - Z-Wave is a mesh protocol, and requires a central hub to which all devices will report back.

## Zigbee
### Pros
**Support and Compatibility** - Zigbee is the most popular mesh solution for smart devices.

**Privacy/Locality** - same as Z-Wave, Zigbee devices are not connected to WiFi, so there is no opportunity for a manufacturer to collect telemetry.

**No Network Connection Required** - Same as Z-Wave, since Zigbee devices operate on their own mesh network, they do not need to be connected to WiFi.

### Cons
**Possible WiFi Interference** - Zigbee devices can operate on the 2.4GHz or 915MHz bands. If you use 2.4GHz, there will be interference with your 2.4GHz WiFi network.

**Hub Dependency** - Like Z-Wave, Zigbee is a mesh protocol, and requires a central hub to which all devices will report back.

**Limited Range** - Zigbee devices have the shortest range of the 3 protocols mentioned.



# Planning a Zigbee Mesh Network

I selected Zigbee as my preferred protocol - many brands offer Zigbee devices, it's privacy-focused, and has rich HomeAssistant support.

I can highly recommend Sonoff devices.
After nearly a year with them, I have experienced zero issues with device compatibility or stability.

IKEA also makes a wide array of reasonably priced, good-looking Zigbee devices.
Even better, from what I've read online, these devices tend to integrate seamlessly with nearly every other manufacturer's hardware.

PLEASE NOTE - I use HomeAssistant to control everything, and will mention it throughout these next few sections.
If you're curious, the final section in this article will cover HomeAssistant setup.

## Hub
Your very first Zigbee purchase should be a hub.
This hub is a central point of communication for all devices, and you will use this to control everything.
When selecting a hub, please do your research - you want one that does not lock you into using one brand for everything.

I chose Sonoff's [Zigbee 3.0 USB Dongle Plus Hub](https://sonoff.tech/product/gateway-and-sensors/sonoff-zigbee-3-0-usb-dongle-plus-e/).

![Hub](/images/zigbee/hub.webp)

## Routers

Next, you can start buying individual Zigbee smart devices.
Some devices are also "routers", which will act as an intermediate node in your mesh network.
Without routers, all devices must report back to the central hub.
If you have a large area to cover, you *will* experience connection issues, message delays, and possibly even total disconnection.
If you have routers distributed in your home, your network will be more robust and reliable.
Therefore, I tend to recommend that, where possible, each Zigbee device should also have routing capabilities.
Most of the time, this information can be found in the product description.

## Smartifying
### Core Components
If you want to make a dumb device smart, you have a few options:

#### Plugs

If it works for your scenario, a smart plug is the easiest solution.
These plugs "toggle" by allowing or blocking the flow of electricity to the connected device.

I use smart plugs for lamps and fans.
Easy setup, no maintenance, and it's a breeze to swap out devices with no change to my HomeAssistant setup.

![Plugs](/images/zigbee/plugs.webp)

![Fan](/images/zigbee/fan.webp)

#### Switches
Existing light fixtures can be tricky.
I've been very satisfied with Sonoff's [ZBMINI-L2](https://sonoff.tech/product/diy-smart-switches/zbmini-l2/)

These switches work by connecting in series to your existing wall light switches.
Your light switch will work the same as it did before, but the Sonoff device will use wall power to advertise itself for a Zigbee interview.
At this point, you can pick up the device with your Zigbee hub, and control the light switch remotely.
My favorite part - since the ZBMINI-L2 is small enough to fit inside of your wall switch, this solution is completely invisible.

If you aren't familiar with electrical work, this can be daunting, but with proper equipment, it's a 5-minute installation.
Before opening anything up, TURN OFF YOUR BREAKER.
Mains voltage is not something that you want to mess with.
If you're extra cautious, take a multimeter and measure across the positive and negative terminals of your light switch.

Once the power is off, splice and strip the positive/negative wires, leaving sufficient slack.
This switch has 4 ports - positive/negative from the wall, and positive/negative to the light switch.
Take your stripped wire ends and use the screw-terminals on the ZBMINI-L2 to connect the wires to the right ports (READ THE MANUAL!).

Before closing everything up, I would highly recommend turning on the breaker and testing that everything works as expected.
Once you've verified this, close everything up and test again (wires may have moved/disconnected), but that's it!

I really cannot recommend this switch enough.
You *could* use bulbs for every light, but each bulb can be as expensive as one of these switches.
Maybe this isn't an issue for you, but both my room and dining room light fixtures have 3 bulbs.
Instead of spending $100+ on smart bulbs, I spend $30 on 2 switches.
Even better, instead of 6 points of failure, I now only have 2, and each switch is less expensive than replacing one failed bulb.
I also have one set up for my kitchen light, which is a florescent fixture.
There are exactly zero smart replacements for florescent bulbs, so the existence of this switch saves me a lifetime of pain and suffering from having to manually turn on my kitchen light.

![Switches](/images/zigbee/switches.webp)

#### Bulbs
I will preface by saying that, in my opinion, smart bulbs are largely useless.

In nearly every scenario, an internal smart wall switch or a smart plug can accomplish exactly what you need.
Bulbs can be expensive, and have a limited lifespan!
Smart wall switches and plugs are cheap and reliable.

That being said, smart bulbs *do* have their time and place.
I have one smart bulb in my entire house - my porch light.

This is for 2 reasons:
1. Somehow, none of my breakers are connected to the front door light switch, so if I did install a smart switch, I would have to work with live wires (NO!!!)
2. Regardless of #1, I'm lazy and don't want to install a smart switch for one bulb

I chose an [IKEA brand bulb]() because of how well they pair with hubs from nearly every manufacturer.
As much as I hate smart bulbs, this solution works quite well.
Seamlessly paired to my hub, and has never given me trouble.

### The Extras

I'll go out on a limb and say that plugs/switches/bulbs helped smartify every one of your dumb devices - it did for me.

Now, you can have a little bit of fun and buy devices which come with smart functionality built-in. At this point, I started creating problems to solve... whether this is good or bad, that's up to you :)

Summers in San Diego don't get blisteringly hot, but with no AC, my house is pretty uncomfortable at times.
Sonoff sells a fantastic [smart magnetic thermometer](), which, when connected to HomeAssistant, exposes Humidity/Temperature sensors.
This well-polished product helped me figure out that my apartment hovers near 80 degrees and 60-70% humidity during the summer.
How pleasant.

![Thermometer](/images/zigbee/thermometer.webp)

I made some HomeAssistant automations which allowed me to turn every light on/off with the app.
This works well, but poses a few issues
- I don't want to take out my phone every time I get home
- If somebody else is at my house, I want them to have the same convenience that I do

A cheap Sonoff [smart button]() solved this.
After pairing with HomeAssistant, I created an automation to toggle every light when the button was pressed, stuck it on the wall, and called it a day.
Doesn't get easier than that.

![Button](/images/zigbee/button.webp)

## HomeAssistant Integration
### Hub

#### Installation and Setup
My Zigbee hub is directly plugged into my HomeAssistant host via USB, so setup was incredibly easy.
As long as HomeAssistant has access to this USB device (pass it through if you're running Docker), it's as easy as downloading the "Zigbee Home Automation (ZHA)" integration and selecting said USB device.

#### Device Interviewing

To add a new device, first go to the ZHA integration page.
Click on 'devices', then 'Add Device' in the bottom right corner.
If a nearby Zigbee device is within range and in pairing mode, it should appear here.

![Interview](/images/zigbee/interview.webp)

Pretty easy!
One interesting little feature - go to 'Configure' on the ZHA integration page, the navigate to the 'Visualization' tab.
Here, ZHA will show you a visual representation of your Zigbee network!
I haven't found a great use for this, but it looks cool.
Text is a bit small here... each node reports its HomeAssistant alias, device name, device ID, whether or not it's a router, etc.

![Visualization](/images/zigbee/visualization.webp)

#### Automations
This is out-of-scope for this article, but I figured I'd mention a couple of my favorite automations.

- After the sun has set, if my doorbell detects motion, my front door light will turn on.
- Bedtime routine - turns off every light except for my room string lights. After 25 minutes, the string lights flash. 5 minutes later, they turn off.
- When I start watching a movie on my TV, all lights turn off
- When I pause a movie on my TV, 2 small lights turn on
- When I finish/stop a movie on my TV, all lights turn on
- If the temperature in my apartment exceeds 75 degrees, all of my fans turn on

Solutionism at its finest, but I have a lot of fun :)

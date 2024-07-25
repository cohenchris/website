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
### Lights
When smartifying lights, you have a few options:

#### Plugs

For any free-standing lamps, a smart plug is the easiest solution.
These plugs "toggle" by allowing or disallowing the flow of electricity to the connected device.

I use smart plugs for lamps and fans.

![Plugs](/images/zigbee/plugs.webp)

![Fan](/images/zigbee/fan.webp)

#### Switches
Existing light fixtures can be tricky.
My preferred solution is to buy something like Sonoff's [ZBLMINI-2]()

SBMThese switches connect in series to your wall switches.

The main benefit here



If you aren't familiar with electrical work, this can be daunting.

![Switches](/images/zigbee/switches.webp)
#### Bulbs
Existing light fixtures can be tricky.
One solution is to replace each bulb with a Zigbee smart bulb.




### Misc Components


![Thermometer](/images/zigbee/thermometer.webp)

![Button](/images/zigbee/button.webp)

## Hub Controller Options
### Home Assistant

![Visualization](/images/zigbee/visualization.webp)

![Interview](/images/zigbee/interview.webp)

### Others

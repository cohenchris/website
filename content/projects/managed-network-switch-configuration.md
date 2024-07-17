---
title: 'Managed Network Switch Configuration'
date: 2024-07-10T18:14:11-07:00
description: ''
tags: ['switch', 'networking']
showPageTitle: true
preview: '/images/managed-network-switch/switch-diagram.webp'
---

# Motivation
In early 2024, I began overhauling my existing networking setup.
Since I'd just moved to a new apartment by myself, I would have full control.
No more worrying about knocking my roomates off of the internet!
After spending some time setting up an OPNSense router with multiple VLANs, the next logical step was to set up a managed switch, allowing me to fully utilize the router's VLANs for each connected device.


# Buying Used
When buying hardware, you will have to do some soul-searching, figuring out how you'd like to balance these points:
- Capability/Future-proofing
- Power Consumption
- Noise
- Durability
- Price

With network equipment specifically, I am a huge fan of used enterprise hardware.

After scouring eBay for a while, I bought a Cisco SG300-28PP PoE+ Managed Network Switch from 2017.


## Capability/Future-proofing
Used equipment of any kind will always be less capable than brand new hardware.
It's up to you whether this hit in performance is acceptable.

Network equipment has not evolved as drastically as other forms of computing.
Gigabit internet has been widely available since the 2010s, and it's my opinion that most people do not truly need more than gigabit speeds.

The Cisco unit that I bought comes with more gigabit ports than I know what to do with - 28, to be exact.
26/28 ports are your typical 10/100/1000.
The remaining 2 of these ports are combo gigabit SFP ports, which I don't plan to use, but they are nice to have.
Even better, 24/28 ports are PoE+, and has a maximum power budget of 180W.
Even if I buy a house, I don't see myself ever exhausting the capability of this switch.


## Power Consumption
Enterprise equipment will almost always have higher power consumption.
This can be due to a variety of reasons...

For one, older hardware is less efficient than newer hardware.

Enterprise equipment may also have more features than their consumer counterparts.
For example, you will never find an 8-port enterprise-grade switch.
Conversely, you will never find a 48-port consumer-grade switch.
Depending on the use-case, I think that this higher power consumption is worth it.

My Cisco unit is actually very acceptable here.
I see an average idle draw of 30W, which includes 3 connected PoE+ devices!


## Noise
Enterprise equipment is designed to be used in enterprise applications (duh).

Think about data centers.
What's the first priority - speed or noise?
Many pieces of enterprise equipment are **seriously** loud, and my Cisco unit is no exception.

I opted to replace the 2 rear fans with 40mm Noctua fans, which quiets this thing down to a whisper.

Unfortunately, many manufacturers decide to use a non-standard fan header, so replacement fans will not work out of the box.
Noctua has a [nice kit](https://noctua.at/en/nf-a4x20-pwm) for replacement 40mm fans, which includes their incredibly useful OmniJoin adapter set.
I can highly recommend these fans - I'm using them in nearly every computer that I own.

However, PLEASE DO NOT PERFORM THIS MOD WITHOUT PROPER PRECAUTION.
The original loud fans serve a very good purpose - this unit has a monstrous 180W PoE+ power budget.
These two tiny rear fans serve the purpose of cooling this entire unit.
The replacement fans push significantly less air than the original ones, so it is entirely possible for your unit to overheat, break, catch on fire, or who knows what else?
Another side effect is that once these fans have been replaced, the switch's firmware can not detect how fast the fans are spinning, so there will always be a "fan malfunction" alert on your dashboard.
It is a terrible idea to perform this mod, hook up 10 PoE devices, and expect everything to work without a hitch.

Noise is probably the biggest issue with used enterprise equipment, so tread carefully.


## Durability
When buying used, you *do* run the risk of hardware failure with no warranty.
Typically, enterprise-grade equipment lasts longer than consumer-grade equipment, though, so I don't worry about it much.


## Price
Price is a *huge* plus here.
For the most part, enterprise equipment depreciates heavily, so you can grab some steals.
I ended up buying an old Cisco network switch for $100 shipped. The unit was anywhere between $800 and $900 new.

I don't think I could find a better deal if I wanted to.


# Setup

## Preparation
### Factory Reset
I have no idea whether or not the previous owners reset the switch.
If they did not reset it, I have no way of knowing what the IP is, so connecting to the web interface could be difficult.
Fortunately, factory resetting is easy.

First, allow the device to fully boot.
Then, press and hold the "Reset" button on the front of the switch.
After ~10 seconds, all of the system LEDs will start blinking, indicating that the device is in recovery mode.
Release the "Reset" button, then wait for the switch to reboot.
After booting, the switch will be reset to factory settings, and will be accessible at 192.168.1.254 with default username/password as cisco/cisco.

### Static IP Assignment
To make things easy from here on out (plus, I use the 10.0.0.0/8 subnet instead of 192.168.0.0/16), I assign a static IP to this switch via OPNSense.

All you need is the MAC address. The easiest way to find this is to look at the sticker on the back of the unit.

After this change (and corresponding firewall changes, which is out of scope for this article), I was able to access the switch's web interface.

![Switch Static IP](/images/managed-network-switch/static-ip.webp)

### Firmware Upgrade
To upgrade the firmware, I first went to [Cisco's Support Page](https://www.cisco.com/c/en/us/support/index.html).

I entered my product name in the search bar, then clicked Downloads --> Switch Firmware, then downloaded the most recent version.

Once downloaded, go to the Cisco web management interface.
In the sidebar, go to Administration --> File Management --> Upgrade/Backup Firmware.

Choose the following settings:
- Transfer Method: via HTTP/HTTPS
- Save Action: Upgrade
- File Type: Firmware Image

Click "Choose File", and select your previously downloaded firmware file.

![Firmware Upgrade](/images/managed-network-switch/firmware-upgrade.webp)

After this process is successful, you should activate this new image. In the sidebar, select the tab below, "Active Image".
Here, you can select the newest firmware version, then reboot your device!

## Planning
Planning a network switch is easy:
1. Allocate one port for the connection to your router (port 1 is typical, but not required).
2. Determine which devices you will be connecting
3. Determine which VLAN(s) that each device will belong to
4. If you're a neat freak like me, plan out exactly which devices will connect to which ports

![Router and Switch Diagram](/images/managed-network-switch/router-and-switch-diagram.webp)

Right now, I don't use very many ports.

**Port 1** is for connection to the router, so it must accept traffic from any VLAN.

**Port 13** is connected to my dedicated backup server, which gets its own special isolated backups VLAN.

**Port 14** is connected to my Apple TV, which is a smart device, so it goes on the IoT VLAN.

**Port 15** is connected to my wireless access point.
Since the AP is a core network component, it goes on the management VLAN.
However, the 3 SSIDs will each be on a separate VLAN - trusted, guest, and IoT.
Therefore, this port should accept traffic from all 4 of these VLANs.

**Port 24** is connected to my main lab machine. This machine is directly serving the internet, so it goes into the DMZ VLAN.

### Security
Every other port will be on the guest VLAN for security reasons.

If some bad actor tries to connect to one of these empty ports, they should have access to nothing internal - only the outside internet.

What about the other ports, though?
If somebody were to connect to port 15, for example, they would have access to 4 of my VLANs!
Not great.
In OPNSense, I first ensure that every client has a static IP assigned by the router, then have each VLAN (except Guest) deny unknown clients.

Now, if somebody plugs into any of the Guest ports, they have internet, but no access to any internal device.
If somebody plugs into one of the other ports, they have access to absolutely nothing - not even internet.

## Configuration

A checklist:

- Port 1 - every VLAN
- Port 13 - Backups VLAN, tag 50
- Port 14 - IoT VLAN, tag 20
- Port 15 - Management/Trusted/IoT/Guest VLANs, tags 1/20/30/40
- Port 24 - DMZ VLAN, tag 10

### Create VLAN Definitions Matching Router
The actual creation of these VLANs happens on your router.
The process varies per router, and is out of scope for this article.
I use OPNSense, and here are my VLANs:
- 1 - Management
- 10 - DMZ
- 20 - IoT
- 30 - Trusted
- 40 - Guest
- 50 - Backups

To add these, go to the sidebar and click VLAN Management --> VLAN Settings.

Click "Add", then enter your VLAN ID + name.
Click "Apply".
Once each VLAN has been added, you may finally assign a VLAN to each port.

![Add VLANs](/images/managed-network-switch/add-vlans.webp)

### Configuring VLAN(s) for each port
#### Trunk vs. Access
On this switch, you can configure each port to be a trunk or an access switch.
These names may change depending on manufacturer, but the core concept is the same.

An access port is intended to be used with a device connected which does not have any concept of VLANs.
Think individual computers - these ports are designed to connect to end devices.
Each access port carries traffic for a single VLAN, ensuring that the traffic to this port is tagged with the correct VLAN ID.

In contrast, a trunk port  is intended to be used with a device connected which does have a concept of VLANs.
Think about other network devices like another switch, a wireless access point, etc.
Each trunk port carries traffic for multiple VLANs simultaneously, tagging each frame as it goes.
This allows multiple VLANs to be extended across different network segments.

In my case, port 24 is the easiest example.
This port is connected to my main lab machine, and needs to go on the DMZ VLAN (tag 10).
This port should be set to "access".

Ports 13 and 14 are the same - they connect a single computer to the port.
Setting the port to access mode ensures that all traffic is tagged with the single VLAN.

Ports 1 and 15 are tagged as trunk ports, indicating that multiple VLANs may pass through.

The rest of the ports should be access ports tagged to the guest VLAN.

To configure this correctly, go to the sidebar and click VLAN Management --> Interface Settings.
For each port, click "Edit" and set the correct "Interface VLAN Mode".

#### Port VLAN Membership
From the sidebar, navigate to VLAN Management --> Port VLAN Membership.

Here, we will specify which VLAN tags correspond to each port.
For each trunk port, set tagging to "Tagged".
For each access port, set tagging to "Untagged".

![Tagging](/images/managed-network-switch/tagging.webp)

In my case:

- Port 1 will be a member of every VLAN.
- Port 13 will be a member of the Backups VLAN (tag 50).
- Port 14 will be a member of the IoT VLAN (tag 20).
- Port 15 will be a member of the Management, Trusted, Guest, and IoT VLANs (tags 1, 20, 30, and 40).
- Port 24 will be a member of the DMZ VLAN (tag 10).
- All other ports (2-12, 16-23, 25-28) will only be members of the Guest VLAN (tag 40).

For each port, click "Join VLAN", and move the member VLAN(s) to the right side.

### Conclusion
After this is all set up, make sure that you save the running configuration to memory.

From the sidebar, go to Administration --> File Management --> Copy/Save Configuration.

- Source File Name: Running configuration
- Destination File Name: Startup configuration

![Save Configuration](/images/managed-network-switch/save-configuration.webp)

Then, click Apply, and you're done! Traffic should be routing as designed. Please note that, in order for these VLANs to take effect, router configurations must match, and network devices may need to be rebooted.


---
title: 'Docker Takes a Long Time To Start At Boot'
date: 2023-10-01
description: 'Sometimes, the docker daemon takes multiple minutes to start on boot. This is a solution to fix that.'
tags: ['docker', 'homelab', 'networking']
showPageTitle: true
---

## Description
Docker, by default, waits for the network to be online before running. This may cause the docker daemon to take a bit to start. To solve this, we should remove this dependency.

## Solution
1. Open the docker systemd service file:

```bash
sudo vim /lib/systemd/system/docker.service
```

2. Near the top, you should see a line that looks like this:

```
After=network-online.target docker.socket firewalld.service containerd.service time-set.target
```

3. Remove network-online.target

```
After=docker.socket firewalld.service containerd.service time-set.target
```

4. Reload systemd daemons

```
sudo systemctl daemon-reload
```

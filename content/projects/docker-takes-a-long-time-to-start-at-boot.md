---
title: "Docker Takes a Long Time To Start At Boot"
date: 2023-10-01
description: "Sometimes, the docker daemon takes multiple minutes to start on boot. This is a solution to fix that."
tags: ['docker', 'homelab', 'networking']
---

[Solution: remove the dependency on network-online.target for docker.service](https://superuser.com/questions/1356698/docker-service-takes-1-minute-and-30-seconds-causing-slow-boot)

```sudo vim /lib/systemd/system/docker.service```

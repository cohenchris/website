---
title: 'A Small Crash Course for ZFS'
date: 2024-06-12T11:45:00-07:00
description: ''
tags: ['zfs', 'linux', 'filesystem']
showPageTitle: true
preview: ''
---

# What is ZFS?

ZFS stands for Zettabyte File System, and is a filesystem designed to be stable, data-safe, used for high storage capacities, and scalable.
It was designed by Sun Microsystems for Solaris back in the day, but is available for many major platforms today.
It is regarded as one of the most advanced, stable, filesystems out there, but use is not as high as it could be due to its exclusion from the Linux kernel.

For more information on ZFS, check out their official [github.io website](https://openzfs.github.io/openzfs-docs/)

# How to set up ZFS on Linux

## Package Installation
There are a couple of packages to install. I am using [paru](https://github.com/Morganamilo/paru), a fantastic AUR helper for Arch Linux, but tweak for your package manager:
```sh
paru -S zfs-dkms zfs-utils
```
IMO, it is important to install `zfs-dkms`. DKMS stands for Dynamic Kernel Module Support, which will automatically install the correct version of a package for your kernel version.

Next, you need to load the ZFS module and configure it to load on boot.
Loading on boot is especially important - without, you would need to manually start ZFS and import pools on each boot.
```sh
sudo modprobe zfs
sudo systemctl enable zfs-import-cache.service
sudo systemctl enable zfs-import.target
sudo systemctl enable zfs.target
sudo systemctl enable zfs-zed
sudo systemctl enable zfs-mount.service
```

After reboot, to check that ZFS is working correctly, run the following commands:
```sh
sudo zfs version
sudo dkms status zfs
```

### Why is ZFS not pre-packaged in Linux?
ZFS is not included in the Linux kernel (and will likely never be) due to license incompatibility between the two projects.
ZFS is released under the Common Development and Distribution License (CDDL), but the Linux Kernel is released under the GNU General Public License version 2 (GPL v2).
If code from these two projects were combined and distributed, it would violate terms from at least one of the licenses.

### Keep in Mind
Because ZFS is not included in the Linux project, ZFS may be incompatible with the newest versions of Linux for a bit while a new version is tested and pushed.
Therefore, if you use a rolling release distribution, when you upgrade your Linux kernel, it's important to double-check that this new version is compatible with the currently installed version of ZFS.
Typically, there are release notes on ZFS's official [GitHub](https://github.com/openzfs/zfs/releases) which specifies the Linux kernel compatibility.
If you do accidentally upgrade, you will not be able to access any ZFS drives until you fix the version incompatibility.

### In Case of Fire
If you do unintentionally upgrade and break ZFS, it's easy to roll back to a previous version of Linux. First, using [this page](https://github.com/openzfs/zfs/releases), determine which version of ZFS you would like to install. Note the Linux kernel version compatibility in the release notes.
Fortunately, there is usually a package called ```downgrade```, which takes care of downgrading other packages. To downgrade your Linux kernel, type the following:
```sh
sudo downgrade linux
```

In the graphical menu, select the version of Linux shown in the previously mentioned release notes. Then, reboot.
Once Linux boots to GRUB, ensure that this older version of Linux is selected. Once you have fully booted, reinstall ZFS DKMS modules to ensure that ZFS is re-built for the current kernel version:
```sh
paru -S zfs-dkms
sudo modprobe zfs
```

Run the following to check the status of ZFS:
```sh
sudo systemctl status zfs
```

If everything has checked out until this point, you should be able to see your ZFS filesystems mounted again!

### Run LTS Instead!
Personally, if you run ZFS, I would highly recommend running an LTS kernel. These kernel releases are less frequent, but more stable. You can be reasonably confident that every LTS kernel release will be compatible with some version of ZFS.
Originally, I used a rolling release kernel, but ended up breaking ZFS twice in the span of one month. Since switching to an LTS kernel, everything has been rock solid and worry-free.

## Important Concepts
There are two very important concepts to know when dealing with ZFS - pools and filesystems.

### Pools
You can think of ZFS pools like RAID arrays. Pools are created by combining one or more drives, aggregating the storage and managing files across all drives.
For example, one common RAID configuration is RAID-1, which consists of two separate drives, and mirrors data across both. This allows for up to one drive failure without incurring data loss. RAID-1 is typically accomplished using hardware RAID controllers, which can be notoriously unreliable at times.
ZFS has a mirroring functionality as well, but all storage logic is handled in software by the ZFS driver. For most common RAID configurations, there is an equivalent in ZFS.

### File Systems
In a ZFS pool, you may have one or more filesystems active. Each filesystem will be logically separate from each other, functioning like separate directory trees.
Think of a ZFS filesystem like a typical drive partition.
Multiple partitions can exist on the same drive, but function completely separately from one another.

## Usage

### Simple Example
First, you should create a pool on some new storage device.
```sh
sudo zpool create POOL_NAME /path/to/device
```

On this pool, create a filesystem.
```sh
sudo zfs create POOL_NAME/FILESYSTEM_NAME
```

After creating this filesystem, it should automatically be mounted to /FILESYSTEM_NAME. You can check the mount status/location using:
```sh
sudo zfs mount
```

That's it! You've now created your first ZFS filesystem that's ready for use. If you'd like, you can tweak settings such as compression, deduplication, record size, cache settings, and more using the zfs command, but that's out of scope for this article.

### Mirroring
In the future, I plan to use ZFS to have a mirrored boot drive setup for my computer. Once I do this, I will update this section.In the future, I plan to use ZFS to have a mirrored boot drive setup for my computer. Once I do this, I will update this section.

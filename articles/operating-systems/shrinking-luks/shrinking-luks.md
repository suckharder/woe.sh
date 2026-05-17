# Shrinking an existing LUKS encrypted partition and installing Windows utilizing the new free space
> This guide was tested on Ubuntu 26.04 LTS and Windows 11 25H2, although it should work well under similar conditions

If you're anything like me, and made a fully encrypted, full-disk GNU/Linux install on your machine, only to find out that you need to dual-boot down the line, I have good news.
The following documentation of the process *should* serve you well.

**If you only want to shrink, without installing a new OS, read Part 1 only.**

## Prerequisites

| Shrinking LUKS                   | Installing Windows                                       | Installing other OS's                          |
|----------------------------------|----------------------------------------------------------|------------------------------------------------|
| Enough free space                | A bootable Windows USB (ideally native or Rufus-written) | varies, but likely, you're in for an easy ride |
| A bootable Ubuntu (or other) USB |                                                          |                                                |
| Some caution and patience        |                                                          |                                                |

> ⚠️ You're your own person, making your own decisions. Be careful as **there is a chance of data loss**. Ideally, you should have an up-to-date, working **back-up** (or multiple).

## Part 1: Shrinking an existing LUKS encrypted partition

As a reference, this was my disk structure:

```bash
lsblk -o NAME,SIZE,TYPE,FSTYPE,MOUNTPOINT
```

**Output:**
```
nvme0n1                     476.9G disk  
├─nvme0n1p1                     1G part  vfat        /boot/efi
├─nvme0n1p2                     2G part  ext4        /boot
└─nvme0n1p3                 473.9G part  crypto_LUKS
    └─dm_crypt-0            473.9G crypt LVM2_member
    └─ubuntu--vg-ubuntu--lv 473.9G lvm   ext4        /
```

```bash
df -h
```

**Output:**
```
Filesystem                         Size  Used Avail Use% Mounted on
/dev/mapper/ubuntu--vg-ubuntu--lv  466G   12G  430G   3% /
```


> This documentation specifically uses the aforementioned structure. Adjust the commands accordingly. Note that I had only used up 3% of my volume, and therefore had plenty of space to work with.

### Step 1: Boot up a live Linux USB

**Do not** do this on a mounted system. Boot up a live instance. I just used the same Ubuntu 26.04 LTS image as my system.

### Step 2: Open the LUKS container

```bash
sudo cryptsetup luksOpen /dev/nvme0n1p3 cryptroot
```
This maps the encrypted partition to `/dev/mapper/cryptroot`.

### Step 3: Activate LVM volumes

```bash
sudo vgchange -ay
```
The volume will be at `/dev/mapper/ubuntu--vg-ubuntu--lv`.

### Step 4: Check the filesystem for errors

```bash
sudo e2fsck -f /dev/mapper/ubuntu--vg-ubuntu--lv
```
Make sure this *fully* passes. I actually had a few small "issues" that had to be resolved.

### Step 5: Shrink the filesystem

```bash
sudo resize2fs /dev/mapper/ubuntu--vg-ubuntu--lv 75G
```
This will resize the ext4 FS inside the LV. In my case to 75G.

### Step 6: Shrink the logical volume

> It's possible this won't do anything (outputs "skipping"). That is a *good thing* and you can continue with Step 7.

```bash
sudo lvreduce -L 80G /dev/mapper/ubuntu--vg-ubuntu--lv
```
Use a slightly larger size than before.

### Step 7: Verify FS size

```bash
sudo resize2fs /dev/mapper/ubuntu--vg-ubuntu--lv
```
The output **must** be as expected.

### Step 8: Deactivate LVM and close LUKS

```bash
sudo vgchange -an
sudo cryptsetup close cryptroot
```
> **🔧 Troubleshooting: if cryptsetup reports "still in use"**
>
> ```bash
> mount | grep ubuntu
> ```
> If still mounted, unmount. Failing that, move on to:
>
> ```bash
> sudo fuser -vm /dev/mapper/ubuntu--vg-ubuntu--lv
> ```
> If this does not reveal the culprit, you can try to:
>
> ```bash
> sudo lvs
> ```
> If you see `-wi-a-----`, it's definitely still active (`a`). Try:
>
> ```bash
> swapon --show
> ```
> It's unlikely for a swap to be there, but if it is, turn it off. If not, try:
>
> ```bash
> sudo systemctl stop udisks2
> ```
> If the live environment was auto-mounting the volume, this should prevent it. If not, try:
>
> ```bash
> sudo dmsetup info -c
> ```
> If it shows `ubuntu--vg-ubuntu--lv` as `Open: 0`, it's likely some weird state issue. Try:
>
> ```bash
> sudo lvchange -an -f /dev/mapper/ubuntu--vg-ubuntu--lv
> sudo vgchange -an -f
> sudo cryptsetup close cryptroot
> ```
> If that fails, you can still try:
>
> ```bash
> sudo dmsetup remove -f /dev/mapper/ubuntu--vg-ubuntu--lv
> sudo cryptsetup close cryptroot
> ```
> Failing that, at this point just do:
>
> ```bash
> sudo dmsetup remove_all
> sudo cryptsetup close cryptroot
> ```
> This should truly force it. The output should be `Device cryptroot is not active.`.

### Step 9: Shrink the partition

```bash
sudo parted /dev/nvme0n1
```
Then run the command:

```
print
```
The output should be something like:

```
Number  Start   End     Size    File system  Name                          Flags
 1      1049kB  1128MB  1127MB  fat32                                      boot, esp
 2      1128MB  3276MB  2147MB  ext4
 3      3276MB  477GB   473.9G

```
Then run the following commands:

```
resizepart 3 18%
quit
```
Again, aim for a *slightly* larger size. In my case, with 18% I ended up with 90-something GB.

### Step 10: Check

```
sudo cryptsetup luksOpen /dev/nvme0n1p3 test
sudo cryptsetup status test
sudo cryptsetup close test
```
This should confirm the container still opens correctly. If close complains again, at this point just ignore it and move on.

### Step 11: Reboot into your system 🎉

If everything worked correctly, your system should still run fine. You've now successfully shrunk your LUKS encrypted partition.

## Part 2: Installing Windows

I quickly realized that due to Windows being *Windows*, this has the potential to have some pitfalls.

Here's the list in no particular order:

1. **Bootable USB:** If possible, make it using the official tool, or Rufus. Ventoy might create some issues, and Gnome Disks image restore does not work correctly with a Windows ISO, neither does Etcher.

2. **Leftover partitions:** A previous Windows install, or a previous failed Windows install might have left you with a `msftres` partition, which confuses the new Windows install.

3. **BIOS settings:** Some of your settings might be throwing Windows for a loop. These might include: Secure Boot, Fast Boot, Legacy Boot/CSM, RST/VMD/RAID.

4. **General confusion:** Windows might just be confused by having the Linux/LUKS partition around, by the structure, by some Linux leftovers...

What worked for me, and might work for you, is going back to Linux, and formatting the free space as an NTFS partition. Then just picking the new NTFS partition for the Windows install.

Anyway:

### Step 1: Choose where you install Windows correctly

***This is crucial.***

### Step 2: Install Windows normally

`Shift+F10` and `OOBE\BYPASSNRO` (still) worked for me in 25H2, if you wish to use it.

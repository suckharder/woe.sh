# Operating Systems

Ultimately, an operating system is your choice, and everyone has their own preferences and needs. Below is a collection of some resources and opinions regarding this topic.
OSs are a deep rabbit-hole, and we're about to just barely scratch the surface.

## Desktop / Laptop

### ❤️‍🔥 My picks

Much like with browsers, I recommend a 3-way split.

1. **Main (Daily - "bread and butter 🧈")**

**MacOS.** It's simple really - you get a Unix-like operating system, with a normal command line, a nice UI, great software compatibility and a nice workflow. I personally use it without an Apple account (I've no interest in Apple's ecosystem integrations), and with a few tweaks, it offers a decent amount of privacy too. To quote Todd Howard: "It just works".

2. **Secondary (Semi-daily - "power use 🪄")**

**Linux (specifically Ubuntu 26.04 LTS).** The undisputed king of operating systems - unmatched usability, functionality, versatility. Infinitely configurable. Nowadays, the software (and hardware) support is really good too. Obvious pick for servers as well.

3. **Tertiary (Supplementary - "the bane of my existence 💀")**

**Windows.** I only use this for videogames, along with some-odd use cases and software. Really, I try to interact with it as little as possible.

---

### 🪟 Windows

Unless you're looking for *maximum gaming compatibility*, have to use *software* that is Windows-specific (with no workarounds), or your *hardware* does not work as well with other operating systems (yes, that happens - most notably with laptops) - I'd recommend **avoiding** Windows like the plague.

***Some reasons in no particular order:***

1. I really dislike the "Windows philosophy"
2. It's terrible for privacy
3. Often not stable, easily breakable (sometimes on its own)
4. Lacking important features and settings
5. Requires a lot of additional configuration and de-bloating to get it to a usable state

> ⚠️ Always use ONLY the official Microsoft sources to acquire an installation medium.
> You do **not** need an account, you do **not** need a credit card, you do **not** need a license.

**Windows 11** Download link : [Click \[official Microsoft link\]](https://www.microsoft.com/en-us/software-download/windows11 "Microsoft Windows 11")

Even if you're running "unsupported hardware", use ***Windows 11, along with the latest security updates***. There are *many* workarounds and online guides, and some flashing software such as *Rufus* bypasses the requirements for you with just a click.

> ⚠️ Do **not** use any shady activators (KMS and such) - if you wish not to pay, Windows is perfectly usable without a license. Alternatively, use a trusted activator like [massgrave](https://github.com/massgravel/Microsoft-Activation-Scripts "Microsoft Activation Scripts"). One-liner in an elevated PowerShell `irm https://get.activated.win | iex`.

Essential Windows software (non-exhaustive):

| 🪠 Debloating and Tweaks   |            | 🔧 Tools                             |            | 🌐 Browsers         |        |
|---------------------------|------------|-------------------------------------|------------|--------------------|--------|
| [Chris Titus Debloat Tool](https://github.com/ChrisTitusTech/winutil "Chris Titus")  | FOSS 🟢     | 💼 [7-zip](https://7-zip.org/download.html "Igor Pavlov") (archiver)                  | FOSS 🟢     | [Firefox](https://www.mozilla.org/en-GB/firefox/download "Mozilla")            | FOSS 🟢 |
| [Windows Privacy Dashboard](https://wpd.app "WPD Team") | Freeware 🟠 | 🌄 [Irfanview](https://www.irfanview.com/64bit.htm "Irfan Skiljan") (image viewer)          | Freeware 🟠 | [Brave](https://brave.com/download "Brave")              | FOSS 🟢 |
|                           |            | ▶ [MPV](https://github.com/shinchiro/mpv-winbuild-cmake/releases "Shinchiro") (media player)                | FOSS 🟢     | [Librewolf](https://librewolf.net/installation/windows "Librewolf")          | FOSS 🟢 |
|                           |            | ▶ [VLC](https://www.videolan.org/vlc "VideoLAN") (media player)                | FOSS 🟢     | [Mullvad Browser](https://mullvad.net/en/browser "Mullvad")    | FOSS 🟢 |
|                           |            | 📝 [Onlyoffice](https://www.onlyoffice.com/download-desktop "Ascensio System") (office suite)         | FOSS 🟢     | [Ungoogled Chromium](https://ungoogled-software.github.io/ungoogled-chromium-binaries "Ungoogled Chromium") | FOSS 🟢 |
|                           |            | 💻 [VSCodium](https://github.com/VSCodium/vscodium/releases "VSCodium") (code editor)            | FOSS 🟢     |                    |        |
|                           |            | 🔐 [KeepassXC](https://github.com/keepassxreboot/keepassxc/releases "KepassXCReboot") (password manager)      | FOSS 🟢     |                    |        |
|                           |            | 🥷 [ExifCleaner](https://github.com/szTheory/exifcleaner/releases "szTheory") (metadata stripper)   | FOSS 🟢     |                    |        |
|                           |            | 🧹 [Bleachbit](https://www.bleachbit.org/download/windows "Bleachbit") (system cleaner)        | FOSS 🟢     |                    |        |

Note: If you're planning on dual-booting Windows and another OS, installing Windows first *usually* yields a better result.

---

### 👑 Linux

I keep seeing these *awful* articles titled along the lines of "the best Linux distro in 2026" or "the best distro for gaming".

The fact is, your choice of distribution probably **matters less** than you think. In fact, I maintain the opinion that most Linux distributions are ***practically useless***.

You're *free to explore, distro-hop* and pick your own - maybe you like the look, the defaults, the "philosophy" — but **most of the time**, you're picking from **3 "main branches"**:

#### 1. ⭕ Debian-based

I'd wager that most distributions fall into this category. It might sound counter-intuitive, but for this category I'd recommend **Ubuntu** over **Debian** for personal use. *Debian is the "king of stability"*, but you're getting far older packages, and by the time you're getting into the Sid Unstable repositories for something more up-to-date, you're kind of missing the point of Debian. But it's a *fair* choice too.

**Debian** Download link: [Click \[official link\]](https://www.debian.org/distrib "Debian")

**Ubuntu** Download link: [Click \[official link\]](https://ubuntu.com/download "Ubuntu")

#### 2. 🔷 Arch-based

*Bleeding edge, fast,* ***fun***, great for learning. Not necessarily the most stable. I'd recommend just sticking with **Arch**. **CachyOS** is nice too - sensible defaults, and some *genuine* added value.

**Arch** Download link: [Click \[official link\]](https://archlinux.org/download "Arch")

**CachyOS** Download link: [Click \[official link\]](https://cachyos.org/download "CachyOS")

#### 3. 🎩 Fedora-based

Stable, good software and hardware support. A great work-horse. Sticking with Fedora is a very sensible choice.

**Fedora** Download link: [Click \[official link\]](https://fedoraproject.org/ "Fedora")

Picking a "main" distribution, or something closely related to it is generally going to give you the best ***stability, security and support***. These also usually have *good documentation and a large community*. It's also very ***unlikely*** for these to go unmaintained. Most other distributions provide *very little added value*, if any, and are often just "reskins" of these "main" distributions, with a few extra packages, configurations, and worse maintenance. Mostly, the only benefit is simply a *little more convenience*.

A lot of your Linux experience is dictated by your choice of a window manager, or desktop environment [\[what?\]](https://wiki.archlinux.org/title/General_recommendations#Graphical_user_interface "DEs and WMs"). A noticeable (but arguably not as impactful) difference between distributions is often the default package manager. There are distribution-agnostic packaging solutions as well - most notably Snap (not a fan), Flatpak and AppImage.

#### 🟠 Ubuntu

My **preferred distribution**. I highly recommend removing snap [\[how?\]](#/operating-systems/removing-snap-from-ubuntu "Snap Removal") - other than that, the defaults are pretty sensible.

A small selection of recommended software:

| Tool | Description | Install |
|------|-------------|---------|
| 🔃 EnvyControl | A GPU switcher for Optimus laptops | `wget https://github.com/bayasdev/envycontrol/releases/download/v3.5.1/python3-envycontrol_3.5.1-1_all.deb`<br>`sudo apt update`<br>`sudo apt install ./python3-envycontrol_3.5.1-1_all.deb` |
| 💻 VSCodium | Code editor | `wget https://github.com/VSCodium/vscodium/releases/download/1.116.02821/codium_1.116.02821_amd64.deb`<br>`sudo apt update`<br>`sudo apt install ./codium_1.116.02821_amd64.deb` |
| ⚪ fastfetch | System Info | `sudo apt update`<br>`sudo apt install fastfetch` |


> 📝 Most Linux distributions provide you with an easy option to encrypt your drive during install (including Ubuntu). I highly recommend exercising this option.

---

### 🍎 MacOS

*What I said earlier*. There is a reason developers love their Macs. This is mostly dependent on acquiring **Apple hardware**. That is, unless you're looking to make a *Hackintosh*. It comes with many *headaches*, often unsatisfactory outcomes, and is likely to die out in the near future. If you're a masochist it can be fun.

You **should** probably start here: [Opencore \[Dortania Guide\]](https://dortania.github.io/OpenCore-Install-Guide "Opencore")

It might pay off to look around, and see if someone with the same *(or very similar)* hardware published their **working EFI**.

**Some MacOS tips:**

 - running the privacy.sexy scripts [\[download\]](https://github.com/undergroundwires/privacy.sexy/releases/download/0.13.8/privacy.sexy-0.13.8.dmg "privacy.sexy Github")
 - installing the LuLu firewall [\[download\]](https://objective-see.org/products/lulu.html "Objective See")
 - learning to use the `Command+Q` shortcut
 - installing the brew package manager `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`

**Some software essentials:**

| Software                                                                                 | Type |
|------------------------------------------------------------------------------------------|------|
| [Oculante](https://github.com/woelper/oculante "Oculante") (image viewer)                | FOSS |
| [IINA](https://github.com/iina/iina "IINA")  (media player)                              | FOSS |
| [Xpipe](https://github.com/xpipe-io/xpipe "Xpipe")  (SSH manager)                        | FOSS |
| [KeepassXC](https://github.com/keepassxreboot/keepassxc "KeepassXC")  (password manager) | FOSS |

As far as I know, MacOS does **not** easily allow you to change file associations.

*The best way (that I could think of) to quickly do this is to download a bunch of "sample" files [\[search\]](https://duckduckgo.com/?q=sample+files&ia=weball "DDG search") for all the file types you expect to use, click "Get Info" on each, select the "Open With:" program, and "Change All".*

#### For older Macs:

Your older Mac **likely** unofficially supports a much **newer** version of MacOS than Apple said [\[read\]](https://dortania.github.io/OpenCore-Legacy-Patcher/MODELS.html "OCLP docs").

**Opencore Legacy Patcher** - the project's main goal is to breathe new life into Macs no longer supported by Apple, allowing for the installation and usage of macOS Big Sur and newer on machines as old as 2007.

**OCLP** Link: [GitHub](https://github.com/dortania/OpenCore-Legacy-Patcher "OCLP")

(I believe this allows for a **great entry-point** into the world of Macs, allowing you to get a *decent starter experience for sub-$200*)

---

### 💪 BSD

As cool as BSD is, it's **not** for me, and it's likely **not** for you. That being said, your main picks are:

#### 😈 FreeBSD

If you're dead set on BSD, but *actually want to use your computer*, pick this.

**FreeBSD** Download link: [Click \[official link\]](https://www.freebsd.org/where "FreeBSD")

Installation docs: [Click \[official link\]](https://docs.freebsd.org/en/books/handbook/bsdinstall/index.html#bsdinstall "FreeBSD")

#### 🐡 OpenBSD

Possibly the most ***"based"*** of operating systems. More security-focused compared to FreeBSD. *Mostly* used in servers.

**OpenBSD** Download link: [Click \[official link\]](https://www.openbsd.org/faq/faq4.html#Download "OpenBSD")

---

### 🤖 Android

Android for PCs.

#### 🪷 BlissOS

This project is currently **on hold**.

**BlissOS** Website: [Click \[official link\]](https://blissos.org/ "BlissOS")

## Server

### Type-1 Hypervisors

#### 🔶 Proxmox VE

Proxmox is a *free*, full-featured **hypervisor**. Perfect for home-enthusiasts and workplaces alike.

**PVE** Download link: [Click \[official link\]](https://www.proxmox.com/en/downloads "PVE")

---

### Linux

#### ⭕ Debian

A server classic.

**Debian** Download link: [Click \[official link\]](https://www.debian.org/distrib "Debian")

#### 🟠 Ubuntu Server

A server classic.

**Ubuntu Server** Download link: [Click \[official link\]](https://ubuntu.com/download/server "Ubuntu Server")

---

### BSD

#### 🐡 OpenBSD

Less common, potentially very secure.

**OpenBSD** Download link: [Click \[official link\]](https://www.openbsd.org/faq/faq4.html#Download "OpenBSD")

## Mobile

### 🌠 GrapheneOS

The only mobile operating system worth mentioning. Android-based, privacy-focused. You need to own a compatible device [\[list\]](https://grapheneos.org/faq#device-support "Graphene").

**GrapheneOS** Install guide: [Click \[official link\]](https://grapheneos.org/install "Graphene")

---

## Flashing software

### 🔪 Ventoy

The ***swiss-army knife***. Turns your USB stick into a bootable ISO repository. Preserves "portable storage" function.

**Ventoy** link: [Github](https://github.com/ventoy/Ventoy "Ventoy Github")

### Etcher

Cross-platform. Really powerful, but won't flash Windows.

**Etcher** Website: [Click \[official link\]](https://etcher.balena.io "Balena")

### Rufus

Windows only. Will flash Windows - with tweaks too.

**Rufus** Website: [Click \[official link\]](https://rufus.ie/en "Rufus")
# Removing Snap from Ubuntu
> This guide was tested on Ubuntu 26.04 LTS, but I don't see any reason why this shouldn't work on anything 22.04+

I personally don't like the way Ubuntu *forcefully* integrates Snap by default, and even had it cause some weird issues in the past.

If you're of the same opinion, you can find a documentation of the process below.

> ⚠️ Be mindful not to lose any important data.

**I recommend doing this as one of the first steps after a fresh install.**

## Option 1: Using a convenience script

As a rule of thumb, I wouldn't recommend running a random script off the internet, especially not with *escalated privileges*... but I get it, some of us are just *plain lazy* :)

Feel free to give the [source code](https://github.com/suckharder/remove-snap-from-ubuntu "Github Source") a read. Full disclosure - the script was co-authored by GenAI, based on my simple prototype.

The script also gives you the option to install Firefox DEB from Mozilla's APT sources [\[read about Firefox\]](https://www.firefox.com "Firefox Browser"), and the Phoenix Firefox config [\[read about Phoenix\]](https://codeberg.org/celenity/Phoenix "celenity/Phoenix"). 

```bash
# Only remove Snap
git clone https://github.com/suckharder/remove-snap-from-ubuntu
cd remove-snap-from-ubuntu
chmod +x remove_snap.sh
sudo ./remove_snap.sh

# If you wish to automatically install the DEB version of Firefox from Mozilla after de-snapping, run this instead:
sudo ./remove_snap.sh --install-firefox

# If you wish to also install the Phoenix Firefox config, run this:
sudo ./remove_snap.sh --install-firefox --install-phoenix

```

## Option 2: Manually remove Snap


### Step 1: List installed snaps

```bash
snap list
```
This will list all your installed snaps.

Example output:

```
Name                       Version                         Rev    Tracking         Publisher   Notes
bare                       1.0                             5      latest/stable    canonical✓  base
core24                     20260317                        1587   latest/stable    canonical✓  base
desktop-security-center    0+git.80cd2b4                   150    1/stable/…       canonical✓  -
firefox                    149.0.2-1                       8107   latest/stable/…  mozilla✓    -
firmware-updater           0+git.5645b80                   226    1/stable/…       canonical✓  -
gnome-46-2404              0+git.f1cd5fa-sdk0+git.ca9c59c  153    latest/stable/…  canonical✓  -
gtk-common-themes          0.1-81-g442e511                 1535   latest/stable/…  canonical✓  -
mesa-2404                  25.0.7-snap211                  1165   latest/stable/…  canonical✓  -
prompting-client           0+git.2e14a72                   204    1/stable/…       canonical✓  -
snap-store                 0+git.10310e85                  1367   2/stable/…       canonical✓  -
snapd                      2.75.2                          26865  latest/stable    canonical✓  snapd
snapd-desktop-integration  0.9                             361    latest/stable/…  canonical✓  -
 
```

### Step 2: Remove all installed snaps

Some might be dependent on others. You might have to try different orders.

```bash
sudo snap remove --purge snap-store
sudo snap remove --purge firefox
...
sudo snap remove --purge snapd
```

You may also use this one-liner, but again, due to dependencies, you may have to re-run it 2-3 times.

```bash
snap list | awk 'NR>1 {print $1}' | xargs -r -n1 sudo snap remove --purge
```

### Step 3: Disable the snap service

```bash
sudo systemctl stop snapd
sudo systemctl disable snapd
sudo systemctl mask snapd
```

Something might report as still active. This should be safe to ignore.

### Step 4: Purge the snap APT package

```bash
sudo apt purge snapd -y
```

This will also remove the Firefox APT package, and potentially others, depending on your system.

### Step 5: Clean up any potential remaining Snap files and folders

Potentially any of the following.

```bash
rm -rf ~/snap
sudo rm -rf /snap
sudo rm -rf /var/snap
sudo rm -rf /var/lib/snapd
sudo rm -rf /var/cache/snapd
```

### Step 6: Pin Snap with a negative priority using APT preferences

Make a new `/etc/apt/preferences.d/nosnap.pref` file.

```bash
sudo nano /etc/apt/preferences.d/nosnap.pref
```

And paste the following text inside.

```
Package: snapd
Pin: release a=*
Pin-Priority: -10
```

Write out (save) with `CTRL+O` and quit with `CTRL+X`.

### Step 7: Clean up orphaned packages

**Warning:** This is a system-wide autoremove, not just snap specific orphans.

```bash
sudo apt autoremove --purge -y
```

### Step 8: Hold Snap

This is mainly for redundancy, should the priorities somehow fail.

```bash
sudo apt-mark hold snapd
```

## Optional: Install Firefox DEB from Mozilla

Follow the official documentation: [\[Click\]](https://support.mozilla.org/en-US/kb/install-firefox-linux#w_install-firefox-deb-package-for-debian-based-distributions "Firefox").

## Optional: Install Phoenix for Firefox

Follow the official documentation: [\[Click\]](https://codeberg.org/celenity/Phoenix/src/branch/dev/docs/Install.md "Phoenix").
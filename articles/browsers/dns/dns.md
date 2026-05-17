# DNS
> Not necessarily a browser-only topic, but it fits the category well.

You may choose to use a non-default **DNS provider**. This can be done to potentially **unblock or block** some websites, slightly improve **privacy**, improve **speed**, or a combination of these factors.

If possible, my advice is to use a **DoT** (DNS over TLS) or a **DoH** (DNS over HTTPS) compatible resolver, both of these protocols **encrypt** your query.

This resource only covers ***ready to use, free public resolvers***. *Paid and self-hosted* options not discussed. *Sinkholes* not discussed.

## DNS Resolvers list

Below you'll find a list of some decent DNS resolvers.

### Mullvad DNS

Free. Privacy-focused. DoT and DoH only. **No logs**. From the creators of Mullvad VPN.

*Optional blocking of Ads, Trackers, Malware, Adult, Gambling, Social media.*

Base **DoT**:
```
dns.mullvad.net
```

Base **DoH**:
```
https://dns.mullvad.net/dns-query
```

**Mullvad DNS** Docs: [\[click\]](https://mullvad.net/en/help/dns-over-https-and-dns-over-tls "Mullvad DNS")

---

### ControlD

Free, but also offers optional paid tiers. **No logs** (free tier). DoT, DoH and unencrypted available.

*Optional resolvers for Malware Protection, Ads & Tracking, Social, Family Friendly, Advanced (anti-censorship).*

Base Legacy (unencrypted):
```
76.76.2.0
76.76.10.0
```

Base **DoT**:
```
p0.freedns.controld.com
```

Base **DoH**:
```
https://freedns.controld.com/p0
```

**ControlD DNS** Docs: [\[click\]](https://controld.com/free-dns "ControlD")

---

### Cloudflare

Free. The fastest DNS resolver you'll find. Good compatibility with torrent trackers. Some logging - mostly privacy respecting. DoT, DoH and unencrypted available.

*Optional blocking of Malware, Adult Content.*

Base Legacy (unencrypted):
```
1.1.1.1
1.0.0.1
```

Base **DoT**:
```
one.one.one.one
```

Base **DoH**:
```
https://cloudflare-dns.com/dns-query
```

**Cloudflare DNS** Docs: [\[click\]](https://developers.cloudflare.com/1.1.1.1/ "Cloudflare")

---

### Quad9

Free. Supposedly privacy-oriented. Some logging. DoT, DoH and unencrypted available.

*Optional blocking of Malware.*

Base Legacy (unencrypted):
```
9.9.9.9
149.112.112.112
```

Base **DoT**:
```
dns.quad9.net
```

Base **DoH**:
```
https://dns.quad9.net/dns-query
```

**Quad9 DNS** Docs: [\[click\]](https://quad9.net/ "Quad9")

# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML/CSS/JS, no framework or build step (Leon's choice, 2026-10-23). The mockup is a website today; the real launcher will run on a Raspberry Pi 3.

## Users

People sitting at a TV with a remote. Leon is designing the interface; the mockup is how he and others try the interaction on a computer.

## Product Purpose

A smart TV home interface that behaves like Samsung's Tizen 3 Smart Hub bar, made simpler so it runs well on a Raspberry Pi 3. This first stage is a UI design only: an interactive demo, not a working launcher.

## Operating Context

- Viewed from a sofa, driven by a remote's Home, Left and Right buttons. In the demo: Space is Home, the arrow keys move.
- Everything sits inside a fixed 16:9 frame (the TV screen).
- Target hardware is a Raspberry Pi 3, so motion and effects must stay cheap: transform and opacity, no blur.

## Capabilities and Constraints

- Home bar along the bottom of the screen with, in this starting order: Smart Hub, USB (shows what's on a USB stick), HDMI 1, Component Video, YouTube, BBC iPlayer, Netflix, Prime Video, Web Browser.
- The viewer can pick up any tile and move it to a new place on the bar (Enter, then Left/Right, then Enter).
- Tizen 3's upper "second depth" row (Shazam, Recent, Featured) is left out on purpose.
- Light and dark mode. Light follows Tizen 3's own light bar; dark is new.
- The only images are the TV service logos. No photos or "live TV" stand-ins.

## Brand Commitments

- Reference: Samsung Tizen 3 (2017) Smart Hub home bar, from Leon's screenshot.
- Service logos are the services' own marks.

## Product Principles

- Simpler than Tizen, never busier.
- The remote's three buttons must be enough.
- Cheap enough for a Pi 3 to animate smoothly.

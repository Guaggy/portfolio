---
title: OLED Keychain on an ATtiny85
date: 2026-09-29
summary: A coin-cell keychain with a 128×64 OLED, custom firmware, and a QR code generated at build time.
tags:
  - Embedded
  - CAD
status: published
cover: ./cover.jpg
coverAlt: Placeholder cover for the OLED Keychain project
links:
  - label: Source code (GitHub)
    url: https://github.com/Guaggy/attiny85-keychain
---

A small keychain that runs on a CR2032 coin cell and shows its own stats on an OLED.

## Hardware

- ATtiny85 running at 8 MHz from its internal oscillator
- 0.96" SSD1306 OLED, 128×64, set to I2C
- Power-on reset handled in firmware: the screen is only addressed after a 3 s wait
- Stats are kept in EEPROM, so they survive reflashing

## Firmware

- Written in C++ with PlatformIO
- A QR code is generated at build time by a small Python script
- Custom 5×8 font

## Results

Built and working on a breadboard. [Placeholder: photos of the finished keychain.]

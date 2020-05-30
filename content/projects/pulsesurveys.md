+++
author = "Birju Vachhani"
categories = ["Android"]
cover = "/assets/images/projects/pulsesurveys/pulse-surveys-banner.png"
date = 2018-06-02T16:56:48Z
draft = true
tags = ["android"]
title = "Pulse Surveys"

+++
## Info

* **Platform**:     `Android`
* **Language**:     `Kotlin`
* **Playstore**:    `// TODO`

## About

Pulse is a smart and easy digital surveying system for restaurants and cafes based on beacons. It uses proximity marketing features to provide contact less surveys at the right time. 

The whole system is based on beacons. Beacons are placed inside shops so whenever a customer leaves the shop it triggers the surveying system and the system sends notifications to the customer asking for feedback or fill a survey.

The app is developed in React-native and it uses native libraries to get around BLE stuff. I have worked on the native android side to develop a react-native compatible plugin to detect and identify beacons.

## My Roll

* Develop native android library that can detect and identify specific beacons and track beacon events like entry, exit and camping.
* Implement React-native to Android and Android to React-native bridge to communicate detection and identification results, and emit beacon events.
* Implementation of services to allow beacon scanning even while in background.
* Scheduling background tasks for effective scanning and to make sure the service is running all the time.
* Battery optimizations to improve battery performance while scanning in background.
* Wiring around doze mode for effective scanning results and less battery consumption.

## Screenshots

// TODO
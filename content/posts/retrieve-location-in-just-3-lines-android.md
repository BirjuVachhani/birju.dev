+++
author = "Birju Vachhani"
categories = ["Android"]
cover = "assets/images/location-banner.png"
date = 2019-11-22T13:49:10Z
draft = true
tags = ["android", "location", "locus", "library"]
title = "Retrieve Location with Just 3 Lines of Code - Android "

+++
When it comes to retrieve location in android devices, we see it as a tedious task as it requires lots of boilerplate code. We need to handle android's permission model for location permission and also we need to keep an eye for device's location settings also.

## The Hassle

Let's face it, it annoying to handle location permissions to access device location as it adds a lot of boilerplate code and it also need to be handled properly otherwise you'll end up in a dirty state. Once you get location permissions which is in most cases `android.permission.ACCESS_COARSE_LOCATION` and `android.permission.ACCESS_FINE_LOCATION` but then you realise that you're also targeting _Android 10_. Now you need to handle `android.permission.ACCESS_BACKGROUND_LOCATION` if you want to get location in background also due to security changes in _Android 10_.

That's not enough, now if the GPS is turned off then you won't receive any updates. You'll have to resolve location settings and check if the gps is enabled or not and then you'll need to ask user to turn it on. In case if you want high accurate location, simply turning on GPS won't help. You'll have to request user to allow access for high accurate location which add a lot of boilerplate code.

Also, this permission model and location settings resolution gives results as activity results so you'll have to write this all boilerplate code in your `Activity` class. As Android 10 comes into picture, you'll have to handle foreground and background location permissions also. Ahh! Isn't it exhausting?

But what if I tell you that you can retrieve location in just 3 lines of code without any of this hassle? Wouldn't it be great not to write all those boilerplate code? Hell, it will be great!

## Locus

![](/assets/images/locus.png)

I have done this hassle many times and then I thought, what if I could get location in just few lines of coe without writing this much boilerplate? Then I developed `Locus` which simply let's you do that in just 3 lines of code!

### Features

Locus has features that you haven't even imagined yet.

* Built using Kotlin DSL
* Supports Android 10 Location permission changes
* Supports Location Resolution
* Easy configuration
* Highly customisable
* Lifecycle Aware

Locus is built using Kotlin DSL which makes it so beautiful to write and customise easily. Also, Locus uses `LiveData` internally to make it lifecycle aware so you don't have to worry about your Activity/Fragment lifecycle anymore.

Locus has built in support for Android 10 location permission changes and handles location for both foreground and background access. It also supports the famous location resolution process that helps you detect device's GPS settings and lets you ask user to make changes to GPS settings in order to satisfy your needs. Lets get started and add Locus to your Android project

## Installation

Add following lines to your project level `build.gradle` file:

```groovy
allprojects {
    repositories {
        ...
        maven { url 'https://jitpack.io' }
    }
}
```

Add this dependency to your app/build.gradle file:

```groovy
dependencies {
    implementation 'com.github.BirjuVachhani:locus-android:$latest_version'
}
```

At the time of writing this blog, the latest version is `3.0.1`. You can get the latest version from [here](https://github.com/birjuvachhani/locus-android). You look at the [wiki](https://github.com/BirjuVachhani/locus-android/wiki) of the project for latest changes.

## Retrieving continuous Location

In your activity/fragment, just add following lines of code and you'll be able to get location updates.

```kotlin
// starts continuos location updates
Locus.startLocationUpdates(this) { result ->
    result.location?.let { /* Received location update */ }
    result.error?.let { /* Received error! */ }
}
```

### What is handled for you by default!

* Android Permission model with default relational texts
* Location Settings resolution for high accurate location updates
* Lifecyle aware out of the box

Awesome, right? Those magical 3 lines and you're life is made easy!

## Get Single Location Update

Only want current location for single time? That's easy too! Just the method name changes, rest stays the same.

```kotlin
Locus.getCurrentLocation(this) { result ->
    result.location?.let { /* Received location update */ }
    result.error?.let { /* Received error! */ }
}
```

## Configure Locus

Locus is highly customisable and lets you customise the default options in very easy way.

> Note that `Locus` is a singleton object which lets you configure locus and retrieve location. The reason behind it is that by default, if you request two location updates for different intervals, you will receive location updates for both in the shorter interval! This applies to other apps also, that said, if there's another app that requests location for shorter interval than yours at the same time, you'll receive location those updates instead of your configured time.

### Location Settings Resolution

{{< figure src="/assets/images/android-location-settings-dialog.png" alt="Location Settings Dialog" caption="Location Settings Dialog" >}}
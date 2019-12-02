+++
author = "Birju Vachhani"
categories = ["Android"]
cover = "assets/images/location-banner.png"
date = 2019-11-22T13:49:10Z
draft = true
tags = ["android", "location", "locus", "library"]
title = "Retrieve Location with Just 3 Lines of Code - Android "

+++
When it comes to retrieve location in android devices, we see it as a tedious task as it requires a lot of boilerplate code. We need to handle android's permission model for location permission and also we need to keep an eye for device's location settings also.

## The Hassle

Let's face it, For privacy and security purposes, these kind of restrictions are much needed but as per the developer's point of view, it is very annoying to handle location permissions to access device location as it adds a lot of boilerplate code and it also needs to be handled properly otherwise you're more likely to end up in a dirty state. Once you get location permissions which is in most cases `android.permission.ACCESS_COARSE_LOCATION` and `android.permission.ACCESS_FINE_LOCATION` but then you realise that you're also targeting _Android 10_. Now you need to handle `android.permission.ACCESS_BACKGROUND_LOCATION` if you want to get location in background also due to security changes in _Android 10_.

That's not enough, now if the GPS is turned off then you won't receive any updates. You'll have to resolve location settings and check if the gps is enabled or not and then you'll need to ask user to turn it on. In case if you want high accurate location, simply turning on GPS won't help. You'll have to request user to allow access for high accurate location which add a lot of boilerplate code.

Also, this permission model and location settings resolution gives results as activity results so you'll have to write this all boilerplate code in your `Activity` class. As Android 10 comes into picture, you'll have to handle foreground and background location permissions also. Ahh! Isn't it exhausting?

But what if I tell you that you can retrieve location in just 3 lines of code without any of this hassle? Wouldn't it be great not to write all those boilerplate code? Hell, it will be great!

## Locus

![](/assets/images/locus.png)

I have done this hassle many times and then I thought, what if I could get location in just few lines of coe without writing this much boilerplate? Then I developed `Locus` which simply let's you do that in just 3 lines of code! You can find the project on [Github](https://github.com/birjuvachhani/locus-android).

## Features

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

## Retrieving Continuous Location

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

## Stopping Location Updates

Stopping location updates is quite easy and clean:

```kotlin
Locus.stopLocationUpdates()
```

## Configure Locus

Locus is highly customisable and lets you customise the default options in very easy way.

> Note that `Locus` is a singleton object which lets you configure locus and retrieve location. The reason behind it is that by default, if you request two location updates for different intervals, you will receive location updates for both in the shorter interval! This applies to other apps also, that said, if there's another app that requests location for shorter interval than yours at the same time, you'll receive location those updates instead of your configured time.

### Location Settings Resolution

{{< figure src="/assets/images/android-location-settings-dialog.png" alt="Location Settings Dialog" caption="Location Settings Dialog" >}}

Ever seen this dialog when using Google Maps App? It indicates that the your current location settings are creating conflict with the location settings that the app requires. In other words, the required settings by the app is not satisfied by the device settings. Example: Your app requires high accuracy location whereas the device location settings are set to low accuracy or battery saver mode. This won't allow your app to retrieve location updates that are highly accurate.

In order to satisfy the required settings, you need to first resolve the current device settings and see if it satisfies the need. If not, then you can request the user to change the device settings so fulfil your purpose. So, when you request for a change in the settings, this dialog will be displayed to the user by the Android system. If you go though [this](https://developer.android.com/training/location/change-location-settings), then you'll come to know that it requires quite a lot code to achieve it.

But no worries, guess what! all this boilerplate is already done for you. Locus handles location setting resolution by default and displays a dialog to the user saying that the device's location settings needs to be changed.

It also works if location is disabled. It will ask user to enable it. Following dialog will be showed in these cases:

{{< figure src="/assets/images/location-disable-dialog.png" alt="Location Disabled Dialog" caption="Location Disabled Dialog" >}}

This dialog is also configurable. If you want to change the dialog texts, you can use `Locus.configure{}` block.

```kotlin
Locus.configure { 
    resolutionTitle = "new title"
    resolutionText = "new description"
}
```

However, if you don't want to use this location settings resolution feature then you can turn it off:

```kotlin
Locus.configure { 
    shouldResolveRequest = false
}
```

### Configure Rationale Dialog Texts

Locus also shows rationale dialogs when permissions are denied one or more times.

{{< figure src="/assets/images/location-rationale.png" alt="Location Rationale Dialog" caption="Location Rationale Dialog" >}}

Changing these rationale texts is also easy. You can use `Locus.configure{}` block to configure almost everything in Locus.

```kotlin
Locus.configure {
    rationaleText = "new text"
    rationaleTitle = "new title"
}
```

### Configure Permission Blocked Dialog Text

When a permission is denied by the user and user selects `Do not ask again` option, Locus shows permission blocked dialog which lets user navigate to settings screen to enable location permission.

{{< figure src="/assets/images/location-blocked-dialog.png" alt="Location Permission Blocked Dialog" caption="Location Permission Blocked Dialog" >}}

To configure this permission blocked dialog texts:

```kotlin
Locus.configure {
    blockedText = "new text"
    blockedTitle = "new title"
}
```

### Configure Location Request

Locus by default uses following request settings for requesting location updates:

```kotlin
priority = LocationRequest.PRIORITY_HIGH_ACCURACY
interval = 1000L
fastestInterval = 1000L
maxWaitTime = 1000L
```

If you want to use different location request settings then you can configure it easily like this:

```kotlin
Locus.configure {
    request {
        priority = LocationRequest.PRIORITY_BALANCED_POWER_ACCURACY
        interval = 2500L
        fastestInterval = 2500L
        maxWaitTime = 5000L
    }
}
```

The `request{}` block lets you access the `LocationRequest` instance so you can fully configure is according to your needs. However if you want to reset Locus to its default location request configuration, just call `Locus.setDefaultConfig()`.

### Background Location Updates

Locus requests location updates in such a way that it works by default in background also, but Until Android 10. Android 10 has some major privacy changes for location permissions. Starting from Android 10, Location updates won't be available by default when your app is in background. You can read more about Android 10 Location permission changes here. I won't be going in deep about those changes and how to handle them.

If you have checked the above link, then now you know that you have one extra location permission that needs to be handled for getting background location updates which is `android.permission.ACCESS_BACKGROUND_LOCATION`. Again, this can a tedious task to write all those code to handle background updates for Android 10.

Luckily Locus supports that out of the box! Yes, you read that right! Background location updates are off by default, which means that Locus won't ask for `android.permission.ACCESS_BACKGROUND_LOCATION` when running on Android 10. So, if you want to get location updates in background also, you can do it very easily:

```kotlin
Locus.configure {
    enableBackgroundUpdates = true
}
```

Note that enabling this will ask user to grant permission for background location also but it's user's choice not to do so. So, if the user denies it then Locus won't force user to provide it and will run in foreground mode which means you'll still get update while the app is in foreground as it is suitable for most of the usecases.

But if your app doesn't function if you can't get location updates in background also, then you might need to force user to grant permission for background location updates. If your app tracks user to display position on map or something like that which requires continuous location updates in background also and it won't be usable in you don't have background location permission. Then, you can force user to grant background location permission.

```kotlin
Locus.configure {
    forceBackgroundUpdates = true
}
```

This will force user to grant background location permission by showing the rationale dialog that this permission is necessary for this app to run and the user should grant it.

### Locus Logging

If you face any issues using Locus and want to see the debug logs, then you can enable logs like this:

```kotlin
Locus.setLogging(true)
```

## Conclusion

Locus makes a developer's life very easy when it comes to retrieve location. It is highly customisable and will fulfil most of the requirements that a developer needs. However if you can't find what you're looking for then you always can request a feature of file a bug on [Github](https://github.com/birjuvachhani/locus-android).

If you liked what you read, don't forget to start [this](https://github.com/birjuvachhani/locus-android) repository. Happy coding!
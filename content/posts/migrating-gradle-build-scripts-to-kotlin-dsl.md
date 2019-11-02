---
title: "Migrating Gradle Build Scripts to Kotlin DSL"
date: 2018-12-10T15:55:51+05:30
draft: true
toc: false
images:
tags: 
  - untagged
---

Howdy people! It's bean a while since [Gradle](https://gradle.org/) released support for [Kotlin](https://kotlinlang.org/) scripts.
We have been writing [Gradle](https://gradle.org/) script in a language called **[Groovy](http://groovy-lang.org/)** since ages. Let's be honest, We all know that [Groovy](http://groovy-lang.org/) sucks! Half of the times I have been like this when there's an issue:

![GIF]({{ site.baseurl }}/assets/img/2018-12-09-migrating-gradle-build-scripts-to-kotlin-dsl/1.webp)

<br/>
### Why does Groovy suck?

* No Auto Completion🙄
* No Content Assist😞
* No Navigation to Source😕
* Don't know what to write and how to write😪
* I don't like it😠

<br/>
### Kotlin Script to The Rescue

[Gradle](https://gradle.org/) released support for [Kotlin](https://kotlinlang.org/) scripts and **[Kotlin DSL](https://docs.gradle.org/current/userguide/kotlin_dsl.html)**(In short, DSL makes code more readable, it's built in [Kotlin](https://kotlinlang.org/) feature). Finally, I don't have to learn that lame Groovy for [Gradle](https://gradle.org/) scripts. Now I can write my build scripts in my favorite language [Kotlin](https://kotlinlang.org/). When it released, I was like:

![GIF]({{ site.baseurl }}/assets/img/2018-12-09-migrating-gradle-build-scripts-to-kotlin-dsl/2.webp)

I never learned [Groovy](http://groovy-lang.org/) but now, all I have to do is to be yourself and write [Kotlin](https://kotlinlang.org/) scripts like a PRO. How cool is that! A single language to manage your whole project. [Kotlin](https://kotlinlang.org/) script overcomes almost all the cons of [Groovy](http://groovy-lang.org/).

### Why Kotlin scripts are awesome:

* Auto Completion😎
* Content Assist😍
* Navigation to Source😱
* Kotlin Extensions support😘
* Errors at compile time instead of runtime💪
* I love it❤️

Writing build scripts in [Kotlin](https://kotlinlang.org/) is like riding a bike🏍 (Except the bike is on fire🔥).

> Sometimes it can be a bit messy to rewrite **gradle.build** into **gradle.build.kts** files, especially when all its cache is malfunctioning during that process. Few times I had to **reopen** my project so that **Android Studio** can understood properly what is going on. **“Refresh all Gradle projects”** button has been life saver for me.😉

But don't worry, Just follow the steps with me and it will be fine.

<br/>

### Migrate to Gradle Kotlin Script

A nice thing about [Kotlin](https://kotlinlang.org/) build script is you don't have to do extra setup for enabling it. Just rename **.gradle file** to **.gradle.kts** file extension and [Gradle](https://gradle.org/) will consider it as a [Kotlin](https://kotlinlang.org/) script. Please note that following the steps below in sequence is highly important to avoid intermediate [Gradle](https://gradle.org/) issues.

#### Gradle support

To make sure that everything works fine, update your **gradle** to version **4.10**. To do so, go to your project's **gradle-wrapper.properties** and check **distributionUrl** for the current version. make sure it looks like below:

```gradle
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
distributionUrl=https\://services.gradle.org/distributions/gradle-5.2.1-all.zip
```

<br/>
### Step-1 Convert Settings.gradle File

Let's start with **settings.gradle** file by renaming **(Shift + F6)** it to **settings.gradle.kts**. Now that this file is a [Kotlin](https://kotlinlang.org/) script, **include** will behave as a function and **":app"** will be the string argument.

##### Before

```groovy
include ':app'
```

##### After

```kotlin
include(":app")
```

<br/>
> ✏️Note that in Groovy, you were able to write **single quotes('')** in place of **double quotes("")** but in [Kotlin](https://kotlinlang.org/), you must have to use **double quotes** only.

<br/>
Now that you have converted it in [Kotlin](https://kotlinlang.org/), [Gradle](https://gradle.org/) will identify it accordingly and will process it as [Kotlin](https://kotlinlang.org/) script. Just sync with [Gradle](https://gradle.org/) files.

<br/>
### Step-2 Convert Project's build.gradle File

Rename project level **build.gradle** to **build.gradle.kts**. The main difference here is in **classpath** and in **clean task**.

**Classpath** is now a function in [Kotlin](https://kotlinlang.org/) which takes a string argument as shown below:

##### Before

```groovy
dependencies {
    classpath 'com.android.tools.build:gradle:3.3.1'
    classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:1.3.21"
}
```

##### After

```kotlin
dependencies {
    classpath("com.android.tools.build:gradle:3.3.1")
    classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:1.3.21")
}
```

<br/>
**Clean task** will no longer be written in Groovy. This is how it looks in [Kotlin](https://kotlinlang.org/):

##### Before

```groovy
task clean(type: Delete) {
    delete rootProject.buildDir
}
```

##### After

```kotlin
tasks.register("clean",Delete::class){
    delete(rootProject.buildDir)
}
```

<br/>
Another thing that can change is that if you have any repositories with **url** in **repositories** block. You can change it like this:

##### Before

```groovy
repositories {
    google()
    jcenter()
    maven{ url 'https://jitpack.io' }
}
```

##### After

```kotlin
repositories {
    google()
    jcenter()
    maven { url = uri("https://jitpack.io") }
}
```

<br/>
That's it! The file is now completely in [Kotlin](https://kotlinlang.org/). If you have some other configurations then you can easily convert it into [Kotlin](https://kotlinlang.org/) with the help of **Auto Completion**. If you don't know how to implement something, you can always navigate to the source code. That's the beauty of it.

Here is the whole **build.gradle.kts** file:

```kotlin
buildscript {
    repositories {
        maven { url = uri("https://jitpack.io") }
        google()
        jcenter()
    }
    dependencies {
        classpath("com.android.tools.build:gradle:3.3.1")
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:1.3.21")
    }
}
allprojects {
    repositories {
        google()
        jcenter()
        maven { url = uri("https://jitpack.io") }
    }
}
tasks.register("clean",Delete::class){
    delete(rootProject.buildDir)
}
```

You'll be able to sync your project after completing this step.

<br/>
### Step-3 Convert App Level build.gradle File

Here comes a little bit messy part😵. Open app level **build.gradle** file and rename it to **build.gradle.kts**. Don't try to sync now. It will show lots of errors but don't worry, we're going to remove all the errors one by one. Let's start from the top.

In Groovy, every plugin was being applied **individually** where as **Kotlin** provides **plugins{}** block to apply all the plugins. 

##### Before

```groovy
apply plugin: 'com.android.application'
apply plugin: 'kotlin-android'
apply plugin: 'kotlin-android-extensions'
```

##### After

```kotlin
plugins {
    id("com.android.application")
    kotlin("android")
    kotlin("android.extensions")
}
```

Here, **id()** and **kotlin()** are functions which are used to apply plugins.

**id()** is used to apply any plugin. All the plugins can be applied using id().

Plugins which are specific to **Kotlin** can also be applied using **kotlin()** function. That's cool😎

<br/>
> Note that when you use kotlin() function, the **kotlin** prefix will be removed from plugin name and the **dash(-)** will be replaced by **dot(.)**. For the sake of simplicity, you can use id() function instead.

<br/>
#### The "android{}" Block

Note these points to convert this block in [Kotlin](https://kotlinlang.org/):

* **compileSdkVersion** is a **function**.
* **applicationId** is a **property**.
* **minSdkVersion** and **targetSdkVersion** are **functions** too.
* **versionCode** and **versionName** are properties again.

According to above points this block will look like this:

#### Before

```groovy
android {
    compileSdkVersion 28
    defaultConfig {
        applicationId "com.birjuvachhani.gradlekotlindsldemo"
        minSdkVersion 19
        targetSdkVersion 28
        versionCode 1
        versionName "1.0"
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }
    ...
    ...
}
```

#### After

```kotlin
android {
    compileSdkVersion(28)
    defaultConfig {
        applicationId = "com.birjuvachhani.gradlekotlindsldemo"
        minSdkVersion(19)
        targetSdkVersion(28)
        versionCode = 1
        versionName = "1.0"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }
    ...
    ...
}
```

<br/>
**buildTypes{}** block is a bit tricky. A function **getByName(String)** is used to get a build type.

**minifyEnabled** is a property with name **isMinifyEnabled**.

**proguardFiles** and **getDefaultProguardFile** are functions. 

This is how it will look like:

#### Before

```groovy
android {
    ...
    ...
    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

#### After

```kotlin
android {
    ...
    ...
    buildTypes {
        getByName("release") {
            isMinifyEnabled = false
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }
}
```

<br/>
#### The **dependencies{}** Block

There should be only one block left (if you don't have any extra configs hopefully😬) that is the **dependencies{}** block.

Here, **implementation**, **kapt**, **api**, **testImplementation**, **androidTestImplementation** etc are functions.

The **fileTree** in **implementation()** is also a **function** which takes a map as an argument. Here's how it will look like:

#### Before

```groovy
dependencies {
    implementation fileTree(dir: 'libs', include: ['*.jar'])
    implementation"org.jetbrains.kotlin:kotlin-stdlib-jdk7:1.3.21"
    implementation 'androidx.appcompat:appcompat:1.1.0-alpha02'
    implementation 'androidx.core:core-ktx:1.1.0-alpha04'
    implementation 'androidx.constraintlayout:constraintlayout:1.1.3'
    
    testImplementation 'junit:junit:4.12'
    androidTestImplementation 'androidx.test:runner:1.1.2-alpha01'
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.1.2-alpha01'
}
```

#### After

```kotlin
dependencies {
    implementation(fileTree(mapOf("dir" to "libs", "include" to listOf("*.jar"))))
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk7:1.3.21")
    implementation("androidx.appcompat:appcompat:1.1.0-alpha02")
    implementation("androidx.core:core-ktx:1.1.0-alpha04")
    implementation("androidx.constraintlayout:constraintlayout:1.1.3")
    testImplementation("junit:junit:4.12")
    androidTestImplementation("androidx.test:runner:1.1.2-alpha01")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.1.2-alpha01")
}
```

<br/>
Here is the whole app level **build.gradle.kts** file:

```kotlin
plugins {
    id("com.android.application")
    kotlin("android")
    kotlin("android.extensions")
}
android {
    compileSdkVersion(28)
    defaultConfig {
        applicationId = "com.birjuvachhani.gradlekotlindsldemo"
        minSdkVersion(19)
        targetSdkVersion(28)
        versionCode = 1
        versionName = "1.0"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }
    buildTypes {
        getByName("release") {
            isMinifyEnabled = false
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"),
             "proguard-rules.pro")
        }
    }
}
dependencies {
    implementation(fileTree(mapOf("dir" to "libs", "include" to listOf("*.jar"))))
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk7:1.3.21")
    implementation("androidx.appcompat:appcompat:1.1.0-alpha02")
    implementation("androidx.core:core-ktx:1.1.0-alpha04")
    implementation("androidx.constraintlayout:constraintlayout:1.1.3")
    testImplementation("junit:junit:4.12")
    androidTestImplementation("androidx.test:runner:1.1.2-alpha01")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.1.2-alpha01")
}
```

Hell Yeah! Sync the project (Hopefully it will compile, let's have some faith in [Gradle](https://gradle.org/)). There you go, your project is converted in [Kotlin](https://kotlinlang.org/) build scripts. Say goodbye to Groovy!

![CODE]({{ site.baseurl }}/assets/img/2018-12-09-migrating-gradle-build-scripts-to-kotlin-dsl/3.webp)

<br/>

If you're reading this then you'd be probably like this:

![CODE]({{ site.baseurl }}/assets/img/2018-12-09-migrating-gradle-build-scripts-to-kotlin-dsl/4.webp)

<br/>
or this:

![CODE]({{ site.baseurl }}/assets/img/2018-12-09-migrating-gradle-build-scripts-to-kotlin-dsl/5.webp)

<br/>
It depends on you.😄 
It's just a matter of time, **Gradle** will provide kotlin script support by default. That means this all will be directly generated for you. Till then,
Happy coding folks!
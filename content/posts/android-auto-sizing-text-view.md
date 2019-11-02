---
title: "Android Auto Sizing TextView"
date: 2018-05-30T15:55:51+05:30
draft: true
toc: false
images:
tags: 
  - untagged
---

![Banner]({{ site.baseurl }}/assets/img/2018-11-25-android-auto-sizing-text-view/banner.png)

Hi folks! I am sure that at least once, every one of you must have been to a situation where you need your **TextView** to change its size according to the content you put inside it. It looks more **dynamic** and creates a good user experience.

Android didn’t have the built in support for this. But then, **Android Oreo** released. 😃. The support for Auto sizing TextView is added in **Android O** as well as in **the support library version 26**. Although, It is introduced in Android O, This feature is **backward compatible** in **Android 4.0 and later**. Let’s see how to use this feature.

<br/>

### Dependencies

Make sure that you have added dependency for **support library version 26 or later** in your project’s **build.gradle** file.

```gradle
dependencies {
    implementation 'com.android.support:appcompat-v7:27.1.1'
    implementation 'com.android.support:support-v4:27.1.1'
}
```

Now, add a **TextView** normally as you have been always adding.

```xml
<TextView
    android:layout_width="300dp"
    android:layout_height="300dp"
    android:text="Hello World!"
    android:textSize="24sp"
    app:layout_constraintBottom_toBottomOf="parent"
    app:layout_constraintEnd_toEndOf="parent"
    app:layout_constraintStart_toStartOf="parent"
    app:layout_constraintTop_toTopOf="parent" />
```

To make the **content** auto sizing, add following property to the TextView:

```xml
app:autoSizeTextType="uniform"
```

It **enables** text **auto sizing** for the TextView. This scales the text uniformly on **horizontal** and **vertical** axis ignoring **android:textSize** property. Make sure you are using **app** namespace when using **the support library**.

> Don’t use **wrap_content** for layout **width** or **height.** It may produce **unexpected** results. Instead, use **match_parent** or **fixed size** for width and height.

You can turn auto sizing by setting **app:autoSizeTextType** to **none** instead of **uniform** as shown below.

```xml
app:autoSizeTextType="none"
```

<br/>

#### Enable or Disable Programmatically

To enable text auto sizing:

```java
//using support library
TextViewCompat.setAutoSizeTextTypeWithDefaults(textView,TextViewCompat.AUTO_SIZE_TEXT_TYPE_UNIFORM);

//for android O and later
textView.setAutoSizeTextTypeWithDefaults(TextView.AUTO_SIZE_TEXT_TYPE_UNIFORM);
```

To disable it, use **AUTO_SIZE_TEXT_TYPE_NONE** instead of **AUTO_SIZE_TEXT_TYPE_UNIFORM.**

![screenshot]({{ site.baseurl }}/assets/img/2018-11-25-android-auto-sizing-text-view/screenshot_01.png)

<br/>

### Customize Text Auto Sizing

So far, we have seen default uniform auto size text type. There more ways to customize it further. There are 4 more properties to customize it:

1. autoSizeMaxTextSize
2. autoSizeMinTextSize
3. autoSizeStepGranularity
4. autoSizePresetSizes

If you don’t set these properties then default values will be used as shown below:

```xml
android:autoSizeMaxTextSize="112sp"
android:autoSizeMinTextSize="12sp"
android:autoSizeStepGranularity="1sp"
```

<br/>

### Granularity

**autoSizeMinTextSize** and **autoSizeMaxTextSize** properties are used to define the range between the minimum and maximum text size. **autoSizeStepGranularity** defines the incremental steps. These 3 attributes are used together. The TextView will scale uniformly in the range between the minimum and the maximum size in increaments of step granularity.

For Example, defining attributes as below:

```xml
<TextView
    android:layout_width="300dp"
    android:layout_height="300dp"
    android:autoSizeMaxTextSize="56sp"
    android:autoSizeMinTextSize="14sp"
    android:autoSizeStepGranularity="5sp"
    android:text="Hello World!" />
```

Here, the **step size** is **5sp** and the **range** is from **14sp** to **56sp.** That means from text size **14sp,** it will increment text size to **5sp** until it finds the max text size that can be used to display the **content** of the **TextView** and uses that max size to display the content. The max text size changes as the content of the TextView changes.

<br/>

#### Set Properties Programmatically

To set these properties using java code, **setAutoSizeTextTypeUniformWithConfiguration()** method is used.

```java
void setAutoSizeTextTypeUniformWithConfiguration (TextView textView, 
                int autoSizeMinTextSize, 
                int autoSizeMaxTextSize, 
                int autoSizeStepGranularity, 
                int unit)
```

Example:

```java
//for using support library
TextViewCompat.setAutoSizeTextTypeUniformWithConfiguration(tvText,
        14,
        56,
        5, 
        TypedValue.COMPLEX_UNIT_SP);

//for android O and later
tvText.setAutoSizeTextTypeUniformWithConfiguration(14,
        56,
        5,
        TypedValue.COMPLEX_UNIT_SP);
```

<br/>

### Preset Sizes

**Present sizes** are used to have **more control** over the text sizes. For example, If your app needs to follow some specific text size **design guidelines.** Then, you can provide a **list of sizes** and it will use the **largest one** that fits. Use the property **autoSizePresetSizes** and provide the list of sizes as value to the attribute.

```xml
app:autoSizePresetSizes="@arrays/autosize_text_sizes"
```

First, Create an **array** in **res>arrays.xml.**

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <array name="autosize_text_sizes">
        <item>8sp</item>
        <item>16sp</item>
        <item>24sp</item>
        <item>32sp</item>
        <item>40sp</item>
        <item>48sp</item>
        <item>56sp</item>
        <item>64sp</item>
    </array>
</resources>
```

Now, in the TextView set the preset sizes property.

```xml
<TextView
    android:layout_width="300dp"
    android:layout_height="300dp"
    android:text="Hello World!"
    android:autoSizeTextType="uniform"
    android:autoSizePresetSizes="@arrays/autosize_text_sizes" />
```

<br/>

#### Set sizes Programmatically

To set preset sizes properties using java code, **setAutoSizeTextTypeUniformWithPresetSizes()** method is used.

```java
void setAutoSizeTextTypeUniformWithPresetSizes(TextView textView,
        int []presetSizes,
        int unit)
```

Example:

```java
int []presetSizes={8,16,24,32,40,48,56,64};

//using support library
TextViewCompat.setAutoSizeTextTypeUniformWithPresetSizes(textView,
presetSizes,
TypedValue.COMPLEX_UNIT_SP);

//for android O and later
textView.setAutoSizeTextTypeUniformWithPresetSizes(presetSizes,
TypedValue.COMPLEX_UNIT_SP);
```

That’s it! Start using AutoSizing TextView and make beautiful UI. 🙂

![](/uploads/2018-11-25-start-a-blog/banner.png "Temp Testing")
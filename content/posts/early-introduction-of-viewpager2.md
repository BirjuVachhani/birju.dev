---
title: "Early Introduction of ViewPager2"
date: 2019-03-16T15:55:51+05:30
draft: true
toc: false
author: Birju Vachhani
images:
featured: "/assets/img/2019-03-16-early-introduction-of-viewpager2/banner.png"
tags: 
  - untagged
---

![BANNER](/assets/img/2019-03-16-early-introduction-of-viewpager2/banner.png)

<br/>
It’s been a while since the **alpha** version of Android **ViewPager2** is released by **Google** on **7th February 2019**. You can find more information about the alpha release [**here**](https://developer.android.com/jetpack/androidx/releases/viewpager2#1.0.0-alpha01). Let’s see what **ViewPager2** brings to the table!

## New Features

* **Right-to-left (RTL)** layout support
* Vertical Orientation Support
* A Better **PageChangeListener**

<br/>
## What has been changed!

* [**PagerAdapter**](https://developer.android.com/reference/android/support/v4/view/PagerAdapter) is replaced by [**RecyclerView.Adapter**](https://developer.android.com/reference/android/support/v7/widget/RecyclerView.Adapter).
* [**FragmentStatePagerAdapter**](https://developer.android.com/reference/android/support/v4/app/FragmentStatePagerAdapter) is replaced by **FragmentStateAdapter**.

This version of **ViewPager2** is released for **Android X** so if you want to use it then your project must have been migrated to Android X. Let’s see how we can use this new **ViewPager2**.

<br/>
## First Thing First: Gradle Dependency

Add following dependency to your app level **build.gradle** file:

```groovy
dependencies {
    implementation "androidx.viewpager2:viewpager2:1.0.0-alpha01"
}
```

Sync your project and you’re good to go!

<br/>
## Setup

Add **ViewPager2** widget to your **Activity/Fragment**.

{{< highlight go "linenos=table,hl_lines=2" >}}
<androidx.viewpager2.widget.ViewPager2
        android:id="@+id/viewPager2"
        android:layout_width="match_parent"
        android:layout_height="match_parent"/>
{{< / highlight >}}

Let’s create a layout for our page representation.

<br/>
#### item_page.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:id="@+id/container"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <androidx.appcompat.widget.AppCompatTextView
        android:id="@+id/tvTitle"
        android:textColor="@android:color/white"
        android:layout_width="wrap_content"
        android:layout_centerInParent="true"
        tools:text= "item"
        android:textSize="32sp"
        android:layout_height="wrap_content" />

</RelativeLayout>
```

Next, we need to create **Adapter** for **ViewPager2**. This is the best part! For this we can use **RecyclerView.Adapter**. Isn’t it awesome?

<br/>
#### ViewPagerAdapter.kt

```kotlin
class ViewPagerAdapter : RecyclerView.Adapter<PagerVH>() {

    private val colors = intArrayOf(
        android.R.color.black,
        android.R.color.holo_red_light,
        android.R.color.holo_blue_dark,
        android.R.color.holo_purple
    )

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): PagerVH =
        PagerVH(LayoutInflater.from(parent.context).inflate(R.layout.item_page, parent, false))

    override fun getItemCount(): Int = colors.size

    override fun onBindViewHolder(holder: PagerVH, position: Int) = holder.itemView.run {
        tvTitle.text = "item $position"
        container.setBackgroundResource(colors[position])
    }
}

class PagerVH(itemView: View) : RecyclerView.ViewHolder(itemView)
```

Just as simple as that, nothing’s changed in this adapter! It’s the same adapter we use for **RecyclerView** and it works like a charm.

Final Step, set adapter for **ViewPager2**.

```kotlin
class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        viewPager2.adapter = ViewPagerAdapter()
    }
}
```

<br/>
That’s it! It will give you the same output as the old **ViewPager** with **PagerAdapter** would give.

![GIF]({{ site.baseurl }}/assets/img/2019-03-16-early-introduction-of-viewpager2/viewpager_horizontal_scroll.gif)

<div align="center">ViewPager2 Horizontal Scroll</div>

<br/>
## Vertical Scrolling

We used to use third party libraries to provide **vertical scrolling** as no official support was provided by **Google** until now. With this new **ViewPager2**, we have in house support for vertical scrolling. Just set orientation to **ViewPager2** and vertical scrolling will be enabled for you! It’s just that simple.

```kotlin
viewPager2.orientation = ViewPager2.ORIENTATION_VERTICAL
```

This is the result of vertical orientation:

![GIF]({{ site.baseurl }}/assets/img/2019-03-16-early-introduction-of-viewpager2/viewpager_vertical_scroll.gif)
<div align="center">ViewPager2 Vertical Scroll</div>

<br/>


## Using FragmentStateAdapter

You can use **fragments** too as you would with the old **ViewPager**. For that, we have **FragmentStateAdapter**. Let’s see how we can use this.

First of all, we need to create a fragment:

```kotlin
class PagerFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.item_page, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        arguments?.let {
            container.setBackgroundResource(it.getInt("color"))
            tvTitle.text = "Item ${it.getInt("position")}"
        }
    }
}
```

Now we’ll create Adapter for **ViewPager2**. It will take **FragmentManager** as constructor argument to manage fragments.

```kotlin
class ViewPagerFragmentStateAdapter(fm: FragmentManager) : FragmentStateAdapter(fm) {

    private val colors = intArrayOf(
        android.R.color.black,
        android.R.color.holo_red_light,
        android.R.color.holo_blue_dark,
        android.R.color.holo_purple
    )

    override fun getItem(position: Int): Fragment = PagerFragment().apply {
        arguments = bundleOf(
            "color" to colors[position],
            "position" to position
        )
    }

    override fun getItemCount(): Int = colors.size
}
```

That’s it! set this new adapter to **viewPage2** and you’re good to go.

```kotlin
viewPager2.adapter = ViewPagerFragmentStateAdapter(supportFragmentManager)
```

<br/>
## OnPageChangeCallback Made Easy

In older ViewPager, an interface called **OnPageChangeListener** was exposed to receive **page change/scroll events**. It was such a pain as we needed to **override** all the three methods **(onPageScrollStateChanged, onPageScrolled, onPageSelected)** even if we didn’t want to.

```kotlin
oldViewPager.addOnPageChangeListener(object:ViewPager.OnPageChangeListener{
    override fun onPageScrollStateChanged(state: Int) {
        // useless
    }

    override fun onPageScrolled(position: Int, positionOffset: Float, positionOffsetPixels: Int) {
        // useless too
    }

    override fun onPageSelected(position: Int) {
        // useful
    }
})
```

Gone are those days, now we have **OnPageChangeCallback** which is an **abstract** class with **non-abstract methods**. Which literally means that we don’t need to **override** all these methods, we can just **override** the ones we care or we willing to use. **No more boilerplate!** This is how we can register for page change/scroll events.

```kotlin
viewPager2.registerOnPageChangeCallback(object : ViewPager2.OnPageChangeCallback() {
    override fun onPageSelected(position: Int) {
        super.onPageSelected(position)
        // No boilerplate, only useful
    }
})
```

### Attention!

As this is in **alpha** phase, there are some features of older **ViewPager** which hasn’t been yet implemented or not working properly in this version.

#### Known Issues as per Documentation:

* ClipToPadding
* No implementation for integrating with TabLayout
* no offscreen limit control
* no pageWidth setter (forced 100%/100%)

You can find more about known issues [**here**](https://developer.android.com/jetpack/androidx/releases/viewpager2#1.0.0-alpha01). This is what we have for now. Hopefully this all will be fixed in the **future updates** I guess. I’m eagerly waiting for the **stable version** of this new **ViewPager2**. Till then, Happy coding folks!
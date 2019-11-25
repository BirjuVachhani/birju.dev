---
title: What's New in Android Architecture Components - Google I/O'19
author: Birju Vachhani
date: 2019-05-16T10:25:51.000+00:00
toc: false
images: 
tags:
- android
- google-io-19
- architecture-components
cover: assets/images/arch-components-banner.svg
categories:
- Android

---
Developer community have tons of information to process after Google I/O’19 sessions. The session made it clear that it is going to be Kotlin first for Android. It covered the progress made in Android support for Kotlin and Kotlin-centered universe like Kotlin samples and reference docs, annotations, framework APIs, IDE support for low-level byte code optimizations in the D8/R8 compiler.

But besides all the big fancy things that got mentioned in the keynote, we are going to check out what’s new in android architecture components.

## 1. Data Binding

> Data Binding is declarative UI inside XML. It tries to bridge the gap between your code and your XML

Data Binding has been real pain for developers. The binding classes are generated on compilation so for every small change we need to compile whole source.

### Faster Compilation

Compilation speed is significantly improved. Now it is **20%** faster while it runs the annotation processor. They have added support for **distributed Gradle cache** so that you can benefit from your peers compiling the projects.

In **Android Studio 3.5**, we have an **incremental annotation processor** for data binding. It is **experimental** yet so you need to turn it on before using it. Put following line of code into your **Gradle** file to turn it on:

```groovy
    android.databinding.incremental = true
```

### Live Class Generation

Before this, if you create new XML bindings or add new views and widgets to your **declarative XML** then you would have to recompile the source code by building the projects again. Let’s say you have a view in your declarative XML and then you assign an id to it then you have to build the project again in order to get data binding generated for it! How we can avoid this?

**Live Class Generation** comes to the rescue. What does this mean is when you assign an id to a view or add new views or widgets to your declarative layout for which binding is already generated, you don’t need to **rebuild** the whole thing. The corresponding binding class will be generated with the latest changes for you. How amazing is that! No need to wait for build process to complete!

{{< figure src="/assets/images/arch-components-io-1.gif" alt="Live Class Generation — from Google IO-2019" position="center" caption="Live Class Generation — from Google IO-2019" >}}

Lets say you want to remove id of some view. As soon as you do that, corresponding bindings will be invalidated immediately! This works for binding variables also. You declare a new variable in your XML layout and it is available into your binding object in no time! Cool, right?

{{< figure src="/assets/images/arch-components-io-2.gif" alt="Live Class Generation for Binding Variables — from Google IO-2019" position="center" caption="Live Class Generation for Binding Variables — from Google IO-2019" >}}

### Refactoring Support

Back in old days, whenever we refactor some variable or method that is bound with some of your UI in XML using data binding, studio doesn’t notify that this particular variable or method is used somewhere in you declarative XML layouts and most of the times we end up with project not being compiled because it cannot find that variable or method as that is refactored! But you have had enough, no more pain now!

Now if you want to refactor that method or variable and as soon as you do that android studio updates related bindings automatically for us!

{{< figure src="/assets/images/arch-components-io-3.gif" alt="Refactoring Support" position="center" caption="Refactoring Support" >}}

Also you can do the same thing from **XML**. You refactor something from **XML** and studio will automatically update your code.

### Better Error Messages

Data Binding error messages has been real mess since Data Binding was introduced for the first time. If something is broken for binding, say it cannot find particular view or variable, it shows **thousands of errors** in your **log cat**. Sometimes this **stack-traces** are so huge that you cannot even see the actual error that broke the project and build process. I has been happened to me for many times and know this: **You’ll never find out what the actual problem was even after wasting hours and hours!**

But you have suffered enough! They have fixed this problem. Also, they have added a **separate section** that is **specific to Data Binding errors!** I’m going crazy!!

{{< figure src="/assets/images/arch-components-io-4.png" alt="Better Error Messages" position="center" caption="Better Error Messages" >}}

## 2. Accessing Views

These are the options we have when it comes to access a view in **Android**. Using Following evolution chart from the related IO talk, they evaluated them in terms of **elegance, compile time safety and build speed impact!**

{{< figure src="/assets/images/arch-components-io-5.png" alt="Ways of Accessing Views" position="center" caption="Ways of Accessing Views" >}}

We’re looking for the last one that satisfies all the terms. What it could be? Here comes **View Binding**.

### View Binding

The new **View Binding** feature is going to be available in **Android Studio 3.6**. It is totally **compile time safe** and it doesn’t have any impact on your build speed.

Below snippet represents what we are used to do which is using one of the methods from above chart to access our views.

{{< figure src="/assets/images/arch-components-io-6.png" alt="Accessing Views - The Old Way" position="center" caption="Accessing Views - The Old Way" >}}

We don’t need to do those things, we can use **generated** binding class after it is **inflated** and then set the content view. Doing this, we are going to have all the views with IDs as **public final fields** in that binding object.

{{< figure src="/assets/images/arch-components-io-7.png" alt="Accessing Views with View Binding" position="center" caption="Accessing Views with View Binding" >}}

If the id with correct type doesn’t exist then the code will not **compile**. This is how we get **100% compile time safety**. As it is also usable from **Java**.

> If your code compiles then that means your views do exist in the right layout.

All this binding classes are generated by the **Android Studio Gradle plug-in**. So if you change a layout file then it the only file that gets invalidated.

It has full Android Studio integration and it is fully compatible with **Data Binding**.

> If you’re using Data Binding just to access your views then you can turn it off and turn on View Binding and your code will compile as it is.

## 3. ViewModel + SavedStated

Alright, here’s the big picture:

1. You have your stuff.
2. you put your stuff into `ViewModel` or a `SavedState`.
3. configuration change happens.
4. You go back to your `ViewModel` or `SavedState` and grab your stuff out of it.

This makes us think that both `ViewModel` and `SavedState` are similar but actually that’s not true.

### The Difference

`SavedState` travels to the system server which is a separate process so this is **“Travel across process boundaries”**.

In contrast to SavedState, `ViewModel` always lives in process memory. It never leaves it.

Configuration changes doesn’t affect it at all because memory is continuous for this process and your `ViewModel` is still there. If the process is **restarted** for some reason, then you have **NOTHING**.

{{< figure src="/assets/images/arch-components-io-8.png" alt="ViewModel vs SavedState" position="center" caption="ViewModel vs SavedState" >}}

So now we know that `ViewModel` and `SavedState` are different things. But They can work together. Here is how we can use it.

{{< figure src="/assets/images/arch-components-io-9.png" alt="Saved State Handle" position="center" caption="Saved State Handle" >}}

Now `ViewModel` receive `SavedStateHandle` instance in `ViewModel` constructor. This instance will allow you to access `SavedState` right into your `ViewModel`.

`SavedStateHandle` is a **map** like object with very straightforward api.

{{< figure src="/assets/images/arch-components-io-10.png" alt="SavedStateHandle Usage" position="center" caption="SavedStateHandle Usage" >}}

They have also provided convenience api for `LiveData`. As `SavedState` is mutable data so it is `MutableLiveData`.

{{< figure src="/assets/images/arch-components-io-11.png" alt="SavedStateHandle with LiveData" position="center" caption="SavedStatehandle with LiveData" >}}

### Kotlin Friendly Code

They kind of paid their debts in other fields of `LifeCycle` and made some of the code much Kotlin friendly then it was earlier.

### LiveData Observers

Introducing **lambda** block support for `LiveData` observations.

Before (Java friendly code):

{{< figure src="/assets/images/arch-components-io-12.png" alt="Observe LiveData - The Old Way" position="center" caption="Observe LiveData - The Old Way" >}}

Now (Kotlin friendly code):

{{< figure src="/assets/images/arch-components-io-13.png" alt="Observe LiveData - The New Way" position="center" caption="Observe LiveData - The New Way" >}}

### LiveData Transformations

No need to use **static** methods on **transformations**. Instead now we have extension functions:

{{< figure src="/assets/images/arch-components-io-14.png" alt="LiveData Transformations" position="center" caption="LiveData Transformations" >}}

### ViewModel Initialization

No need to use `lateinit` var for Initialization.

Before:

{{< figure src="/assets/images/arch-components-io-15.png" alt="ViewModel Initialization - The Old Way" position="center" caption="ViewModel Initialization - The Old Way" >}}

Now we have property delegation:

{{< figure src="/assets/images/arch-components-io-16.png" alt="ViewModel Initialization - The New Way" position="center" caption="ViewModel Initialization - The New Way" >}}

## 4. WorkManager

WorkManager is a background processing library for work that doesn’t have to be executed right away. It is **persistent** so it can go across **app restarts** and device restarts. It is also **constraints based** so you can have work that only triggers when some conditions are met like network access.

### On-demand Configuration

The hard thing about WorkManager is that it needs to be **initialized** when your app starts up. This new **on-demand initialization** will allow you to start WorkManager only when you need it. That’s quite good.

It is currently available in **WorkManager 2.1 alpha**. You can implement `Configuration.Provider` in your application class . It has a method that needs to be **overridden** which returns a `WorkManager` configuration object.

{{< figure src="/assets/images/arch-components-io-17.png" alt="WorkManager: On-demand Configuration" position="center" caption="WorkManager: On-demand Configuration" >}}

Currently in **WorkManager 2.0**, you can get WorkManager instance by calling `WorkManager.getInstance()` with no arguments. In **WorkManager 2.1**, If you provide `context` as argument then it indicates WorkManager that if it is not Initialized then it can go to the application object and get the configuration.

{{< figure src="/assets/images/arch-components-io-18.png" alt="WorkManager Instance" position="center" caption="WorkManager Instance" >}}

### Google play Services Integration

* Better performance on pre-marshmallow devices.
* Totally optional. Checks if you’re using play services and uses it if you do. Just needs a Gradle dependency to enable it.

### Testing

When `WorkManager` released, it had some problems working with `Roboletrics` but it works perfectly fine with the release of **WorkManager 2.1** alpha.

### Worker Unit Testing (alpha)

**Workers** can be created using these classes `TestWorkerBuilder` or `TestListenableWorkerBuilder` and you can use them by calling `doWork` or `startWork` method.

{{< figure src="/assets/images/arch-components-io-19.png" alt="Test Worker" position="center" caption="Test Worker" >}}

{{< figure src="/assets/images/arch-components-io-20.png" alt="Test Listenable Worker" position="center" caption="Test Listenable Worker" >}}

### Foreground Services Support

Later this year, support for **foreground services** will be added to the `WorkManager` apis. You can use it to do your work in **foreground**. Both `WorkManager` and `JobScheduler` give you a **10 minutes of slice** to do your task. If your task go longer than that then you can make use of a foreground service for that.

## 5. Room

From **Room 2.1**, `Dao` can have **suspending** methods and Room will generate correct code including using a background **dispatcher**. You can have **suspending** methods which do transaction also.

{{< figure src="/assets/images/arch-components-io-21.png" alt="Room: Suspending Methods in DAO" position="center" caption="Room: Suspending Methods in DAO" >}}

Room also includes a **extension** function that will allow us to start a **transaction**. It creates a special `CoroutineContext` that we can use to perform **multiple** database operations.

{{< figure src="/assets/images/arch-components-io-22.png" alt="Room: Transaction Extension" position="center" caption="Room: Transaction Extension" >}}

### Full Text Search

> Full Text Search is an extension in SQLite to be able to create tables to efficiently search for data.

Let’s say we are trying to create a search functionality for a music app like we want to search for a given phrase. In **Room 2.0**, we would have to write a `Dao` method kind of like this:

{{< figure src="/assets/images/arch-components-io-23.png" alt="Room: Search Query" position="center" caption="Room: Search Query" >}}

It doesn’t look great, there is a huge `WHERE` clause. But in **Room 2.1**, if you want an entity to be able to be backed by an `fts` table, just simply use the `fts` annotation. It simplifies your query to this as you can start using `MATCH` expression:

{{< figure src="/assets/images/arch-components-io-24.png" alt="Room: FTS Support" position="center" caption="Room: FTS Support" >}}

{{< figure src="/assets/images/arch-components-io-25.png" alt="Room: MATCH Query" position="center" caption="Room: MATCH Query" >}}

### Database Views

Database Views is another way to simplify your database operation.

> Database Views are kind of like tables where everywhere you reference a table, you can reference a view but you cannot insert data into views. They are kind of like queries with a given name.

Let’s say we want to display a list of albums. In **Room 2.1**, instead of having a **BigQuery**, you can annotate your data class(your entity for Room 2.0) with `@DatabaseView.` So instead of making a table, we’ll create a **view** out of it. Then we have to put our **BigQuery** in the annotation to specify how we get our data for the view.

{{< figure src="/assets/images/arch-components-io-26.png" alt="Room: Database View" position="center" caption="Room: Database View" >}}

The import thing is now we can use this view as if it was **another table**.

{{< figure src="/assets/images/arch-components-io-27.png" alt="Room: Database View Query" position="center" caption="Room: Database View Query" >}}

### Expanded Rx Support

In **Room 2.1**, now you can have insert, update and delete method that return `Completable`, `Maybe` and `Single`. You also use Rx as return type for Query tag that performs write statements such as insert **update** or **delete** operation.

{{< figure src="/assets/images/arch-components-io-28.png" alt="Room: Extended Rx Support" position="center" caption="Room: Extended Rx Support" >}}

### What’s Next

* Incremental Annotation Processor
* Relationship Improvements
* Migration Improvements
* Coroutines Channels & Flow

## 6. Paging

### What’s Next

* Built in network support with error handling
* Headers & Footers
* Better RxJava & Coroutines Integration

## 7. Navigation

### What’s Next

* ViewModel scoped to the navigation graph.
* Navigate by URI
* Dialog Destinations
* Better support for dynamic features

That’s it. Thank you guys for reading. If you liked what you read, don’t forget to clap 😁. Happy coding folks!
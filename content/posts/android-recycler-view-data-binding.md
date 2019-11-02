---
title: "RecyclerView Data Binding"
date: 2018-05-22T15:55:51+05:30
draft: true
toc: false
images:
tags: 
  - untagged
---

Howdy folks!😎 I assume you all know about RecyclerView and how it works by recycling the shit that is no longer visible to user.

What I personally don’t like about it is creating a ViewHolder class, use findViewById() to get views and bind data to those views whenever needed (of course there’s more not to like about RecyclerView but let’s not talk about it right now 😐). But here comes the smart data binding: no findViewById(), no manually binding data to the views 😄. Follow my lead and I’ll show you how it’s done.

<br/>
### Enable Data Binding

To use data binding, one have to enable it first. Go to your app’s **build.gradle** file and add following code:

```gradle
defaultConfig {
    dataBinding.enabled = true
}
```

Sync project and data binding will be enabled.

<br/>
### Create RecyclerView in the Activity

To use data binding in any layout, **\<layout>** should be the root tag in that xml file. make changes as shown below in Activity’s xml file:

```xml
<?xml version="1.0" encoding="utf-8"?>
<layout>

    <data class="MainActivityBinding" />

    <android.support.constraint.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
        xmlns:tools="http://schemas.android.com/tools"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        tools:context=".MainActivity">

        <android.support.v7.widget.RecyclerView
            android:id="@+id/rvUserList"
            android:layout_width="match_parent"
            android:layout_height="match_parent"
            tools:listitem="@layout/single_row" />

    </android.support.constraint.ConstraintLayout>
</layout>
```

**<data class=”MainActivityBinding”/>** instructs to create **MainActivityBinding** class for binding the Activity.

<br/>
### Create layout for single row of RecyclerView

Create a xml file for single row layout and make sure that <layout> is the root tag. declare a data class that is to be generated as binding class for that layout.

```xml
<layout xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools">

    <data class="SingleRowBinding">

        <variable
            name="user"
            type="com.birjuvachhani.recyclerviewdatabinding.User" />
    </data>

</layout>
```

Here, **\<variable name=”” type=”” />** defines the POJO class that is to be used to get binding data. i.e. we want to display user information like image, name and city. then the User POJO will be used to get binding data. **type=””** takes fully qualified class name with package path and **name=””** takes a name that is used to refer to POJO in the xml file.

for example, **com.birjuvachhani.recyclerviewdatabinding.User** is the fully qualified POJO class name. and **user** will be used to refer to POJO in the xml like shown below:

```xml
<TextView
    android:id="@+id/tvName"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:layout_marginStart="16dp"
    android:layout_marginTop="8dp"
    android:text="@{user.name}"
    android:textSize="24sp" />
```

Here, **android:text=”@{user.name}”** refers to the name stored in **User** POJO.

<br/>
### Create ViewHolder for the RecyclerView

In the constructor of ViewHolder class, we pass Binding object for single row instead of passing the view for single row.

```java
class UserViewHolder extends RecyclerView.ViewHolder {
    private SingleRowBinding mBinding;

    public UserViewHolder(SingleRowBinding mBinding) {
        super(mBinding.getRoot());
        this.mBinding = mBinding;
    }

    public void bind(User user) {
        mBinding.setUser(user);
        mBinding.executePendingBindings();
    }
}
```

**super(mBinding.getRoot())** passes the root of the view to the super. **bind(User user)** is used to bind data from POJO to view. **setUser()** method sets the POJO for the view to get data from.

Here, **executePendingBindings()** method is very important! It forces the bindings to execute immediately rather than executing later until the next frame.

<br/>
### Create Adapter for the RecyclerView

The remaining task is to create Adapter that handles data for the RecyclerView. There are 3 important methods that must be overridden:

```java
@NonNull
@Override
public UserViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
    SingleRowBinding mBinding = SingleRowBinding.inflate(LayoutInflater.from(parent.getContext()), parent, false);
    return new UserViewHolder(mBinding);
}

@Override
public void onBindViewHolder(@NonNull UserViewHolder holder, int position) {
    holder.bind(mlist.get(position));
}

@Override
public int getItemCount() {
    return mlist.size();
}
```

In **onCreateViewHolder()** method, we inflate layout using binding class, create binding object and return the ViewHolder object. In **onBindViewHolder()** method, we call bind() method of the ViewHolder class and pass POJO to be bound with the view from the list.

<br/>
### Loading Image from resources with data binding

We provide resource id in the ImageView in xml but how to load that image from resources using data binding? Follow me:

we need to define a static method and bind it with xml attribute to get image resource and set the image. add the following code at the end of the Adapter class:

```java
@BindingAdapter("src")
public static void setImageSrc(ImageView view, int imageId) {
    if (imageId != -1) {
        view.setImageResource(imageId);
    }
}
```

Now, in xml file, use it as shown below:

```xml
<ImageView
    android:id="@+id/ivAvatar"
    android:layout_width="70dp"
    android:layout_height="70dp"
    app:src="@{user.imageId}" />
```

Here is an example on [github](https://github.com/BirjuVachhani/RecyclerViewExample/tree/data_binding).
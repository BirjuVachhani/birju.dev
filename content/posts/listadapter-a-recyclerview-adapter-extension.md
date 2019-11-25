---
title: 'ListAdapter: A RecyclerView Adapter Extension'
author: Birju Vachhani
date: 2019-05-09T10:25:51.000+00:00
toc: false
images: 
tags:
- android
- RecyclerView
- ListAdapter
- Adapter
cover: assets/images/Web 1920 – 1.svg
categories:
- Android

---
Howdy people! We have been using **RecyclerView** for such a long time. It seems pretty easy to implement, isn’t it? All we need to do is extend **RecyclerView.Adapter** class and implement at least 3 methods:

* getItemCount()
* onCreateViewHolder()
* onBindViewHolder()

That’s it! After that generally, we provide a way to set data to adapter by adding a method like `setList()` and then in the method we assign a new list and then we call `notifyDataSetChanged()` to update **RecyclerView**.

But that’s not it. The method `notifyDataSetChanged()` refreshes whole list. As a result `onBindViewHolder()` is called for all of the items in the list even if the item doesn’t have any change at all. We don’t want to refresh our whole list every time some item is **added, removed or changed**. It doesn’t look good and it is not even performance friendly when you have last number of items in the list.

**DiffUtil** comes to the rescue! It provides a way to **calculate difference** between the two list and calls related methods on the adapter like `notifyItemInserted(), notifyItemRemoved(), notifyItemChanged(), etc.` As a result, the whole list doesn’t get refreshed. Only the items that have been changed are refreshed. It also animates the item changes a little bit so it looks quite nice and it is also performance efficient.

Before we continue further, If you don’t know what **DiffUtil** is, what it does and how to implement it with **RecyclerView** then I suggest you to go and learn that first. If you wish to continue reading further then I assume you have enough knowledge of **DiffUtil** and its implementation.

To use **DiffUtil**, we need to do a little bit of setup. First, we need to create a class that extends **DiffUtil.Callback** class. then after we need to calculate the difference between **old list** and **new list** using an instance of the class that we have created extending **DiffUtil.Callback**.

```kotlin
class UserDiffUtil(val oldList: List<User>, val newList: List<User>) : DiffUtil.Callback() {
    override fun areItemsTheSame(oldItemPosition: Int, newItemPosition: Int): Boolean {
        return oldList[oldItemPosition] == newList[newItemPosition]
    }

    override fun getOldListSize(): Int {
        return oldList.size
    }

    override fun getNewListSize(): Int {
        return newList.size
    }

    override fun areContentsTheSame(oldItemPosition: Int, newItemPosition: Int): Boolean {
        return oldList[oldItemPosition] == newList[newItemPosition]
    }

}
```

_In RecyclerView.Adapter:_

```kotlin
// In RecyclerView.Adapter
fun setList(newList: ArrayList<User>) {
    DiffUtil.calculateDiff(UserDiffUtil(this.userList, newList)).dispatchUpdatesTo(this)
    this.userList.clear()
    this.userList.addAll(newList)
}
```

This is the all setup we need to do in order to implement **DiffUtil** and it works fine for **small** lists. The problem is that **DiffUtil** calculates the difference on main thread which leads to performance issues when the adapter holds larger amount of data in the list. To avoid that, we need to run **DiffUtil** on background thread and pass results to the main thread.

Now, that’s quite a lot of things to setup. There must be some easy way to do that, right? Guess what, there is! I’m not talking about using any utils or third party libraries. It is right there in the support library itself! **ListAdapter** comes to the rescue!

## ListAdapter

If you have paid close attention to the **RecyclerView** library releases then you might have came across this class but perhaps I assume you didn’t (neither did I) so here we are. Let’s see what is this all about. [**ListAdapter**](https://developer.android.com/reference/android/support/v7/recyclerview/extensions/ListAdapter) was added in version **27.1.0** and belongs to maven artifact `com.android.support:recyclerview-v7:28.0.0-alpha1` . Here’s what android docs page says:

> It is [RecyclerView.Adapter](https://developer.android.com/reference/android/support/v7/widget/RecyclerView.Adapter.html) base class for presenting List data in a [RecyclerView](https://developer.android.com/reference/android/support/v7/widget/RecyclerView.html), including computing diffs between Lists on a background thread.

It computes Diffs on background thread which means we don’t need to implement it by ourselves. Also, it provides more convenient and easy implementation of **DiffUtil** rather than implementing diffs with normal **RecyclerView.Adapter**.

> This class is a convenience wrapper around [AsyncListDiffer](https://developer.android.com/reference/android/support/v7/recyclerview/extensions/AsyncListDiffer.html) that implements Adapter common default behavior for item access and counting.

[**_AsyncListDiffer _**](https://developer.android.com/reference/android/support/v7/recyclerview/extensions/AsyncListDiffer.html)is helper class for computing the difference between two lists via [DiffUtil](https://developer.android.com/reference/android/support/v7/util/DiffUtil.html) on a background thread.

[**ListAdapter**](https://developer.android.com/reference/android/support/v7/recyclerview/extensions/ListAdapter) provides a method `submitList(List)` to provide new or modified data to **RecyclerView.Adapter** and handles all the diffs computation. So we don’t need to do much of setup here. All we need to do is provide a instance of `DiffUtil.ItemCallback` that determines whether the item is changed or not. So, Let’s take a dive into the implementation of ListAdapter.

### Gradle Dependencies

```groovy
implementation 'com.android.support:recyclerview-v7:28.0.0'
```

**AndroidX:**

```groovy
implementation 'androidx.recyclerview:recyclerview:1.0.0'
```

### Required Classes

To implement [**ListAdapter**](https://developer.android.com/reference/android/support/v7/recyclerview/extensions/ListAdapter), we’ll need `RecyclerView.ViewHolder` implementation and a **model/POJO** class. We must provide a model class type (e.g. User) to `ListAdapter` as it would be managing list for us.

```kotlin
// User POJO
data class User(val name: String, val age: Int)

// ViewHolder
class UserViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView){
    
    fun bindTo(user:User){
        // bind views with data
    }
}
```

### Create DiffUtil.ItemCallback Implementation

[**ListAdapter**](https://developer.android.com/reference/android/support/v7/recyclerview/extensions/ListAdapter) takes a `DiffUtil.ItemCallback` instance as an constructor input. Let’s create an implementation for `DiffUtil.ItemCallback`:

```kotlin
class UserItemDiffCallback : DiffUtil.ItemCallback<User>() {
    override fun areItemsTheSame(oldItem: User, newItem: User): Boolean = oldItem == newItem

    override fun areContentsTheSame(oldItem: User, newItem: User): Boolean = oldItem == newItem

}
```

> _Notice that we have used_ `_oldItem == newItem_` _expression for checking whether the contents are same or not and it works perfectly as we’re using data class which provides implementation for_ `_equals()_` _method by default._

Now let’s implement `ListAdapter`. Unlike `RecyclerView.Adapter` implementation, we don’t need to override `getItemCount()` method as `ListAdapter` manages the list for us. So we only need to implement two methods `onCreateViewHodler()` and `onBindViewHolder()` .

```kotlin
class UsersAdapter : ListAdapter<User, UserViewHolder>(UserItemDiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, position: Int): UserViewHolder {
        return UserViewHolder(
            LayoutInflater.from(parent.context)
                .inflate(R.layout.activity_main, parent, false)
        )
    }

    override fun onBindViewHolder(holder: UserViewHolder, position: Int) {
        holder.bindTo(getItem(position))
    }

}
```

However if you do want to override `getItemCount()` method for some reason then you must call super method to get item count and then use it further. Here’s an example that we generally use to provide empty list implementation:

```kotlin
override fun getItemCount(): Int {
    val count = super.getItemCount()
    return when (count) {
        0 -> 1
        else -> count
    }
}
```

All we have to do now is submit new list whenever we have it.

```kotlin
adapter = UsersAdapter()
rvUsers.adapter = adapter

userListLiveData.observe(this, Observer {list->
    adapter.submitList(list)
})
```

That’s it! Diffs will be calculated on background thread and adapter will be notified with the results on main thread. This is the easiest implementation I have found for `DiffUtil` on Background thread. No boilerplate! That’s amazing!

If you wish to have more control over adapter behavior then you can use `AsyncListDiffer` class which can be connected to a [RecyclerView.Adapter](https://developer.android.com/reference/android/support/v7/widget/RecyclerView.Adapter.html), and will signal the adapter of changes between submitted lists.

Thanks for reading! If you liked what you read, don’t forget to clap. Happy coding folks!
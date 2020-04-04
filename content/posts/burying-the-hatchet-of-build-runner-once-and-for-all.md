+++
author = "Birju Vachhani"
categories = ["Flutter"]
cover = ""
date = 2020-04-04T12:51:07Z
draft = true
tags = ["flutter", "android-studio"]
title = "Flutter: Burying the Hatchet with Build Runner Once and for All"

+++
Are you a Flutter Developer? Do you use `build_runner` for code generation? Are you tired of typing or remembering the anaconda sized build runner command? Do you want to get rid of that? Then you've come to the right place. 

Almost every flutter project uses code generation nowadays. Who wouldn't? No one likes to write boilerplate code by themselves. It is exhausting and is kind of stupid at some point. That's why Flutter devs love `build_runner`. The power you feel when you make the computer write code itself is incredible, isn't it? But with great power comes great responsibility and it's nothing different with `build_runner`.

```bash
flutter packages run build_runner build --delete-conflicting-outputs
```

I don't need to ask whether you're familiar with this command or not as this point. If you're not, you wouldn't be reading this! This is the command that does all the code generation. But I gotta admit that this is very lengthy command to remember! Even if you succeed in that, it's very exhausting to type this command several times a day as being a Flutter developer. I am kind of lazy to do it manually over and over! It kind of feels stupid to me!

That brought me here. It got me thinking of some ways to avoid typing it or remembering it in the first place. You might be thinking that why not use aliases. For a linux or Mac system, it is very easy to set and use aliases. You define a nice little alias for this command and use that instead of typing the whole command. 

```shell
alias build_runner='flutter packages run build_runner build --delete-conflicting-outputs'
```

Well, it seems better but not the best. First, this is not easy for Windows users. It kind of sucks for them. Second, You still have to type that alias name, right? Open your terminal, type your little alias and hit enter. Well, I am lazier than that, I don't even want to type that!

What if we can use a shorcut to execute `build_runner` commands like we do for running over app in Android Studio. We hit `ctrl + R` on mac and the Android Studio runs our app for us. Isn't it nice? I would very much like it to have similar functionality for `build_runner` commands as well. 

So, I started digging and found some mojo to make it work same as the run project shortcut works. And that led me to write this article and share that mojo with you guys!

### What do we want?

We want some shortcuts to run `build_runner` commands neatly for our IDE. Whether it be Android Studio or VS Code.
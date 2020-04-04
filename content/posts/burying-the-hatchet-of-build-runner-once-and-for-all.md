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
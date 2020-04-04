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

We want some shortcuts to run `build_runner` commands neatly for our IDE. Whether it be Android Studio or VS Code. You heard that right! For VS Code as well. Android Studio and VS Code are the IDEs that are used mostly for Flutter development. So I decided to provide a workaround for both of them. Keep Reading and I'll show you how you can achieve that!

```bash
# ctrl + alt + G
flutter packages run build_runner build
```

```bash
# ctrl + alt + h
flutter packages run build_runner build --delete-conflicting-outputs
```

I am going to use this shortcuts for this demonstration. You're free to choose whatever suits you.

## VS Code Setup

Well, VS Code trick is easy and straight forward than Android Studio. We're looking for a way to bind a shell command with a keyboard shortcut. Honestly, we can't do it directly in VS Code. Not without any plugins. Yes! you guessed it right! We'll need a specific plugin in order to achieve this.

### Installation

That plugin is [Command Runnner](https://marketplace.visualstudio.com/items?itemName=edonet.vscode-command-runner). Go ahead and install it from the marketplace. It allows us to bind shell commands with keyboard shortcuts. So let's go and install it first!

{{< figure src="/assets/images/vscode_command_runner.png" alt="VS Code Plugin: Command Runner" caption="VS Code Plugin: Command Runner" >}}

### Set Key Bindings

Now that we have above plugin installed, we need to set keyboard shortcut and assign a shell command to it. To do that, Go to `File>Preferences>Keyboard Shortcuts` of press `ctrl + k ctrl + s` on windows or Linux. For Mac, Go to `Code>Preferences>Keyboard Shortcuts` or press `cmd + k cmd + s`.

This will open GUI for key bindings file for VS Code. We need to open it as JSON File. Click on left most icon on the top-right side of the Editor window.

{{< figure src="/assets/images/vscode_keybings.png" alt="VS Code Plugin: Key Bindings JSON" caption="VS Code Plugin: Key Bindings JSON" >}}

You might or might not have some entries in this JSON file. Add following json at the end of the file in the JSON array.

```json
[
  ...
  {
    "key": "ctrl+alt+g",
    "command": "command-runner.run",
    "args": {
      "command": "flutter packages run build_runner build"
    }
  },
  {
    "key": "ctrl+alt+h",
    "command": "command-runner.run",
    "args": {
      "command": "flutter packages run build_runner build --delete-conflicting-outputs"
    }
  }
]
```

Notice that `"command": "command-runner.run"` indicates to use the plugin that we just installed to run our commands. Save the file once you're done editing it. That's it. That's all you need to do! Now you can run your `build_runner` command from anywhere, anytime and for any Flutter project without even typing a single word!

Amazing right? Open a Flutter project and give it a try! Once you hit the keyboard shortcut, it will automatically opent the terminal ans will your the specified command.

{{< figure src="/assets/images/vscode_build_runner_command.png" alt="VS Code: Running build_runner Command with a Shortcut" caption="VS Code: Running build_runner Command with a Shortcut" >}}

You can set shortcuts for running `build_runner watch` commands as well. You can run any comand you want with thic configuration. Be creative!

## Android Studio Setup
+++
author = "Birju Vachhani"
categories = ["Flutter"]
cover = ""
date = 2020-03-28T13:51:26Z
draft = true
tags = ["flutter", "github-actions", "dart", "flutter-package", "dart-package"]
title = "Publish Your Flutter Package using GitHub Actions"

+++
Howdy people! Recently I was exploring the internet to get some guidance on publishing Flutter or Dart packages to [pub.dev](https://pub.dev "Pub Dev") via CI-CD servers. My primary goal was to use GitHub Actions to do so. Unfortunately, I failed to get proper information on how can I achieve that. Then I decided to go by myself and I struggled a lot to get it working properly. So, I decided to write this easy and step-by-step guide to help others like me out there!

Here's what we're trying to achieve: We have a flutter/dart package that we want to publish on [pub.dev](https://pub.dev "Pub Dev") whenever we create a new release on GitHub or push code to the master branch. Sounds easy? Let me tell you, it wasn't. Here's what we're going to need.

## Requirements

1. A flutter package ready to be published.
2. An active account on pub.dev
3. A repository on GitHub with admin access.
4. A working laptop, internet connection, and some patience!

Here's what we are going to do in order to achieve what we want.

## Steps

1. Retrieve Login Credentials for pub.dev
2. Write a shell script to set credentials
3. Create Secrets on GitHub
4. Create a workflow for GitHub Action to publish a package.
5. Triggering Builds.

I did some research on how `pub publish` command works. When we run this command in our terminal for the first time, `pub` would ask us to log in to our pub.dev account by opening the URL printed on the command line. Once we log in using that URL, `pub` store some login credentials(which happens to be some tokens) into a file at `~/.pub-cache/credentials.json`. 

Next time when you run `pub publish` command, it checks for this file and proceeds further without asking for login again. This gave me a hint that to make it work on CI-CD servers, we need to create this file somehow on the build machine. 

Follow this easy guide to setup your GitHub actions to publish your packages.

## 1. Retrieve Login Credentials for pub.dev
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
2. Create Secrets on GitHub
3. Write a shell script to set credentials
4. Create a workflow for GitHub Action to publish a package.
5. Triggering Builds.

I did some research on how `pub publish` command works. When we run this command in our terminal for the first time, `pub` would ask us to log in to our pub.dev account by opening the URL printed on the command line. Once we log in using that URL, `pub` store some login credentials(which happens to be some tokens) into a file called `credentials.json`.

Next time when you run `pub publish` command, it checks for this file and proceeds further without asking for login again. This gave me a hint that to make it work on CI-CD servers, we need to create this file somehow on the build machine.

Follow this easy guide to setup your GitHub actions to publish your packages.

## 1. Retrieve Login Credentials for pub.dev

Alright, we need some credentials to log in to pub.dev via the command line. Here's how it looks like:

```json
{
  "accessToken": "<YOUR_ACCESS_TOKEN>",
  "refreshToken": "<YOUR_REFRESH_TOKEN>",
  "tokenEndpoint": "https://accounts.google.com/o/oauth2/token",
  "scopes": [
    "openid",
    "https://www.googleapis.com/auth/userinfo.email"
  ],
  "expiration": 1583046238465
}
```

If you have already published your package before, you can easily find the required credentials for pub.dev as you already have logged into your account. You can locate the file at following path:

##### Linux/Mac-OS

    ~/.pub-cache/credentials.json

##### Windows

    C:\Users\<USER>\AppData\Roaming\Pub\Cache\credentials.json

But if you're doing this for the first time and you haven't made any releases of your package on pub.dev, these credentials won't be there!

Here's a workaround to get these credentials.

Run the following command:

> Note: Run this command only if this is your first release.

```shell
flutter pub uploader add <YOUR_EMAIL_HERE>
```

This will ask you to log in to your pub.dev account. Do so by opening the link provided in the terminal. Once you log in successfully, you will be able to locate the `credentials.json` file. Keep this file handy. We'll need it in the next step.

## 2. Create Secrets on GitHub

Now, that we have login credentials, we'll need it in our GitHub Action. We could use these tokens directly into our workflow file but it's a Bad Idea to expose sensitive information like this on your repository. So, we're going to use GitHub secrets to store this information on a repository level. That way, it is only accessible by the admin of the repository and we can access those secrets in our workflow file. 

Setting secrets for your repository is quite easy. Head over to GitHub and open your repository settings (assuming you already have your repository set up). There, you'll find the secrets section. 

{{< figure src="/assets/images/github_secrets.png" alt="GitHub Secrets" caption="GitHub Secrets" >}}

Click on `Add a new secret` button to add a secret. Here's all the secret that we're going to need.

#### Secrets

* PUB_DEV_PUBLISH_ACCESS_TOKEN
* PUB_DEV_PUBLISH_REFRESH_TOKEN
* PUB_DEV_PUBLISH_TOKEN_ENDPOINT
* PUB_DEV_PUBLISH_EXPIRATION

> Use these exact same names to create your secrets because these names will be used in our workflow file as well. If you wish to change the names, then make sure you use the same names everywhere.
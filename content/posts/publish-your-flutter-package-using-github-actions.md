+++
author = "Birju Vachhani"
categories = ["Flutter"]
cover = ""
date = 2020-03-28T13:51:26Z
draft = true
tags = ["flutter", "github-actions", "dart", "flutter-package", "dart-package"]
title = "Publish Your Flutter/Dart Package using GitHub Actions"

+++
Howdy people! Recently I was exploring the internet to get some guidance on publishing [Flutter](https://flutter.dev/) or [Dart](https://dart.dev/) packages to [pub.dev](https://pub.dev "Pub Dev") via CI-CD servers. My primary goal was to use [GitHub Actions](https://github.com/features/actions) to do so. Unfortunately, I failed to get proper information on how can I achieve that. Then I decided to go by myself and I struggled a lot to get it working properly. So, I decided to write this easy and step-by-step guide to help others like me out there!

Here's what we're trying to achieve: We have a [Flutter](https://flutter.dev/)/[Dart](https://dart.dev/) package that we want to publish on [pub.dev](https://pub.dev "Pub Dev") whenever we create a new release on [GitHub](https://github.com) or push code to the master branch. Sounds easy? Let me tell you, it wasn't. Here's what we're going to need.

## Requirements

1. A Flutter package ready to be published.
2. An active account on [pub.dev](https://pub.dev)
3. A repository on [GitHub](https://github.com) with admin access.
4. A working laptop, internet connection, and some patience!

Here's what we are going to do in order to achieve what we want.

## Steps

1. Retrieve Login Credentials for [pub.dev](https://pub.dev)
2. Create Secrets on [GitHub](https://github.com)
3. Write a shell script to set credentials
4. Create a workflow for GitHub Action to publish a package.
5. Triggering Builds.

I did some research on how `pub publish` command works. When we run this command in our terminal for the first time, `pub` would ask us to log in to our [pub.dev](https://pub.dev "Pub Dev") account by opening the URL printed on the command line. Once we log in using that URL, `pub` store some login credentials(which happens to be some tokens) into a file called `credentials.json`.

Next time when you run `pub publish` command, it checks for this file and proceeds further without asking for login again. This gave me a hint that to make it work on CI-CD servers, we need to create this file somehow on the build machine.

Follow this easy guide to setup your GitHub actions to publish your packages.

## 1. Retrieve Login Credentials for pub.dev

Alright, we need some credentials to log in to [pub.dev](https://pub.dev "Pub Dev") via the command line. Here's how it looks like:

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

If you have already published your package before, you can easily find the required credentials for [pub.dev](https://pub.dev "Pub Dev") as you already have logged into your account. You can locate the file at following path:

##### Linux/Mac-OS

    ~/.pub-cache/credentials.json

##### Windows

    C:\Users\<USER>\AppData\Roaming\Pub\Cache\credentials.json

But if you're doing this for the first time and you haven't made any releases of your package on [pub.dev](https://pub.dev "Pub Dev"), these credentials won't be there!

Here's a workaround to get these credentials.

Run the following command:

> Note: Run this command only if this is your first release.

```shell
flutter pub uploader add <YOUR_EMAIL_HERE>
```

This will ask you to log in to your [pub.dev](https://pub.dev "Pub Dev") account. Do so by opening the link provided in the terminal. Once you log in successfully, you will be able to locate the `credentials.json` file. Keep this file handy. We'll need it in the next step.

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

The names self-explanatory to indicate which information from the `credentials.json` file to set for each secret.

## 3. Write a shell script to set credentials

Alright! Now that we have set up secrets on GitHub, we can use them in our workflow file. But before that, we need to create `credentials.json` file on the CI server in order for pub to log in. We're going to do this using a shell script. Now, we could do this by writing the whole script in our workflow file but that is kind of messy. So, we're going to keep that shell script in a file in our repository and we'll invoke it from our workflow file. This way you can reuse the script for other projects and it won't make your workflow file look messy.

Create a file in the root of your repository with the name `pub_login.sh`. Here's the script that we're going to put in that file.

```shell
# This script creates/updates credentials.json file which is used
# to authorize publisher when publishing packages to pub.dev

# Checking whether the secrets are available as environment
# variables or not.
if [ -z "${PUB_DEV_PUBLISH_ACCESS_TOKEN}" ]; then
  echo "Missing PUB_DEV_PUBLISH_ACCESS_TOKEN environment variable"
  exit 1
fi

if [ -z "${PUB_DEV_PUBLISH_REFRESH_TOKEN}" ]; then
  echo "Missing PUB_DEV_PUBLISH_REFRESH_TOKEN environment variable"
  exit 1
fi

if [ -z "${PUB_DEV_PUBLISH_TOKEN_ENDPOINT}" ]; then
  echo "Missing PUB_DEV_PUBLISH_TOKEN_ENDPOINT environment variable"
  exit 1
fi

if [ -z "${PUB_DEV_PUBLISH_EXPIRATION}" ]; then
  echo "Missing PUB_DEV_PUBLISH_EXPIRATION environment variable"
  exit 1
fi

# Create credentials.json file.
cat <<EOF > ~/.pub-cache/credentials.json
{
  "accessToken":"${PUB_DEV_PUBLISH_ACCESS_TOKEN}",
  "refreshToken":"${PUB_DEV_PUBLISH_REFRESH_TOKEN}",
  "tokenEndpoint":"${PUB_DEV_PUBLISH_TOKEN_ENDPOINT}",
  "scopes":["https://www.googleapis.com/auth/userinfo.email","openid"],
  "expiration":${PUB_DEV_PUBLISH_EXPIRATION}
}
EOF
```

The `if` conditions in the script check whether the secrets are available as environment variables or not and raises an error if not. The `cat` command finally creates and writes `credentials.json` at `~/.pub-cache/credentials.json`. We are going to use the ubuntu image for our workflow so that explains the path for credentials file.

Ideally, you don't need to make any changes to this script and you can reuse it directly for any other projects. But If you chose to use different names for secrets earlier then, you'll have to use those same names here.

Commit this file to your repository and push it to the master branch. We'll need this file when we run our workflow for GitHub actions.

## 4. Create a workflow for GitHub Action to publish a package

Finally, we now need to create a workflow for our publishing process. Open your repository and create this file `.github\workflows\publish.yml`.

Here's the workflow for your dart package:

#### Dart workflow

```yaml
name: Publish Package

on:
  release:

jobs:
  build:
    runs-on: ubuntu-latest

    container:
      image:  google/dart:latest

    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: pub get
      - name: Run tests
        run: pub run test
      - name: Setup Pub Credentials
        shell: bash
        env:
          PUB_DEV_PUBLISH_ACCESS_TOKEN: ${{ secrets.PUB_DEV_PUBLISH_ACCESS_TOKEN }}
          PUB_DEV_PUBLISH_REFRESH_TOKEN: ${{ secrets.PUB_DEV_PUBLISH_REFRESH_TOKEN }}
          PUB_DEV_PUBLISH_TOKEN_ENDPOINT: ${{ secrets.PUB_DEV_PUBLISH_TOKEN_ENDPOINT }}
          PUB_DEV_PUBLISH_EXPIRATION: ${{ secrets.PUB_DEV_PUBLISH_EXPIRATION }}
        run: |
          sh ./pub_login.sh
      - name: Check Publish Warnings
        run: pub publish --dry-run
      - name: Publish Package
        run: pub publish -f
```

Use this workflow only if your package is a dart package, not a flutter package. For Flutter packages, use following workflow:

#### Flutter workflow

```yaml
jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v1
      - name: Install Flutter
        uses: subosito/flutter-action@v1
        with:
          flutter-version: '1.9.1+hotfix.6'
      - name: Install dependencies
        run: flutter pub get
      - name: Analyze
        run: flutter analyze
      - name: Run tests
        run: flutter test
      - name: Setup Pub Credentials
        shell: bash
        env:
          PUB_DEV_PUBLISH_ACCESS_TOKEN: ${{ secrets.PUB_DEV_PUBLISH_ACCESS_TOKEN }}
          PUB_DEV_PUBLISH_REFRESH_TOKEN: ${{ secrets.PUB_DEV_PUBLISH_REFRESH_TOKEN }}
          PUB_DEV_PUBLISH_TOKEN_ENDPOINT: ${{ secrets.PUB_DEV_PUBLISH_TOKEN_ENDPOINT }}
          PUB_DEV_PUBLISH_EXPIRATION: ${{ secrets.PUB_DEV_PUBLISH_EXPIRATION }}
        run: |
          sh ./pub_login.sh
      - name: Check Publish Warnings
        run: pub publish --dry-run
      - name: Publish Package
        run: pub publish -f
```

Let's talk about the common part first.

1. `on:` defines when to run the workflow. I want my workflow to run when I create a new release on GitHub. You can set it according to your requirements. Here's an example:

```yaml
on:
  pull_request:
    branches:
      - master
  push:
    branches:
      - master
```

1. We're using `ubuntu-latest` as OS for our CI server. It makes it easy to run shell scripts.
2. Notice the `Setup Pub Credentials` step which sets environment variables for our little shell script and then runs our script stored in `pub_login.sh` file.
3. `Check Publish Warnings` step ensures that there's no error publishing your package by running `pub publish --dry-run` command.
4. `Publish Package` step will publish your package to [pub.dev](https://pub.dev "Pub Dev")

#### Dart Workflow:

* `google/dart:latest` container image will provide us with lastest dart installation.
* For a dart package, we use `pub` commands to install dependencies and run tests before proceeding for the publishing process.

#### Flutter Workflow:

* Step `Install Flutter` will install Flutter SDK with given `flutter-version`. Feel free to use the latest version or the one that suits you.
* For a Flutter package, we'll use `flutter` commands instead of `pub` commands to install dependencies, run tests and, analyze the source code.

Save your workflow file and push it to the master branch on your GitHub repository.

## 5. Triggering Builds

That's it! All the setup is done. Now all you need to do is trigger a build. Triggering a build depends on how did you set up the workflow like `on pull_request`, `on push` or `on release`. Once that event happens, it will trigger a build and if everything goes right, your package will be published to [pub.dev](https://pub.dev "Pub Dev").

Thanks for reading! If you liked what you read or learnt, don't forget to share! Happy coding folks!
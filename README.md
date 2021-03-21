<img src="/images/whatsDapp.png" width="100" height="100">

# WhatsDapp UI Example

Reference chat GUI implementation for the [WhatsDapp](https://github.com/realKidDouglas/whatsdapp-lib) Secure Messaging Library.

# Overview 

- [Requirements](#requirements)
- [Install](#install)
  * [Installing the WhatsDapp library](#installing-the-whatsdapp-library)
  * [Installing GUI-Prototype (whatsdapp-ui-example)](#installing-gui-prototype--whatsdapp-ui-example-)
- [Registration and Login](#registration-and-login)
- [Troubleshooting](#troubleshooting)
  * [You cannot write to yourself](#you-cannot-write-to-yourself)
  * [Burned Identities](#burned-identities)
  * [Reset Local Storage](#reset-local-storage)
  * [High CPU Usage on macOS](#high-cpu-usage-on-macos)
  * [Foreman on macOS](#foreman-on-macos)
- [Sources](#sources)


# Requirements
 - node v12+
 - npm v6+

Also you need a mnemonic with some tDash (v0.18). 
Herefore you can go through these steps:
 1. Getting a HD-Wallet with mnemonic you
    - either follow this tutorial: [Create and Fund a Wallet](https://dashplatform.readme.io/docs/tutorial-create-and-fund-a-wallet).
    - or easily create and manage wallet with [EvoWallet](http://evowallet.io) or [Chrome Wallet](https://github.com/readme55/Dash-Chrome-Wallet).
 2. Get some tDash from [faucet](https://testnet-faucet.dash.org) and wait a few minutes until it's mined.
 
WhatsDapp creates and tops up an Identity and optionally registers a DPNS name for you automatically in the [registration tab](#registration-and-login).
But you can use your existing ones or create on your own by following these tutorials.

 1. [Register an Identity](https://dashplatform.readme.io/docs/tutorial-register-an-identity) and
 2. [Topup an Identity's Balance](https://dashplatform.readme.io/docs/tutorial-topup-an-identity-balance): 
 	So you will be able to write to the Dash Drive.
 3. [Register a Name for an Identity](https://dashplatform.readme.io/docs/tutorial-register-a-name-for-an-identity): 
 	This way you can be found by others in the messenger.

# Install

Run the install-script

    sh install.sh

and start messenger: 

    npm run dev

If this won't work choose the following long way ;)

## Installing the WhatsDapp library

Clone WhatsDapp-Lib:

    git submodule update --init

Install:

    cd whatsdapp-lib
    npm ci
    npm rebuild grpc --runtime=electron --target=v10.1.4
    npm run dist

In case of error redo easily with:

    rm -rf node_modules dist && \
        npm ci && \
        npm rebuild grpc --runtime=electron --target=v10.1.4 && \
        npm run dist

(We will get rid of the Electron dependency in WhatsDapp-lib soon.)

## Installing GUI-Prototype (whatsdapp-ui-example)

Install:

    npm ci
    npm ci grpc --runtime=electron --target=v10.1.4
    
In case of error redo easily with:
    
    rm -rf node_modules && \
        npm ci && \
        npm ci grpc --runtime=electron --target=v10.1.4

Run messeger:

    npm run dev

When React code is changed while the app is running, the app updates immediatly after saving.
Chrome Dev Tools can be opened by pressing F12 (check if enableDevTools = true in electron-starter.js).

Sometimes the node process is not killed properly, consumes CPU and blocks used port. 
Find it by `ps aux | grep node` and `kill` corresponding PID.

# Registration and Login

On first start use the Registration tab and type in your mnemonic.

<details><summary>Show registration screenshot</summary>
	<img src="/images/whatsDapp_registration.png">
</details>

If you want to use an *existing identity* check "Custom Identity Address" and type in identity.
If this identity already has a DPNS name leave "Username" empty.

If you want WhatsDapp to create an identity for you just type in your wish-DPNS name in "Username".
WhatsDapp will follow the Dash tutorials mentioned above and creates an identity, tops up with 1000 duffs and registers the DPNS name.

The "Display Name" can be same as your DPNS but doesn't have to. 
This is your WhatsDapp internal name.
It will be used for displaying contacts/messages.

The "Password" is used to encrypt your local storage. 
So the next time you use WhatsDapp, you'll only have to type this password to login.

<details><summary>Show login screenshot</summary>
	<img src="/images/whatsDapp_login.png">
</details>

Be patient... 
Your WhatsDapp profile will be created and uploaded containing your key-bundles for session-setup.

You'll be forwarded to a message window.
Here you can search for a DPNS name and add to your conversations (receiver also needs to upload a WhatsDapp profile in first place, too). 

Now start secure chatting over the blockchain ;)
Be patient again... 
Sent messages will be shown *after* they arrived at the blockchain implying success.

<details><summary>Show chat screenshot</summary>
	<img src="/images/whatsDapp_chat.png">
</details>

If you're interested in, you can find your encrypted messages with the [Dash Platform Explorer](https://pce.cloudwheels.net).
You can find our contract containing `receiverId`, timestamps and content of your messages.
The content is a base64 encoded JSON-object containing signal-encrypted message.

# Troubleshooting

## You cannot write to yourself

If you want to chat with yourself, just don't ;) 
Actually it will crash for decryption reasons.

Also it is not possible to run the application multiple times on the same system because it needs one exclusive port.
You need to use **two different** OS's.

## Burned Identities

At this point if some trouble occurs, easiest way to get rid of it is to create a new Dash identity and DPNS name.
Try another login with this new identity.
But before you also should reset local storage.

## Reset Local Storage

For using another login just remove your local storage folder.

Linux: `"~/.config/whatsdapp-ui-example"`

macOs: `"~/Library/Application Support/whatsdapp-ui-example"`

Windows: `"%AppData%/whatsdapp-ui-example"`


## High CPU Usage on macOS
It occurs that Electron and consequently WhatsDapp consumes one CPU to 100% even if nothing seems to happen.
This leads back to file-watching issue of `node.js`.
A better notification-service is implemented in [`FSEvents`](https://www.npmjs.com/package/fsevents).

In WhatsDapp-UI folder run:

	npm install fsevents

A bit more info [here](https://til.codes/fix-for-100-cpu-usage-by-nodejs/).


## Foreman on macOS
There is a issue on foreman for macOS, more information [here](https://stackoverflow.com/questions/45422184/heroku-local-on-exit-null-throws-err-unknown-signal-error/49716045#49716045).
To fix this, go into `package.json` and replace line
	
	"foreman": "^2.0.0",

by 

	"@heroku/foreman": "^2.0.0",
 

# Sources

Based on:
* https://github.com/mui-org/material-ui
* https://github.com/facebook/react
* https://github.com/electron/electron
* https://github.com/csepulv/electron-with-create-react-app

Helped us understanding:
* https://github.com/pusher/electron-desktop-chat 

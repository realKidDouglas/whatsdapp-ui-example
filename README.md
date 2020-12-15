# WhatsDapp UI Example

Electron-based chat GUI as a reference implementation of the WhatsDapp Secure Messaging Library.

# Overview

- [Requirements](#requirements)
- [Install](#install)
  * [Installing the WhatsDapp library](#installing-the-whatsdapp-library)
  * [Installing GUI-Prototype (whatsdapp-ui-example)](#installing-gui-prototype--whatsdapp-ui-example-)
- [Login](#login)
- [Reset Local Storage](#reset-local-storage)
- [Sources](#sources)


# Requirements
 - node v12+
 - npm v6+

Also you need a Dash Identity with some credits. Herefore you can go through these steps/tutorials:
 1. [Create and Fund a Wallet](https://dashplatform.readme.io/docs/tutorial-create-and-fund-a-wallet): Getting a HD-Wallet with mnemonic.
 2. Get some and some eDash from [faucet](http://faucet.evonet.networks.dash.org) and wait a few minutes until it's mined.
 3. [Register an Identity](https://dashplatform.readme.io/docs/tutorial-register-an-identity) and
 4. [Topup an Identity's Balance](https://dashplatform.readme.io/docs/tutorial-topup-an-identity-balance): 
 	So you will be able to write to the Dash Drive.
 5. [Register a Name for an Identity](https://dashplatform.readme.io/docs/tutorial-register-a-name-for-an-identity): 
 	This way you can be found by others in the messenger.

We will need the **mnemonic** and the **identity** for whatsdapping.

# If you use MacOS
There is a issue on foreman for MacOS, for more information look at [link](https://stackoverflow.com/questions/45422184/heroku-local-on-exit-null-throws-err-unknown-signal-error/49716045#49716045).
To fix this, go into package.json and replace "foreman" by "@heroku/foreman"

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
    npm install
    npm rebuild grpc --runtime=electron --target=v10.1.4
    npm run dist

In case of error redo easily with:

    rm -rf node_modules dist package-lock.json && \
        npm install && \
        npm rebuild grpc --runtime=electron --target=v10.1.4 && \
        npm run dist

(We will get rid of the Electron dependency in WhatsDapp-lib soon.)

## Installing GUI-Prototype (whatsdapp-ui-example)

Install:

    npm install
    npm install grpc --runtime=electron --target=v10.1.4
    
In case of error redo easily with:
    
    rm -rf node_modules package-lock.json && \
        npm install && \
        npm install grpc --runtime=electron --target=v10.1.4

Run messeger:

    npm run dev

When React code is changed while the app is running, the app updates immediatly after saving.
Chrome Dev Tools can be opened by pressing F12 (check if enableDevTools = true in electron-starter.js).

Sometimes the node process is not killed properly, consumes CPU and blocks used port. 
Find it by `ps aux | grep node` and `kill` corresponding PID.

# Login

Type in your **mnemonic** and **identity** (be careful to type in correctly. There is currently no plausibility-check).
The **displayname** is can be same as your DPNS but doesn't have to. 
It will be used later for displaying contacts/messages.

Be patient... Your WhatsDapp profile will be created and uploaded containing your key-bundles for session-setup.

You'll be forwarded to a message window.
Here you can search for a DPNS name and add to your conversations. 

Now start secure chatting over the blockchain ;)

# Reset Local Storage

For using another login just remove your local storage folder.

Linux: `"~/.config/whatsdapp-ui-example"`

macOs: `"~/Library/Application Support/whatsdapp-ui-example"`

Windows: `"%AppData%/whatsdapp-ui-example"`


# Sources

Based on
* https://github.com/pusher/electron-desktop-chat 
* https://github.com/csepulv/electron-with-create-react-app
* https://github.com/connors/photon

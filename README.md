# WhatsDapp UI Example

Electron-based chat GUI using the WhatsDapp Secure Messaging Library.

# Overview

- [Usage](#usage)
  * [Requirements](#requirements)
  * [Installing WhatsDapp library](#installing-whatsdapp-library)
  * [Installing GUI-Prototype (messenger-dapp-gui-prototype)](#installing-gui-prototype--messenger-dapp-gui-prototype-)
  * [Login](#login)
  * [Reset Local Storage](#reset-local-storage)
- [Sources](#sources)

# Usage

## Requirements
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

## Installing WhatsDapp library

Clone WhatsDapp:

    git clone XXX && \
        cd XXX

Install:

    npm install
    npm rebuild grpc --runtime=electron --target=v10.1.4
    npm run dist

In case of error redo easily with:

    rm -rf node_modules dist package-lock.json && \
        npm install && \
        npm rebuild grpc --runtime=electron --target=v10.1.4 && \
        npm run dist

(We will get rid of the Electron dependency in WhatsDapp-lib soon.)

## Installing GUI-Prototype (messenger-dapp-gui-prototype)

Clone GUI-Prototype (folders `whatsdapp` and `messenger-dapp-gui-prototype` need to be next to each other!):

    git clone XXXX && \
        cd XXXX

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

## Login

Type in your **mnemonic** and **identity** (be careful to type in correctly. There is currently no plausibility-check).
The **displayname** is can be same as your DPNS but doesn't have to. 
It will be used later for displaying contacts/messages.

Be patient... Your WhatsDapp profile will be created and uploaded containing your key-bundles for session-setup.

You'll be forwarded to a message window.
Here you can search for a DPNS name and add to your conversations. 

Now start secure chatting over the blockchain ;)

## Reset Local Storage

For using another login just remove your local storage folder.

Linux: `"~/.config/messenger-dapp-gui-prototype"`

macOs: `"~/Library/Application Support/messenger-dapp-gui-prototype"`

Windows: `"%AppData%/messenger-dapp-gui-prototype"`


# Sources

Based on
* https://github.com/pusher/electron-desktop-chat 
* https://github.com/csepulv/electron-with-create-react-app
* https://github.com/connors/photon

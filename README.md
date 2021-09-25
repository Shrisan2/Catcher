# Catcher

Windows users must use Windows Subsystem for Linux (WSL 2) to run expo commands. Follow the installation guide [here](https://docs.microsoft.com/en-us/windows/wsl/install-win10). For the distribution we recommend using Ubuntu 20.04 from the Windows Store.

## Installing Expo

Install npm.

> Follow [these](https://docs.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-wsl#install-nvm-nodejs-and-npm) instructions for installing Node.js on WSL.

After installing npm, get the Expo CLI: ```npm install -g expo-cli``` (or ```yarn global add expo-cli```)

## How to run the Expo project (instructions are untested)

In the "catcher-frontend" directory, run the following command to start Expo on your machine: ```expo start```

> WSL users (Windows) might need to run Expo using the tunnel host instead of the default LAN: ```expo start --tunnel```

Expo will generate a QR code and open the local dev server in a web browser. You can scan the QR code on you mobile device to open the app package in the Expo Go app.

Currently, the Live Reload feature may not work properly when using WSL.

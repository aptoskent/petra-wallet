[//]: # 'Copyright (c) Aptos'
[//]: # 'SPDX-License-Identifier: Apache-2.0'

# Petra Wallet - Android / iOS (React Native)

## Setup React Native Enviroment

**You can follow the react native setup guide [here](https://reactnative.dev/docs/environment-setup)**

Some problems we've run into on iOS

- `watchman`: `brew install watchman` sometimes has issues. You can install with ports [here](https://ports.macports.org/port/watchman/)
- `pod install`: M1 Macs sometimes have problems with cocoapods. `sudo arch -x86_64 gem install ffi` and `arch -x86_64 pod install`

## Running the App

### Android:

`yarn android`

### iOS

If first run or pods have been updated:

1. `cd ios`
2. `pod install`

`yarn ios`

If you encounter an error: `No simulator available with name "iPhone 13".`, you can explicitly set the simulator with the `--simulator` flag: `yarn ios --simulator='iPhone 14 Pro Max'`

## Petra Wallet - iOS Deploy to Testflight

Download `.env.default` and `signing-cert.p12` from https://aptos-labs.1password.com/vaults/26bcallqylndymt7zqjr4eixgy/allitems/lnmpqvfmftfyxmdiao32kmd7re

put  `.env.default` in `mobile/ios/fastlane` folder and `signing-cert.p12` in `mobile/ios` folder
in root directory, run 

```
yarn install
yarn generate
```

in `mobile` directory, run 

```
yarn bundle:ios
cd ios
pod cache clean --all && arch -x86_64 pod install
bundle install
yarn ios:deploy 
```

## Linting

```bash
# Autofix all linting issues
yarn lint --fix
```

## Common Troubleshooting Steps

Sometimes you'll run into an issue with a new package install, or switching branches that have different sets of dependencies. There might be some additional steps required to get back to proper functionality. I'd recommend trying these in the following order (order is increasing amount of time they take). There is no perfect solution, so feel free to skip over steps if you don't think it will work or is unrelated.

#### Automated Approach

If you are running luinx or osx, you can run the `troubleshoot_react_native.sh` script loacated in the root of this repository. It prompts you to execute the following steps, allowing you to choose which option to try. From the root of this repository, run the following steps:

```bash
# Makes the script executable for all users on your device
chmod +x troubleshoot_react_native.sh

# Execute the script from the base of the repository
./troubleshoot_react_native.sh
```

#### Package Cache issues: (troubleshoot step 0)

There are several caches in use when developing a react-native app: `watchman`, `react-native cache`, `yarn cache`

How to know if you have a caching problem:

1. metro bundler can't find the right files (even though you know they are there)
2. old versions of something are oddly being required even though they don't exist
3. general red screen issue

Steps:

1. `watchman watch-del-all`
2. `yarn remove-node-modules` - deletes all our project's node_modules (requires `yarn install && yarn build`)
3. `yarn react-native start --reset-cache` - restarts metro with a clean cache

#### Monorepo issues: (troubleshoot step 1)

Sometimes a new dependency can cause build issues (when running `yarn build`). You might have to remove all the `node_modules` from each different app and package and do a fresh `yarn install` followed by yarn build.

#### React Native - Pod issues: (troubleshoot step 2)

Pods can get messed up with new `yarn install`s. Try the following steps **with Xcode CLOSED**.

`cd apps/mobile/ios`

`rm -rf Pods`

`rm -rf build`

`rm Podfile.lock`

followed by reinstalling pods:

`pod install`

and then opening your xcworkspace:

`open Petra\ Wallet.xcworkspace`

This will take a minute to re-index all your files, but then the build & run button might resolve your issue.

#### React Native - Unknown issue: (troubleshoot step 3)

If you've tried other troubleshooting steps and still get red screen issues, try removing your Derived Data. Derived Data stores all kinds of intermediate build results, generated indexes, etc.

`cd /Users/<your alias>/Library/Developer/Xcode/DerivedData/`

You'll see something like:
`Petra_Wallet-aoevdldpfwrdgfgxcenrorlsvyiz`

Then you can: `rm -rf <the derived data>`

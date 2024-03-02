# Petra Wallet - Android / iOS e2e test set up

### Set up (do this first thing)

```
brew install fastlane
npm install -g appium@next
appium plugin install execute-driver
appium driver install xcuitest
appium driver install uiautomator2
appium -pa /wd/hub --use-plugins execute-driver
```

### Run test locally:

Ensure there exists binary file Petra Wallet.app and Petra Wallet.apk in apps/mobile/ios/build and apps/mobile/android/build directory

If there isn't, generate these binary files by

First download `.env.default` and `signing-cert.p12` and `gc_keys.json` from https://aptos-labs.1password.com/vaults/26bcallqylndymt7zqjr4eixgy/allitems/lnmpqvfmftfyxmdiao32kmd7re

put `.env.default` and `gc_keys.json` in `mobile/ios/fastlane` folder and `signing-cert.p12` in `mobile/ios` folder

iOS:

run

```
yarn install
yarn generate
cd apps/mobile
pod install
yarn bundle:ios
cd ios
bundle exec fastlane build_simulator
cp ./build/Build/Products/Debug-iphonesimulator/Petra\ Wallet.app ./build
```

Android:

run

```
yarn install
yarn generate
cd apps/mobile/android
bash ./gradlew assembleRelease
cp ./app/build/outputs/apk/release/app-release.apk ./build/Petra-Wallet.apk
```

In one tab, run `appium -p 4723 --base-path /wd/hub`
In another tab, run `yarn react-native start`
In another tab, run `yarn ios:test` or `yarn android:test` in `apps/mobile/` directory

To run a specific test run `yarn ios:test --spec path-to-spec-file` or `yarn android:test --spec path-to-spec-file`

### Run ci test on Browserstack:

Ensure .env file with BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY is in apps/mobile/e2e/config folder

#### iOS

run

```
yarn install
yarn generate
cd apps/mobile
pod install
yarn bundle:ios
cd ios
bundle exec fastlane build_upload_browserstack
```

Get the BROWSERSTACK_APP_ID from the terminal. It should begin with bs://...
Replace process.env.BROWSERSTACK_IOS_APP_ID in wdio.ios.bs.app.conf.ts with BROWSERSTACK_APP_ID obtained earlier

To run iOS test on Browserstack run `yarn ios.ci:test` from apps/mobile/e2e

#### Android

run

```
yarn install
yarn generate
cd apps/mobile
cd android
bundle exec fastlane build_debug_upload_browserstack
```

Get the BROWSERSTACK_APP_ID from the terminal. It should begin with bs://...
Replace process.env.BROWSERSTACK_IOS_APP_ID in wdio.android.bs.app.conf.ts with BROWSERSTACK_APP_ID obtained earlier

To run Android test on Browserstack run `yarn android.ci:test`

Optional: install https://github.com/appium/appium-inspector

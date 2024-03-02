#!/bin/bash

confirm() { read -sn 1 -p "$* [y/N]? "; [[ ${REPLY:0:1} = [Yy] ]]; }


clear
echo "--- Make sure you are running this from the root directory ---"

if confirm "(1/5) Clear watchman"; then
	echo
	echo --- Clearing watchman ---
	watchman watch-del-all
fi

echo
if confirm "(2/5) Remove and reinstall node modules?"; then
	echo
	echo --- Removing node modules ---
	yarn remove-node-modules

	echo --- Installing modules ---
	yarn install

	echo --- Building the project ---
	yarn build
fi


echo
if confirm "(3/5) Clear derived Xcode data?"; then
	echo
	echo --- Clearing derived data ---
	cd ~/Library/Developer/Xcode/DerivedData
	rm -rf Petra_Wallet-*
	cd -
fi

echo
if confirm "(4/5) Remove and reinstall cocoapods?"; then
	echo
	echo --- Killing Xcode ---
	killall Xcode

	echo --- Removing Pods ---
	cd apps/mobile/ios
	rm -rf Pods build Podfile.lock

	echo --- Installing Pods ---
	pod install

	echo --- Opening the project in Xcode ---
	open Petra\ Wallet.xcworkspace
	cd -
fi

echo
if confirm "(5/5) Clear react native cache and start server?"; then
	echo
	echo --- moving to apps/mobile  ---
	cd apps/mobile
	echo --- Clearing RN cache and starting the server ---
	yarn react-native start --reset-cache
fi

echo
echo
echo "If your problems persist, in your simulator menu, run 'Device > Erase all content and settings...'"
echo "--- All Done ---"

fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

### upload_debug_browserstack

```sh
[bundle exec] fastlane upload_debug_browserstack
```

Upload Debug APK to BrowserStack

### upload_release_browserstack

```sh
[bundle exec] fastlane upload_release_browserstack
```

Upload Debug APK to BrowserStack

### set_browserstack_app_id

```sh
[bundle exec] fastlane set_browserstack_app_id
```

Set BROWSERSTACK_APP_ID to Github env variable for e2e testing

### build_apk_release

```sh
[bundle exec] fastlane build_apk_release
```

Build APK

### build_apk_debug

```sh
[bundle exec] fastlane build_apk_debug
```

Build APK for Debug

### build_debug_upload_browserstack

```sh
[bundle exec] fastlane build_debug_upload_browserstack
```

Build Debug APK & Upload BrowserStack

### build_release_upload_browserstack

```sh
[bundle exec] fastlane build_release_upload_browserstack
```

Build Debug APK & Upload BrowserStack

### build_aab

```sh
[bundle exec] fastlane build_aab
```

Build AAB

### deploy_internal

```sh
[bundle exec] fastlane deploy_internal
```

Deploy a new version to the Google Play Store for Internal Testing

### deploy_beta

```sh
[bundle exec] fastlane deploy_beta
```

Deploy a new version to the Google Play Store for Beta Testing

### deploy_alpha

```sh
[bundle exec] fastlane deploy_alpha
```

Deploy a new version to the Google Play Store for Alpha Testing

### deploy_production

```sh
[bundle exec] fastlane deploy_production
```

Deploy a new version to the Google Play Store for Production

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).

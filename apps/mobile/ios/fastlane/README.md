fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

### set_up_xcode

```sh
[bundle exec] fastlane set_up_xcode
```

Set XCode Version

### load_asc_api_key

```sh
[bundle exec] fastlane load_asc_api_key
```

Load App Store Connect API Key information to use in subsequent lanes

### fetch_and_increment_version_number

```sh
[bundle exec] fastlane fetch_and_increment_version_number
```

Bump version number based on most recent TestFlight version number

### fetch_and_increment_build_number

```sh
[bundle exec] fastlane fetch_and_increment_build_number
```

Bump build number based on most recent TestFlight build number

### certificates

```sh
[bundle exec] fastlane certificates
```

Get certificates

### generate_new_certificates

```sh
[bundle exec] fastlane generate_new_certificates
```

Generate new certificates

### setup_certificate_and_provision_profiles

```sh
[bundle exec] fastlane setup_certificate_and_provision_profiles
```

Setup certificates

### delete_create_keychain

```sh
[bundle exec] fastlane delete_create_keychain
```

Remove and create keychain

### prepare_signing

```sh
[bundle exec] fastlane prepare_signing
```

Installs signing certificate in the keychain and downloads provisioning profiles from App Store Connect

### build

```sh
[bundle exec] fastlane build
```

Build the iOS app for release

### upload_testflight

```sh
[bundle exec] fastlane upload_testflight
```

Upload to TestFlight / App Store Connect

### upload_browserstack

```sh
[bundle exec] fastlane upload_browserstack
```

Upload to BrowserStack

### delete_uploaded_file_in_browserstack

```sh
[bundle exec] fastlane delete_uploaded_file_in_browserstack
```

Delete uploaded file from BrowserStack once finished

### set_browserstack_app_id

```sh
[bundle exec] fastlane set_browserstack_app_id
```

Set BROWSERSTACK_APP_ID to Github env variable for e2e testing

### build_simulator

```sh
[bundle exec] fastlane build_simulator
```

Build for simulator

### build_release

```sh
[bundle exec] fastlane build_release
```

Build the release

### build_upload_testflight_browserstack

```sh
[bundle exec] fastlane build_upload_testflight_browserstack
```

Build and upload the release to App Store Connect & BrowserStack

### build_upload_testflight

```sh
[bundle exec] fastlane build_upload_testflight
```

Build and upload to TestFlight / App Store Connect

### build_upload_browserstack

```sh
[bundle exec] fastlane build_upload_browserstack
```

Build and upload to BrowserStack

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).

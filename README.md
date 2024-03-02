# Wallet Monorepo

This monorepo uses turborepo. We use [Yarn](https://classic.yarnpkg.com/lang/en/) as a package manager. It includes the following packages/apps:

### MacOS and Xcode Version Requirements

We should all always try to be on same operating systems and versions of xcode otherwise we may need incompatible (with others) changes to continue development.

#### As of 4/20/23:

MacOS: Ventura 13.0

Xcode: 14.3 ([Download](https://developer.apple.com/download/all/?q=Xcode%2014.3))

### Getting started

1. Clone the repo
2. run `yarn install` from the root directory
3. `yarn start` or `yarn dev` in the sub-directory of your choice
4. Get VSCode and download the `eslint` extension
5. Access `settings.json` in VSCode and enable fix eslint on save

### Apps and Packages

#### Apps

- `dapp-example`: a Dapp example that interacts with our wallet
- `extension`: Our wallet browser extension
- `mobile`: Our mobile react-native wallet
- [coming soon] `website`: Our wallet website

#### Packages

- `ui`: a stub React component library shared by `extension`, `website`, and `mobile` applications
- `eslint-config`: `eslint` configurations
- `tsconfig`: `tsconfig.json`s used throughout the monorepo
- [coming soon] `utils`: shared logic for CRUD operations with accounts, transactions, and more

##### FYI

1. It's important that all packages that create react components (ie. UI) should have React in `devDependencies` or `peerDependencies`, otherwise the apps that install that package will have two conflicting copies of React.

### Build

To build all apps and packages, run the following command:

```
cd <ROOT_DIR>
yarn build
```

### Lint

To lint all apps and packages, run the following command:

```
cd <ROOT_DIR>
yarn lint
```

### Develop

To develop all apps and packages, run the following command:

```
cd <ROOT_DIR>
yarn dev
```

### Test

#### End-to-end (e2e) tests

We use [Playwright](https://playwright.dev/) for e2e tests. These tests run against the built version of the apps; therefore, it is necessary to build the apps before running Playwright. To build the apps and then run Playwright, run the following command:

```
cd <ROOT_DIR>
yarn e2e
```

### Remote Caching

Turborepo can use a technique known as [Remote Caching](https://turborepo.org/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup), then enter the following commands:

```
cd my-turborepo
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your turborepo:

```
npx turbo link
```

### Test Data

#### NFTs

To generate NFTs in your account on testnet. First, make sure there are funds in your account on testnet. One drip from the faucet should be enough.

```bash
# From the root of the repository
# Gives you the options of the tool.
yarn workspace @petra/generate-test-data mint-nft --help
# This will mint you one nft with a particular image
yarn workspace @petra/generate-test-data mint-nft --address <private_key> --image https://aptos.dev/img/nyan.jpeg
# This will mint you 6 random NFTs
yarn workspace @petra/generate-test-data mint-nft --address <private_key> --quantity 6
```

#### Testing with Statsig

See the statsig docs for additional useful information:

https://docs.statsig.com/client/reactNativeSDK#statsig-options

Notably, there is an option for `localMode`:

```
Pass true to this option to turn on Local Mode for the SDK, which will stop the SDK from issuing any network requests and make it only operate with only local overrides and cache.
```

`localMode` can be used in conjunction with `REACT_APP_STATSIG_LOCAL_OVERRIDES` to turn off network calls and rely on local variables to test different feature states.
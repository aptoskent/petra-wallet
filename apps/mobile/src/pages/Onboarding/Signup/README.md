[//]: # 'Copyright (c) Aptos'
[//]: # 'SPDX-License-Identifier: Apache-2.0'

## Sign Up Flow

Sign up is a 3 step process:

1. User generated password (SignUpPasswordEntry.tsx)
2. User shown mnemonic phrase (SignUpMnemonicDisplay.tsx)
3. User enters mnemonic phrase in correct order (SignUpMnemonicEntry.tsx)

Props (password - step 1 & mnemonic - step 2) are passed via react-navigation's navigation props.

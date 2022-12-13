# jb-sfcc-cred-cli

# Introduction

This is a CLI tool that helps you to encrypt and decrypt the [IntelliJ SFCC](https://plugins.jetbrains.com/plugin/13668-salesforce-b2c-commerce-sfcc-/) [B2C Credentials file](https://medium.com/@sergeybevzuk/intellij-sfcc-2022-3-is-available-now-453766b1ecf2#1e47).

# How to

You can run the `npm link` command before using this tool. This will allow you to directly run the `jb-sfcc-cred-cli` command in your command line directly.

```bash
yarn install
npm link
```
## Decrypt Credentials File to JSON File

```bash
# prior to an npm link
yarn decrypt -s "~/intellij-sfcc-credentials.creds" -t "~/intellij-sfcc-credentials.json" -k "12345--2210b196f067f24-7"

# after an npm link
jb-sfcc-cred-cli decrypt -s "~/intellij-sfcc-credentials.creds" -t "~/intellij-sfcc-credentials.json" -k "12345--2210b196f067f24-7"

# return access keys for a particular host
jb-sfcc-cred-cli decrypt -h abcd-001 -u user@salesforce.com
```

## Encrypt JSON File to Credentials File

```bash
# prior to an npm link
yarn encrypt -s "~/intellij-sfcc-credentials.json" -t "~/intellij-sfcc-credentials.creds" -k "12345--2210b196f067f24-7"

# after an npm link
jb-sfcc-cred-cli encrypt -s "~/intellij-sfcc-credentials.json" -t "~/intellij-sfcc-credentials.creds" -k "12345--2210b196f067f24-7"
```

## Commands ##

Use `jb-sfcc-cred-cli --help` or just `jb-sfcc-cred-cli` to get started and see the full list of commands available:

```bash
    Usage: jb-sfcc-cred-cli [options] [command]

  Options:
    -V, --version                                                   output the version number
    -h, --help                                                      output usage information

  Commands:
    decrypt [options]
    encrypt [options]
    help [command]     display help for command

  Environment:

    SFCC_INTELLIJ_CREDENTIALS_FILE           set path for `intellij-sfcc-credentials.creds` file (encrypted file)
    SFCC_INTELLIJ_JSON_FILE                  set path for `intellij-sfcc-credentials.json` file (decrypted file)
    SFCC_INTELLIJ_CREDENTIALS_KEY            secret key used to decrypt/encrypt credentials file
    SFCC_USERNAME                            SFCC user name/email address
```

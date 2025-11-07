#!/usr/bin/env node

'use strict';

const packageDetails = require('./package');
const program = require('commander');
const helper = require('./lib/helper');

process.title = packageDetails.name;
console.info(packageDetails.name, packageDetails.version);
console.info('');

program.version(packageDetails.version).description(packageDetails.description);

/**
 * Command that decrypts SFCC credentials file
 * @alias module:cli
 * @param {String} decrypt The command name
 */
program.command('decrypt')
    .description('decrypts intellij-sfcc-credentials.creds file')
    .option('-s, --source <key>', 'Path to intellij-sfcc-credentials.creds file.')
    .option('-t, --target <key>', 'Path to intellij-sfcc-credentials.json file.')
    .option('-k, --key <key>', 'The secret key to decrypt the file.')
    .option('-h, --host <key>', 'Optional. The host to retrieve access tokens for. Full name or just realm-instance (e.g.: abcd-001)')
    .option('-u, --username <key>', 'Optional. The username to retrieve access tokens for.')
    .action((options) => {
        const { source, target, key, host, username } = options;
        Promise.resolve().then(() => helper.decrypt(source, target, key, host, username))
            .then(({ decryptedJson, hostKeys }) => {
                if (hostKeys && Object.keys(hostKeys).length) {
                    console.info(`${JSON.stringify(hostKeys, null, 2)}`);
                } else {
                    console.info(`${decryptedJson}`);
                }
                process.exit(0);
            })
            .catch(e => {
                console.error(e);
                process.exit(-1);
            });
    });

/**
 * Command that encrypts and writes SFCC credentials file
 * @alias module:cli
 * @param {String} encrypt The command name
 */
program.command('encrypt')
    .description('encrypts intellij-sfcc-credentials.json file')
    .option('-s, --source <key>', 'The SFCC json file.')
    .option('-t, --target <key>', 'Path to intellij-sfcc-credentials.json file.')
    .option('-k, --key <key>', 'The secret key to encrypt the file.')
    .action((options) => {
        const { source, target, key } = options;
        Promise.resolve().then(() => helper.encrypt(source, target, key))
            .then(({ encryptedText }) => {
                console.info(`${encryptedText}`);
                process.exit(0);
            })
            .catch(e => {
                console.error(e);
                process.exit(-1);
            });
    });

// parse CLI arguments
program.parse(process.argv);

// output help message if no arguments provided
if (!process.argv.slice(2).length) {
    program.help();
}

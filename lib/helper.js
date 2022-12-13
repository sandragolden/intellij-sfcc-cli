'use strict';

const crypto = require('crypto');
const fs = require('fs');
require('dotenv').config();

const SECRET_KEY = process.env.SFCC_INTELLIJ_CREDENTIALS_KEY;
const CREDENTIALS_FILE = process.env.SFCC_INTELLIJ_CREDENTIALS_FILE;
const JSON_FILE = process.env.SFCC_INTELLIJ_JSON_FILE;
const USERNAME = process.env.SFCC_USERNAME;
const decrypt = (source, target, secretKey, host, username) => new Promise((resolve, reject) => {
    if (!source) source = CREDENTIALS_FILE;
    if (!target) target = JSON_FILE;
    if (!secretKey) secretKey = SECRET_KEY;
    if (!username) username = USERNAME;

    if (!fs.existsSync(source)) {
        reject(new Error(`The source file "${source}" does not exist. Aborting...`));
        return;
    }

    const encryptedText = Buffer.from(fs.readFileSync(source).toString(), 'base64');
    const cipher = crypto.createDecipheriv('aes-192-ecb', secretKey, null);
    const decryptedJson = Buffer.concat([cipher.update(encryptedText), cipher.final()]).toString('utf8');
    const hostKeys = {};

    // write to JSON file
    if (target) {
        fs.writeFileSync(target, decryptedJson);
    }

    if (host && decryptedJson) {
        if (!username) {
            reject(new Error('Please provide username of access key! Aborting...'));
            return;
        }
        const parsedJson = JSON.parse(decryptedJson);
        var account = null;

        if (parsedJson.accounts) {
            account = parsedJson.accounts.filter((acct) => acct.username === username)[0];
        }
        if (!account || !account.accessKeys) {
            reject(new Error(`Could not find access keys for account matching username of "${username}"! Aborting...`));
            return;
        }

        const accessKeys = account.accessKeys.filter((key) => key.username === username)[0];
        if (!accessKeys.keys) {
            reject(new Error(`Could not find access keys for account matching username of "${username}"! Aborting...`));
            return;
        }

        Object.keys(accessKeys.keys).forEach((hostKey) => {
            if (hostKey.includes(host)) {
                hostKeys[hostKey] = accessKeys.keys[hostKey];
            }
        });
    }

    resolve({
        decryptedJson,
        hostKeys
    });
});
const encrypt = (source, target, secretKey) => new Promise((resolve, reject) => {
    if (!source) source = JSON_FILE;
    if (!target) target = CREDENTIALS_FILE;
    if (!secretKey) secretKey = SECRET_KEY;

    if (!fs.existsSync(source)) {
        reject(new Error(`The source file "${source}" does not exist. Aborting...`));
        return;
    }

    const decryptedJson = fs.readFileSync(source).toString();
    const cipher = crypto.createCipheriv('aes-192-ecb', secretKey, null);
    const encryptedText = Buffer.concat([cipher.update(decryptedJson), cipher.final()]).toString('base64');

    // write to credentials file
    if (target) {
        fs.writeFileSync(target, encryptedText);
    }

    resolve({
        encryptedText
    });
});

module.exports.decrypt = decrypt;
module.exports.encrypt = encrypt;

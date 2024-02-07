// database.js
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function init() {
    const db = await open({
        filename: './mybotdb.sqlite',
        driver: sqlite3.Database
    });

    await db.exec('CREATE TABLE IF NOT EXISTS react_roles (message_id TEXT, emoji TEXT, role_id TEXT)');
    await db.exec('CREATE TABLE IF NOT EXISTS target_messages (channel_id TEXT, message_id TEXT)');

    return db;
}

module.exports = { init };
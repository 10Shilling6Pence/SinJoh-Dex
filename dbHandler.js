const sqlite3 = require('sqlite3').verbose(); // Import the SQLite3 library with verbose output
const db = new sqlite3.Database('./SinJohDexDB.sqlite'); // Connect to the existing database file

// Create tables if they don't exist
db.serialize(() => {
    // Create 'posted_posts' table to store post information
    db.run('CREATE TABLE IF NOT EXISTS posted_posts (id TEXT PRIMARY KEY, title TEXT, url TEXT)');
    // Create 'user_codes' table to store user game codes
    db.run('CREATE TABLE IF NOT EXISTS user_codes (discord_id TEXT, game TEXT, code TEXT, PRIMARY KEY (discord_id, game))');
    console.log('Ensured posted_posts and user_codes tables exist.'); // Log table creation/verification
});

// Function to insert a new post into the 'posted_posts' table
function insertNewPost(id, title, url) {
    return new Promise((resolve, reject) => {
        console.log(`Attempting to insert post with ID ${id}`); // Log the attempt to insert
        const stmt = db.prepare('INSERT INTO posted_posts (id, title, url) VALUES (?, ?, ?)');
        stmt.run(id, title, url, function (err) {
            if (err) {
                console.error('Error inserting post ID:', err); // Log any errors
                reject(err); // Reject the promise if there's an error
            } else {
                console.log(`Inserted post with ID ${id}`); // Log successful insertion
                resolve(); // Resolve the promise if successful
            }
        });
        stmt.finalize(); // Finalize the statement to free up resources
    });
}

// Function to check if a post exists in the 'posted_posts' table
function checkPostExists(id) {
    return new Promise((resolve, reject) => {
        console.log(`Checking if post with ID ${id} exists`); // Log the check attempt
        db.get('SELECT 1 FROM posted_posts WHERE id = ?', [id], (err, row) => {
            if (err) {
                console.error('Error checking post ID:', err); // Log any errors
                reject(err); // Reject the promise if there's an error
            } else {
                console.log(`Check result for post ID ${id}: ${!!row}`); // Log the result of the check
                resolve(!!row); // Resolve the promise with a boolean indicating existence
            }
        });
    });
}

// Function to register a user code in the 'user_codes' table
function registerUserCode(discordId, game, code) {
    return new Promise((resolve, reject) => {
        console.log(`Attempting to register code for user ${discordId}`); // Log the registration attempt
        // Prepare the SQL statement with conflict handling to update existing entries
        const stmt = db.prepare('INSERT INTO user_codes (discord_id, game, code) VALUES (?, ?, ?) ON CONFLICT(discord_id, game) DO UPDATE SET code=excluded.code');
        stmt.run(discordId, game, code, function (err) {
            if (err) {
                console.error('Error registering user code:', err); // Log any errors
                reject(err); // Reject the promise if there's an error
            } else {
                console.log(`Registered code for user ${discordId}`); // Log successful registration
                resolve(); // Resolve the promise if successful
            }
        });
        stmt.finalize(); // Finalize the statement to free up resources
    });
}

// Function to get user codes from the 'user_codes' table
function getUserCodes(discordId) {
    return new Promise((resolve, reject) => {
        console.log(`Fetching codes for user ${discordId}`); // Log the fetch attempt
        // Execute the query to fetch codes for the user
        db.all('SELECT game, code FROM user_codes WHERE discord_id = ?', [discordId], (err, rows) => {
            if (err) {
                console.error('Error fetching user codes:', err); // Log any errors
                reject(err); // Reject the promise if there's an error
            } else {
                console.log(`Fetched codes for user ${discordId}`); // Log successful fetch
                resolve(rows); // Resolve the promise with the fetched rows
            }
        });
    });
}

// Export the functions for use in other modules
module.exports = { insertNewPost, checkPostExists, registerUserCode, getUserCodes };

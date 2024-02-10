const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./SinJohDexDB.sqlite', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) console.log('Error opening database', err);
    else console.log('Database connected!');
});

// Initialize the table
db.run(`CREATE TABLE IF NOT EXISTS postedEntries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    postId TEXT UNIQUE,
    title TEXT,
    url TEXT,
    datePosted DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Function to insert a new post
function insertNewPost(postId, title, url) {
    console.log(`Inserting post: ${postId}.`)
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO postedEntries(postId, title, url) VALUES (?, ?, ?)`;
        db.run(query, [postId, title, url], function(err) {
            if (err) reject(err);
            else resolve(this.lastID);
        });
    });
}

// Function to check if a post already exists
function checkPostExists(postId) {
    console.log(`Checking if post exists: ${postId}`);
    return new Promise((resolve, reject) => {
        const query = `SELECT postId FROM postedEntries WHERE postId = ?`;
        db.get(query, [postId], (err, row) => {
            if (err) reject(err);
            else resolve(!!row);
        });
    });
}

module.exports = { insertNewPost, checkPostExists };

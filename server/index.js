// Import npm modules
const express = require('express');
const fs = require('fs').promises;
// const bcrypt = require('bcrypt');
const path = require('path');

// Intialize Parameters and Settings
const saltRounds = 10;


// Intialize the server application
const app = express();

const clientPath = path.join(__dirname, '..', 'client');
const dataPath = path.join(__dirname, 'data');
const serverPath = path.join(__dirname);

// Utility functions
// function encrypt(phrase) {
//     let encryptedPhrase = ""
//     bcrypt.genSalt(saltRounds, (err, salt) => {
//         console.log(`salt: ${salt}`);
//         bcrypt.hash(phrase, salt, (err, hash) => {
//             console.log(`hash: ${hash}`)
//             encryptedPhrase = hash;
//         });
//     });
//     return encryptedPhrase;
// }

// Intialize middleware
app.use(express.static(clientPath));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// URI endpoints

app.get('/', (req, res) => {
    res.sendFile('src/landing-page.html', { root: clientPath });
});
app.get('/landing-page.css', (req, res) => {
    res.sendFile('css/landing-page.css', { root: clientPath });
})


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    let password = "Hello world!"
    console.log(password, encrypt(password));
})
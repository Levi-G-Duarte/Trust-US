// Import npm modules
const express = require('express');
const fs = require('fs').promises;
const bcrypt = require('bcrypt');
const path = require('path');

// Intialize Parameters and Settings
const key = "$2b$10$0fiDpmLI1nW256wt1CpvZO";


// Intialize the server application
const app = express();

const clientPath = path.join(__dirname, '..', 'client');
const dataPath = path.join(__dirname, 'data');
const serverPath = path.join(__dirname);

// Utility functions

// Intialize middleware
app.use(express.static(clientPath));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// URI endpoints

app.get('/', (req, res) => {
    res.status(200).sendFile('src/landing-page.html', { root: clientPath });
});
app.get('/landing-page.css', (req, res) => {
    res.status(200).sendFile('css/landing-page.css', { root: clientPath });
});

app.get('/login', (req, res) => {
    res.status(200).sendFile('pages/login.html', { root: serverPath });
});
app.get('/login.css', (req, res) => {
    res.status(200).sendFile('css/login.css', { root: serverPath });
});

app.get('/home', (req, res) => {
    res.status(200).sendFile('pages/home.html', { root: serverPath });
});
app.get('/home.css', (req, res) => {
    res.status(200).sendFile('css/home.css', { root: serverPath });
});

app.get('/about', (req, res) => {
    res.status(200).sendFile('pages/about.html', { root: serverPath });
});
app.get('/about.css', (req, res) => {
    res.status(200).sendFile('css/about.css', { root: serverPath });
});

// Example Javascript for Endpoint:
// let req = await fetch("/login", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email: btoa("testuser"), password: btoa("1234") })
// });
// await req.text();
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await fs.readFile(`${dataPath}/users.json`, 'utf-8');
        user = JSON.parse(user);
        console.log(user, req.body);
        const userIndex = user.findIndex(user => user.email === email && user.password === password);
        if (userIndex != -1) {
            let client = user[userIndex];
            console.log(userIndex);
            res.status(200).send(`Successful!`);
        } else {
            res.status(404).send('File not Found');
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});


app.post('/signup', async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;
        console.log(req.body);
        res.status(200).send(`Successful! ${JSON.stringify(req.body)}`);
    } catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})
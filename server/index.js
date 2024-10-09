// Import npm modules
const { json } = require('body-parser');
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Intialize the server application
const app = express();

const clientPath = path.join(__dirname, '..', 'client');
const dataPath = path.join(__dirname, 'data');
const serverPath = path.join(__dirname);

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

// -- Example Javascript for Endpoint -- 
// let data = {email: "example@example.com", password: "admin"};
// Object.keys(data).forEach(item => {data[item] = btoa(data[item])});
// let req = await fetch("/login", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data)
// });
// let result = await req.text();
// sessionStorage.setItem('authCode', result);
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await fs.readFile(`${dataPath}/users.json`, 'utf-8');
        user = JSON.parse(user);
        const userIndex = user.findIndex(user => user.email === email);
        if (userIndex != -1) {
            let client = user[userIndex];
            if (password === client.password) {
                client.authCode = uuidv4();
                client.expiration = Math.floor(Date.now() / 1000)+3600;
                fs.writeFile(`${dataPath}/users.json`, JSON.stringify(user, null, 2));
                res.status(200).send(client.authCode);
            } else {
                res.status(409).send(`Incorrect password`);
            }
        } else {
            res.status(404).send('Account does not exist');
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});

//  -- Example Javascript for Endpoint --
// let data = {firstname: "first", lastname: "last", email: "example@example.com", password: "admin"};
// Object.keys(data).forEach(item => {data[item] = btoa(data[item])});
// let req = await fetch("/signup", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data)
// });
// await req.text();
app.post('/signup', async (req, res) => {
    try {
        let client = req.body;
        const { email } = client;
        let user = await fs.readFile(`${dataPath}/users.json`, 'utf-8') || JSON.stringify([]);
        user = JSON.parse(user);
        const userIndex = user.findIndex(user => user.email === email);
        if (userIndex === -1) {
            client.history = [];
            console.log(client);
            user.push(client);
            fs.writeFile(`${dataPath}/users.json`, JSON.stringify(user, null, 2));
            res.status(200).send(`Successful!`);
        } else {
            res.status(401).send(`User already exists`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});

app.get('/auth/:authCode', async (req, res) => {
    try {
        const {authCode} = req.params;
        let user = await fs.readFile(`${dataPath}/users.json`, 'utf-8');
        user = JSON.parse(user);
        const userIndex = user.findIndex(user => user.authCode === authCode);
        if (userIndex != -1) {
            let client = user[userIndex];
            if (client.expiration > Math.floor(Date.now()/1000)) {
                const {firstname, lastname, email, history} = client;
                res.status(200).send(JSON.stringify({firstname, lastname, email, history}));
            } else {
                res.status(403).send("Forbidden, Authcode has expired");
            }
        } else {
            res.status(400).send("Bad Request");
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
})

// Example Javascript for Endpoint
// let request = await fetch(`/auth/${sessionStorage.authCode}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({amount: 10})
// });
// let amount = await request.json();
app.put('/auth/:authCode', async (req, res) => {
    try {
        const {authCode} = req.params;
        const {amount} = req.body;
        if (amount != null) {
            console.log(authCode, amount);
            let user = await fs.readFile(`${dataPath}/users.json`, 'utf-8');
            user = JSON.parse(user);
            const userIndex = user.findIndex(user => user.authCode === authCode);
            if (userIndex != -1) {
                let client = user[userIndex];
                if (client.expiration > Math.floor(Date.now()/1000)) {
                    client.history.push(amount);
                    fs.writeFile(`${dataPath}/users.json`, JSON.stringify(user, null, 2));
                    res.status(200).send(JSON.stringify(client.history));
                } else {
                    res.status(403).send("Forbidden, Authcode has expired");
                }
            } else {
                res.status(400).send("Bad Request");
            }
        } else {
            res.status(422).send("Missing body parameter");
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
})

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
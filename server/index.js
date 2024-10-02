// Import npm modules
const express = require('express');
const fs = require('fs').promises;
const path = require('path');

// Intialize the server application
const app = express();

const clientPath = path.join(__dirname, '..', 'client/src');
const dataPath = path.join(__dirname, 'data');
const serverPath = path.join(__dirname);

// Intialize middleware
app.use(express.static(clientPath));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// URI endpoints

app.get('/', (req, res) => {
    res.sendFile('landing-page.html', { root: clientPath });
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})
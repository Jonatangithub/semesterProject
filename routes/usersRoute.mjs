import express, { response } from "express";
import User from "../modules/user.mjs";
import HttpCodes from "../modules/httpErrorCodes.mjs";
import fs from 'fs';

const USER_API = express.Router();

function generateRandomId(length) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    let randomId;

    do {
        randomId = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * alphabet.length);
            randomId += alphabet.charAt(randomIndex);
        }
    } while (users.some(user => user.id === randomId));

    return randomId;
}
let users = [];
try {
  const data = fs.readFileSync('users.json', 'utf8');
  users = JSON.parse(data);
} catch (err) {
  console.log('Error reading users file:', err.message);
}

function saveUsersToFile(req, res, next) {
    fs.writeFileSync('users.json', JSON.stringify(users), 'utf8', (err) => {
        if (err) {
            console.log('Error writing users file:', err.message);
            return res.status(HttpCodes.ServerSideErrorRespons.InternalServerError).send("Error saving users").end();
        }
        next();
    });
}
function checkUserExists(req, res, next) {
    const { email } = req.body;
    const exists = users.some(user => user.email === email);
    if (exists) {
        return res.status(HttpCodes.ClientSideErrorRespons.BadRequest).send("User already exists").end();
    }
    next();
}

// let generatedId = generateRandomId(10);

USER_API.get('/:id', (req, res) => {
    const userId = req.params.id;
    const user = users.find(user => user.id === userId);
    if (user) {
        res.status(HttpCodes.SuccesfullRespons.Ok).send(user).end();
    } else {
        res.status(HttpCodes.ClientSideErrorRespons.NotFound).send("User not found").end();
    }
});

USER_API.get('/', (req, res) => {
    res.status(HttpCodes.SuccesfullRespons.Ok).send(users).end();
});

USER_API.post('/', checkUserExists, saveUsersToFile, (req, res) => {
    const { name, email, password } = req.body;
    if (name && email && password) {
        const user = new User();
        user.name = name;
        user.email = email;
        user.id = generateRandomId(7);
        user.pswHash = password;
        users.push(user);
        res.status(HttpCodes.SuccesfullRespons.Ok).end();
        
    } else {
        res.status(HttpCodes.ClientSideErrorRespons.BadRequest).send("Missing data field").end();
    }
});

 USER_API.put('/:id', (req, res) => {
    const userId = req.params.id;
    const { name, email, password } = req.body;
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
        users[userIndex].name = name !== undefined ? name : users[userIndex].name;
        users[userIndex].email = email !== undefined ? email : users[userIndex].email;
        res.status(HttpCodes.SuccesfullRespons.Ok).send("User updated successfully").end();
    } else {
        res.status(HttpCodes.ClientSideErrorRespons.NotFound).send("User not found").end();
    }
});


USER_API.delete('/:id', (req, res) => {

    const userId = req.params.id;

    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        saveUsersToFile();
        res.status(HttpCodes.SuccesfullRespons.Ok).send("Deleted success").end();
    } else {
        res.status(HttpCodes.ClientSideErrorRespons.NotFound).send("User not found").end();
    }
});


export default USER_API

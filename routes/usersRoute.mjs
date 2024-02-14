import express, { response } from "express";
import User from "../modules/user.mjs";
import { HTTPCodes, HTTPMethods } from "../modules/httpConstants.mjs";
import fs from 'fs';
import {saveUsersToDatabase, checkUserExists} from "./userLogic.mjs"

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


// let generatedId = generateRandomId(10);

USER_API.get('/:id', (req, res) => {
    const userId = req.params.id;
    const user = users.find(user => user.id === userId);
    if (user) {
        res.status(HTTPCodes.SuccesfullRespons.Ok).send(user).end();
    } else {
        res.status(HTTPCodes.ClientSideErrorRespons.NotFound).send("User not found").end();
    }
});

USER_API.get('/', (req, res) => {
    res.status(HTTPCodes.SuccesfullRespons.Ok).send(users).end();
});

USER_API.post('/register', checkUserExists, (req, res) => {
    const { name, email, password } = req.body;
    if (name && email && password) {
        const user = new User();
        user.name = name;
        user.email = email;
        user.id = generateRandomId(7);
        user.pswHash = password;
        users.push(user);
        saveUsersToDatabase(users, req, res, () => {
            res.status(HTTPCodes.SuccesfullRespons.Ok).end();
        });
    } else {
        res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send("Missing data field").end();
    }
});

USER_API.put('/:id', (req, res) => {
    const userId = req.params.id;
    const { name, email, password } = req.body;
    
    // Check if the userId is received
    console.log("Received userId:", userId);
    
    const userIndex = users.findIndex(user => user.id === userId);
    
    // Check if the user with the provided userId exists
    if (userIndex !== -1) {
        // Log the user details before updating
        console.log("Existing user details:", users[userIndex]);
        
        // Update the user's properties
        users[userIndex].name = name !== undefined ? name : users[userIndex].name;
        users[userIndex].email = email !== undefined ? email : users[userIndex].email;
        users[userIndex].pswHash = password !== undefined ? password : users[userIndex].pswHash;
        
        // Log the updated user details
        console.log("Updated user details:", users[userIndex]);
        
        // Save the changes to the JSON file
        saveUsersToDatabase(users, req, res, () => {
            res.status(HTTPCodes.SuccesfullRespons.Ok).send("User updated successfully").end();
        });
    } else {
        res.status(HTTPCodes.ClientSideErrorRespons.NotFound).send("User not found").end();
    }
});


USER_API.delete('/:id', (req, res, next) => {
    const userId = req.params.id;
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        saveUsersToDatabase(users, req, res, next); // Pass the updated users array
        res.status(HTTPCodes.SuccesfullRespons.Ok).send("Deleted success").end();
    } else {
        res.status(HTTPCodes.ClientSideErrorRespons.NotFound).send("User not found").end();
    }
});


export default USER_API

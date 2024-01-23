import express, { response } from "express";
import User from "../modules/user.mjs";
import HttpCodes from "../modules/httpErrorCodes.mjs";
const USER_API = express.Router();



function generateRandomId(length) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let randomId = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * alphabet.length);
        randomId += alphabet.charAt(randomIndex);
    }

    return randomId;
}

// Usage:
let generatedId = generateRandomId(5);
console.log(generatedId);

const users = [];

USER_API.get('/:id', (req, res) => {

    // Tip: All the information you need to get the id part of the request can be found in the documentation 
    // https://expressjs.com/en/guide/routing.html (Route parameters)

    /// TODO: 
    // Return user object
})

USER_API.get('/', (req, res) => {
res.status(HttpCodes.SuccesfullRespons.Ok).send(users).end();
})

USER_API.post('/', (req, res, next) => {

    // This is using javascript object destructuring.
    // Recomend reading up https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#syntax
    // https://www.freecodecamp.org/news/javascript-object-destructuring-spread-operator-rest-parameter/
    const { name, email, password } = req.body;

    if (name != "" && email != "" && password != "") {
        const user = new User();
        user.name = name;
        user.email = email;
        user.id = generateRandomId(5);
        console.log(users);
        ///TODO: Do not save passwords.
        user.pswHash = password;
        const exists = users.some(user => user.email === email);

        ///TODO: Does the user exist?

        if (!exists) {
            users.push(user);
            res.status(HttpCodes.SuccesfullRespons.Ok).end();
        } else {
            res.status(HttpCodes.ClientSideErrorRespons.BadRequest).send("bruker eksisterer allerede").end();
        }

    } else {
        res.status(HttpCodes.ClientSideErrorRespons.BadRequest).send("Mangler data felt").end();
    }

});

USER_API.put('/:id', (req, res) => {
    /// TODO: Edit user
})

USER_API.delete('/:id', (req, res) => {
    /// TODO: Delete user.
})

export default USER_API

import express, { response } from "express";
import User from "../modules/user.mjs";
import HttpCodes from "../modules/httpErrorCodes.mjs";
const USER_API = express.Router();



function generateRandomId(length) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    let randomId = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * alphabet.length);
        randomId += alphabet.charAt(randomIndex);
    }

    return randomId;
}

// let generatedId = generateRandomId(10);

const users = [];

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
})

USER_API.post('/', (req, res, next) => {

    const { name, email, password } = req.body;

    if (name != "" && email != "" && password != "") {
        const user = new User();
        user.name = name;
        user.email = email;
        user.id = generateRandomId(7);
        console.log(users);


        ///TODO: Do not save passwords.

        
        user.pswHash = password;
        const exists = users.some(user => user.email === email);

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
        res.status(HttpCodes.SuccesfullRespons.Ok).send("Deleted Success").end();
    } else {
        res.status(HttpCodes.ClientSideErrorRespons.NotFound).send("User not found").end();
    }
});


export default USER_API

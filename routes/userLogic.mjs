import fs from "fs";
import { HTTPCodes } from "../modules/httpConstants.mjs";



let users = [];
try {
  const data = fs.readFileSync('users.json', 'utf8');
  users = JSON.parse(data);
} catch (err) {
  console.log('Error reading users file:', err.message);
}
export function checkUserExists(req, res, next) {
    const { email } = req.body;
    const exists = users.some(user => user.email === email);
    if (exists) {
        return res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send("User already exists").end();
    }
    next();
};

export function saveUsersToFile(users, req, res, next) {
    try {
        fs.writeFileSync('users.json', JSON.stringify(users), 'utf8');
        next();
    } catch (err) {
        console.log('Error writing users file:', err.message);
        return res.status(HTTPCodes.ServerSideErrorRespons.InternalServerError).send("Error saving users").end();
    }
}


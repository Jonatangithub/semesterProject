import {getUserFromPasswordAndEmail } from "../modules/dbManager.mjs"

async function login(req, res, next) {
  const {userEMail, userPassword} = req.body;
  console.log(`userEMail = ${userEMail}`, `userPassword = ${userPassword}`);
  const userInfo = await getUserFromPasswordAndEmail(userEMail, userPassword);
  if(userInfo){
    res.status(200).send({message: "User Ok", code: 200, data: userInfo});
  }else{
    res.status(401).send({message: "Wrong user name or password!", data: null});
  }

}

export { login };

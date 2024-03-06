import express from 'express';
import { login } from './middleware/login.mjs';



const app = express();
const port = 3000;
app.use(express.json());
app.use("/", express.static('wwwroot'));

app.post("/login", login);



app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

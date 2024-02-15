const express = require("express");
const cors = require("cors");
const app = express();
const router = express.Router();

import { mainRouter } from "./routes";
import { accountRouter } from "./routes/account";
import { userRouter } from "./routes/user";

//MULTIPLE connections ports & json body parser for requests which have json
app.use(cors());
app.use(express.json());


//goes to the routes folder
router.use('/api/v1',mainRouter); 
router.use('/api/v1/user',userRouter);
router.use('/api/v1/account',accountRouter);

app.listen(()=>{
    console.log('server on port :3000');
},3000);


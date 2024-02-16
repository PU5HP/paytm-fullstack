const express = require("express");
const cors = require("cors");
const app = express();
const router = express.Router();

const mainRouter = require('./routes/index')
const userRouter = require('./routes/user')
const accountRouter = require('./routes/account')

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


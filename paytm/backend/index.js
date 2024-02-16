

const express = require("express");
const cors = require("cors");
const app = express();
const mainRouter = require('./routes/index');
const userRouter = require('./routes/user');
const accountRouter = require('./routes/account');


// Middleware
app.use(cors());
app.use(express.json());



// Routes
app.use('/api/v1', mainRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/account', accountRouter);



// Server Listening
const port = process.env.PORT || 3000; // Default port 3000
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

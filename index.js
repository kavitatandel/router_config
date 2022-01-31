const express = require('express')
const app = express()

//to access process.env
//this should before you acces process.env
require('dotenv').config();
const PORT = process.env.PORT || 3000

//we use urlencoded to POST/PUT
app.use(express.json());
app.use(
    express.urlencoded({
        extended: false,
    })
);

//get userRouter
const userRouter = require('./routes/userRouter')

app.use('/user', userRouter)

app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`))

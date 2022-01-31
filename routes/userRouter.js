const userRouter = require('express').Router();
const pool = require('../client');

userRouter.get('/', (req, res) => {
    pool.query("Select * FROM UserInfo")
        .then(data => res.status(201).json(data))
        .catch(error => res.sendStatus(404))
})


module.exports = userRouter;
const userRouter = require('express').Router();
const pool = require('../client');
const { body, validationResult } = require('express-validator');

userRouter.get('/', (req, res) => {
    pool.query("Select * FROM UserInfo")
        .then(data => res.status(201).json(data))
        .catch(error => res.sendStatus(404))
})

//validator for userinfo
const validateUser = [
    body('firstName').isString(),
    body('lastName').isString(),
    body('age').isNumeric()
]

userRouter.post('/', validateUser, (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const age = req.body.age;

    if (firstName === undefined || lastName === undefined || age === undefined) {
        res.sendStatus(400);
    }
    else {
        pool.query("INSERT INTO UserInfo (firstname, lastname, age) VALUES ($1,$2,$3)", [firstName, lastName, age])
            .then(data => res.status(201).json(data))
            .catch(error => res.sendStatus(404))

    }

})


module.exports = userRouter;
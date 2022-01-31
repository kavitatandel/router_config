const userRouter = require('express').Router();
const pool = require('../client');
const { body, validationResult } = require('express-validator');

userRouter.get('/', (req, res) => {
    pool.query("Select * FROM UserInfo")
        .then(data => res.status(201).json(data))
        .catch(error => res.sendStatus(404))
})

function secure(req, res, next) {
    const { id } = req.params
    //console.log(id)
    //if valid id
    pool.query("SELECT * FROM UserInfo WHERE id = $1", [id])
        .then(data => {
            if (data.rowCount === 0) {
                res.sendStatus(404)
            }
            else {
                next();
            }
        })
        .catch(error => res.sendStatus(404))

}


userRouter.get('/:id', secure, (req, res, next) => {
    const { id } = req.params
    pool.query("SELECT * FROM UserInfo WHERE id = $1", [id])
        .then(data => {
            if (data.rowCount < 0) {
                res.sendStatus(404)
            }
            else {
                res.json(data)

            }
        })
        .catch(error => res.sendStatus(404))
})

//validator for userinfo
const validateUser = [
    body('firstName').isString(),
    body('lastName').isString(),
    body('age').isNumeric()
]

//create user
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


//Edit user
userRouter.put('/:id', secure, validateUser, (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const age = req.body.age;
    const { id } = req.params;

    if (firstName === undefined || lastName === undefined || age === undefined) {
        res.sendStatus(400);
    }
    else {
        pool.query("SELECT * from UserInfo WHERE id=$1", [id])
            .then(data => {
                if (data.rowCount === 0) {
                    res.sendStatus(404)
                }
                else {
                    pool.query("UPDATE UserInfo SET firstname=$1,lastname=$2,age=$3 WHERE id=$4  RETURNING *", [firstName, lastName, age, id])
                        .then(userData => {
                            res.status(201).json(userData)
                        })
                        .catch(error => res.sendStatus(500))
                }
            })
            .catch(error => res.sendStatus(404))
    }

})

//delete user
userRouter.delete('/:id', secure, (req, res, next) => {
    const { id } = req.params
    pool.query("SELECT * FROM UserInfo WHERE id = $1", [id])
        .then(data => {
            if (data.rowCount < 0) {
                res.sendStatus(404)
            }
            else {
                pool.query("DELETE FROM UserInfo WHERE id=$1 RETURNING *", [id])
                    .then(userData => {
                        res.status(201).json(userData)
                    })
                    .catch(error => res.sendStatus(500))
            }
        })
        .catch(error => res.sendStatus(404))
})



module.exports = userRouter;

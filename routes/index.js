const {Router} = require('express')
const Auth = require('../model/Auth')
const Todo = require('../model/Todo')
const bcrypt = require('bcrypt')
const {check} = require('express-validator')
const {validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
let router = Router()
const verify = require('../middleware/verify')

router
    .get('/', async (req, res) => {
        res.status(201).send('hello')
    })


    .post('/reg',
        [
            check('email', 'enter correct email')
                .isEmail(),
            check('pass', 'length must be at least 4 and no more than 10 characters')
                .isLength({min: 4, max: 10}),
            // check('pass', 'the password must include capital letters, numbers and symbols.')
            //     .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i"),
            check('name', 'it can not be empty').notEmpty()
        ],

        async (req, res) => {
            try {
                const errors = validationResult(req)
                if (!errors.isEmpty()) {
                     res.status(400).json({message: "error of registration", errors})

                }
                const {name, email, pass} = req.body
                if (!(email && pass && name)) {
                    res.status(400).send('enter all params')
                }
                password = await bcrypt.hash(pass, 10)
                user = await Auth.create({
                    name,
                    email,
                    hash_pass: password
                })
                const token = jwt.sign(
                    {
                        user_id: user._id,
                        email
                    }, 'Rest'
                )
                user.token = token
                res.status(201).json(user)
            } catch (e) {
                console.log(e)
            }
        })

    .post('/sign-in', async (req, res) => {
        try {
            const {email, pass} = req.body
            if (!(email && pass)) {
                res.status(400).send('enter all params')
            }
            const user = await Auth.findOne({email})
            if (user && (await bcrypt.compare(pass, user.hash_pass))) {
                const token = jwt.sign(
                    {
                        user_id: user._id,
                        email
                    }, 'Rest'
                )
                user.token = token
                res.status(200).send(user)
            } else {
                res.status(400).send('Invalid credentials')
            }
        } catch (e) {
            console.log(e)
        }

    })
    .get('/home', verify, (req, res) => {
        res.status(200).send('welcome')
    })

    .post('/create-todo', verify, async (req, res) => {
        const todo = {
            title: req.body.title,
            description: req.body.description,
            user_id: req.user.user_id
        }
        console.log(todo)
        let newTodo = new Todo(todo)
        await newTodo.save()

        res.status(201).send({
            success: {
                message: 'Todo created'
            }

        })

    })

    .get('/get-all-todos', verify, async (req, res) => {
        const todos = await Todo.find({user_id: req.user.user_id})
        const arr = JSON.parse(JSON.stringify(todos))
        arr.map(el => delete el.user_id)
        res.send(arr)
    })

    .post('/complete-todo/:id', verify, async (req, res) => {
        let todo_id = req.params.id
        let todo = await Todo.findById(todo_id)
        if (todo.user_id == req.user.user_id) {
            todo.status = true
            await todo.save()
            res.status(201).send({
                success: {
                    message: 'todo completed'
                }
            })
        } else {
            res.status(403).send({
                message: 'error'
            })
        }
    })

    .patch('/update-todo/:id', verify, async (req, res) => {
        let todo_id = req.params.id
        let todo = await Todo.findById(todo_id)
        if (todo.user_id == req.user.user_id) {
            let data = req.body
            todo.title = data.title
            todo.description = data.description
            await todo.save()
            res.status(201).send({
                success: {
                    message: 'Todo updated'
                }
            })
        } else {
            res.status(403).send({
                message: 'Error'

            })
        }


    })


    .delete('/delete-todo/:id', verify, async (req, res) => {
        let todo_id = req.params.id
        let todo = await Todo.findById(todo_id)
        if (todo.user_id == req.user.user_id) {
            await Todo.findByIdAndDelete(todo_id)
            res.status(201).send({
                success: {
                    message: 'Todo deleted'
                }
            })
        } else {
            res.status(403).send({
                message: 'Something wrong'
            })
        }

    })


module.exports = router


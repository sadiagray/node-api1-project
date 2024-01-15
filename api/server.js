const { json } = require('express');
const express = require('express');
const User = require('./users/model')

const server = express()
server.use(express.json())


server.post('/api/users', (req, res) => {
    const user = req.body;
    if(!user.name || !user.bio) {
        res.status(400).json({
            message: "Please provide name and bio for the user" 
        })
    } else {
        User.insert(user)
        .then(createdUser => {
            res.status(201).json(createdUser)
        })
        .catch(err => {
            res.status(500).json({
                message: "There was an error while saving the user to the database",
                err: err.message,
                stack: err.stack,
            })
        })
    }
})

server.get('/api/users', (req, res) => {
    User.find()
    .then(users => {
        res.status(200).json(users)
    })
    .catch(err => {
        res.status(500).json({
            message: 'error getting users',
            err: err.message,
            stack: err.stack,
        })
    })
})

server.get('/api/users/:id', (req, res) => {
    User.findById(req.params.id)
    .then(user => {
        if (!user) {
            res.status(404).json({ 
                message: "The user with the specified ID does not exist"})
        }
        res.status(200).json(user)
    })
    .catch(err => {
        res.status(500).json({
            message: "The user information could not be retrieved",
            err: err.message,
            stack: err.stack,
        })
    })
})

server.use('*', (req, res) => {
    res.status(404).json({
        message: 'not found'
    })
})

server.put('/api/users/:id', async(req,res) => {
    try {
        const { id } = req.params
        const { name, bio } = req.body
        if(!name||!bio){
            res.status(400).json({
                message: "Please provide name and bio for the user"
            })
        }else{
            const updatedUser = await User.update(id, { name, bio })
            if(!updatedUser){
                res.status(404).json({
                    message: "The user with the specified ID does not exist"
                })
            }else{
                res.status(200).json(updatedUser)
            }
        }
    } catch (error) {
        res.status(500).json({
            message: 'The user information could not be modified'
        })
    }
})

server.delete('/api/users/:id', async(req,res) => {
    try {
        const { id } = req.params
        const deletedUser = await User.remove(id)
        if(!deletedUser){
            res.status(404).json({
                message: "The user with the specified ID does not exist"
            })
        }else{
            res.status(200).json(deletedUser)
        }
    } catch (error) {
        res.status(500).json({
            message: "The user could not be removed"
        })
    }
})

module.exports = server;

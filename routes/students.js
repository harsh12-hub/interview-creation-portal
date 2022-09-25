const express = require('express')
const Student = require('../schemas/student_schema')

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const students = await Student.find()
        res.json(students)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.post('/', async(req, res) => {
    console.log(req.body)
    const student = new Student({
        _id: req.body.rollno,
        name: req.body.name,
        email: req.body.email
    })
    try {
        const newStudent = await student.save()
        res.status(201).json(newStudent)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

module.exports = router
const express = require('express')
const Interview = require('../schemas/interview_schema')
const Student = require('../schemas/student_schema')

const router = express.Router()

router.get('/interview/:id', async (req, res) => {
    const interview = await Interview.findOne({_id: req.params.id})
    const members = await Student.find({_id: {$in: interview.members}})
    
    month = interview.start_time.getMonth()+1
    year = interview.start_time.getFullYear()
    date = interview.start_time.getDate()
    start_hours = interview.start_time.getHours()
    start_minutes = interview.start_time.getMinutes()
    end_hours = interview.end_time.getHours()
    end_minutes = interview.end_time.getMinutes()

    if (month<10) month = '0'+month
    if (date<10) date = '0'+date
    if (start_hours<10) start_hours = '0'+start_hours 
    if (start_minutes<10) start_minutes = '0'+start_minutes
    if (end_hours<10) end_hours = '0'+end_hours
    if (end_minutes<10) end_minutes = '0'+end_minutes

    res.json({
        date: `${year}-${month}-${date}`,
        start_time: `${start_hours}:${start_minutes}`,
        end_time: `${end_hours}:${end_minutes}`,
        members: members
    })
})

router.get('/', async (req, res) => {
    const interview = await Interview.find()
    res.render('dashboard', {
        interview: interview
    })
})

router.get('/create', async (req, res) => {
    let students
    try {
        students = await Student.find()
    } catch (err) {
        res.status(500).json({message: err.message})
    }

    res.render('create', {students: students})
})

router.post('/create', async (req, res) => {
    try {
        var all_students = await Student.find()
    } catch (err) {
        res.status(500).json({message: err.message})
    }
    var flag = true
    const title = req.body.title
    const starttime = new Date(req.body.starttime)
    const endtime = new Date(req.body.endtime)
    var members = req.body.members

    if (typeof(members)==='string'){
        flag = false
        res.render('create', {students:all_students, problem: 'Error: Number of participants has to be more than one', old_body: req.body})
    }

    if (starttime.getTime()<(new Date()).getTime()){
        flag = false
        res.render('create', {students:all_students, problem: 'Error: Please choose an upcoming date', old_body: req.body})
    }

    if (starttime.getTime()==endtime.getTime()){
        flag = false
        res.render('create', {students:all_students, problem: 'Error: Start time and end time cannot be same', old_body: req.body})
    }

    if (starttime.getTime()>endtime.getTime()){
        flag = false
        res.render('create', {students:all_students, problem: 'Error: Start time cannot be after end time', old_body: req.body})
    }

    try {
        var students = await Student.find({ '_id': {$in: members} })
    } catch (err) {
        res.status(500).json({message: err.message})
    }

    for (let i = 0; i<students.length; i++){
        if(!flag)
        break
        for (let j = 0; j<students[i].busy.length; j++){
            if ((students[i].busy[j][0].getTime()<=starttime.getTime() && students[i].busy[j][1].getTime()>=starttime.getTime()) || (students[i].busy[j][0].getTime()<=endtime.getTime() && students[i].busy[j][1].getTime()>=endtime.getTime()) || (students[i].busy[j][0].getTime()>=starttime.getTime() && students[i].busy[j][0].getTime()<=endtime.getTime())){
                flag = false
                res.render('create', {students:all_students, problem: `Error: ${students[i]._id} already has an interview scheduled in that timeframe`, old_body: req.body})
            }
            if(!flag)
            break
        }
    }
    if (flag){
        const interview = new Interview({
            title: title,
            start_time: starttime,
            end_time: endtime,
            members: members
        })

        try{
            const newInterview = await interview.save()
            for (let i= 0; i <members.length; i++){
                var filter = {_id: members[i]}
                var update = {$push: {interviews: newInterview._id.toString(), busy: [starttime, endtime]}}
                await Student.findOneAndUpdate(filter, update)
            } 
        } catch (err) {
            res.status(400)
        }

        res.redirect('/interviews')
    }
})

router.get('/edit/:id', async (req, res) => {
    const interview = await Interview.findOne({_id: req.params.id})
    const members = await Student.find({_id: {$in: interview.members}})
    const not_members = await Student.find({_id: {$nin: interview.members}})

    res.render('edit', {interview: interview, members: members, not_members: not_members})
})

router.patch('/interview/:id', async (req, res) => {
    const interview = await Interview.findOne({_id: req.params.id})

    const starttime = new Date(req.body.year, req.body.month, req.body.day, req.body.shours, req.body.sminutes, 0, 0)
    const endtime = new Date(req.body.year, req.body.month, req.body.day, req.body.ehours, req.body.eminutes, 0, 0)
    
    await Interview.findOneAndUpdate(
        {
            _id: req.params.id
        },
        {
            start_time: starttime,
            end_time: endtime
        },
        {
            upsert: false
        }
    )

    res.status(200)
})

module.exports = router
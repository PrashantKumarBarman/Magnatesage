let classModel = require('../models/class');
let { body, param, validationResult } = require('express-validator');

module.exports = {
    /* Adds a new lecture in a class with given lecture date */
    addLecture: async function(req, res) {
        try {
            let errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            
            let result = await classModel.addLecture(req.params.classId, req.params.date, {
                subject_code: req.body.subject_code,
                teacher_id: req.body.teacher_id,
                start_time: req.body.start_time,
                end_time: req.body.end_time
            });
            // returning insert id and class code
            if(result) {
                res.sendStatus(200);
            }
            else {
                res.sendStatus(400);
            }
        }
        catch(err) {
            console.log(err);
            res.sendStatus(400);
        }
    },
    /* Update a lecture on a class based on lecture date and subject code */
    updateLecture: async function(req, res) {
        try {
            let errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            
            let result = await classModel.updateLecture(req.params.classId, req.params.date, req.body.subject_code, req.body);
            // returning insert id and class code
            if(result) {
                res.sendStatus(200);
            }
            else {
                res.sendStatus(400);
            }
        }
        catch(err) {
            console.log(err);
            res.sendStatus(400);
        }
    },
    /* gets all lectures for date */
    getLecturesByDate: async function(req, res) {
        try {
            let result = await classModel.getLecturesByDate(req.params.classId, req.params.date);
            // returning insert id and class code
            if(result) {
                res.status(200).json(result);
            }
            else {
                res.sendStatus(400);
            }
        }
        catch(err) {
            console.log(err);
            res.sendStatus(400);
        }
    },
    // Deletes a lecture by class id and lecture date
    deleteLecturesByDate: async function(req, res) {
        try {
            let result = await classModel.deleteLecturesByDate(req.params.classId, req.params.date);
            if(result) {
                res.status(200).json(result);
            }
            else {
                res.status(200).json([]);
            }
        }
        catch(err) {
            console.log(err);
            res.sendStatus(400);
        }
    },
    // Deletes a lecture by class id, lecture date and subject code
    deleteLecturesBySubjectCode: async function(req, res) {
        try {
            let result = await classModel.deleteLecturesBySubjectCode(req.params.classId, req.params.date, req.params.subjectCode);
            if(result) {
                res.status(200).json(result);
            }
            else {
                res.status(200).json([]);
            }
        }
        catch(err) {
            console.log(err);
            res.sendStatus(400);
        }
    },
    /* Validates request fields when adding and updating a lecture in a class */
    lectureValidator: function() {
        return [
            body('subject_code', 'subject code is required and can be of 6 characters max').exists().isLength({ min: 6, max: 6 }),
            body('teacher_id', 'invalid teacher id').optional().isMongoId(),
            body('start_time', 'start time is required').exists(),
            body('end_time', 'end time is required').exists(),
            param('date', 'invalid date').exists().isDate()
        ];
    }
};
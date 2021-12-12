let classModel = require('../models/class');
let { body, validationResult } = require('express-validator');

module.exports = {
    /* Adds/creates a new class */
    addClass: async function(req, res) {
        try {
            let errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            
            let result = await classModel.addClass(req.body);
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
    /* Updates a class by its unique id */
    updateClass: async function(req, res) {
        try {
            let errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            
            // updating document by class id
            let result = await classModel.updateClassById(req.params.classId, req.body);
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
    /* Fetches all classes list */
    getAllClasses: async function(req, res) {
        try {
            // updating document by class id
            let result = await classModel.getAllClasses();
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
    /* Fetches all classes list */
    getClass: async function(req, res) {
        try {
            // updating document by class id
            let result = await classModel.getClassById(req.params.classId);
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
    /* Validates request fields when adding and updating a class details */
    classValidator: function() {
        return [
            body('class_name', 'class name is required and can be of 255 characters max').exists().isLength({ max: 255 }).custom((value) => {
                return classModel.findByClassName(value)
                .then((result) => {
                    if(result) {
                        return Promise.reject('class with given name already exists');
                    }
                });
            }),
            body('class_code', 'class code has to be 6 characters').optional().isLength({ min: 6, max: 6 }),
            body('class_number', 'class number can only be in range 1 to 12').exists().isInt({ min: 1, max: 12 }),
            body('is_primary', 'only true and false value is allowed').optional().isBoolean(),
            body('type', 'valid values are only boys or girls').exists().isIn(['boys', 'girls'])
        ];
    }
};
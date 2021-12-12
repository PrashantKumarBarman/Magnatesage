let mongoose = require('../db');
let randomstring = require('randomstring');

let classSchema = mongoose.Schema({
    class_name: { type: String, required: true, unique: true, maxLength: 255 },
    class_code: { type: String, required: true, minLength: 6, maxLength: 6 },
    class_number: { type: Number, required: true, min: 1, max: 12 },
    is_primary: { type: Boolean, default: true },
    type: { type: String, require: true, enum: ['boys', 'girls'] },
    lectures: [],
    created_at: { type: Date, required: true, default: Date.now },
    updated_at: { type: Date, required: true, default: Date.now }
});

let classModel = mongoose.model('classes', classSchema);

module.exports = {
    /**
     * Find and returns a class by its name
     * @param {String} className 
     * @returns {Promise} Promise object which resolves to the document if exists else resolves to null
     */
    findByClassName: async function(className) {
        try {
            let result = await classModel.find({ class_name: className }).exec();
            if(result.length > 0) {
                return result[0];
            }
            else {
                return null;
            }
        }
        catch(err) {
            console.log(err);
            return null;
        }
    },
    /**
     * Adds a new class
     * @param {Object} classDocument Object which is valid according to classSchema
     * @returns {Promise} Promise object which resolves to an object with id and class_code properties of new record else resolve to false
     */
    addClass: async function(classDocument) {
        try {
            if(!classDocument['class_code']) {
                classDocument['class_code'] = randomstring.generate(6);
            }
            let classRecord = new classModel(classDocument);
            let result = await classRecord.save();
            return { id: result._id, class_code: classDocument['class_code'] };
        }
        catch(err) {
            console.log(err);
            return false;
        }
    },
    /**
     * Update a class by its id
     * @param {String} classId Unique id of the class
     * @param {Object} updateDocument Valid classSchema object with updated properties values
     * @returns {Promise} Promise object which resolve to an object with id and class_code of the document else resolves to false
     */
    updateClassById: async function(classId, updateDocument) {
        try {
            await classModel.updateOne({ 
                _id: mongoose.Types.ObjectId(classId)
            },
            {
                "$set": updateDocument
            }).exec();
            return { id: classId };
        }
        catch(err) {
            console.log(err);
            return false;
        }
    },
    getAllClasses: async function() {
        try {
            let classes = await classModel.find({})
            .sort({ _id: -1 })
            .select({ class_name: 1, class_code: 1, is_primary: 1, type: 1 })
            .exec();
            return classes;
        }
        catch(err) {
            console.log(err);
            return false;
        }
    },
    getClassById: async function(id) {
        try {
            let classDocument = await classModel.find({ _id: mongoose.Types.ObjectId(id) })
            .select({ __v: 0 }).exec();
            return classDocument;
        }
        catch(err) {
            console.log(err);
            return false;
        }
    },
    /**
     * Adds a lecture to given class with given lecture date
     * @param {String} classId object id string of the class
     * @param {String} lectureDate Date string for the lecture date
     * @param {Object} lectureDocument Object containing lecture details
     * @returns {Promise} Promise object which resolves to true, if addition succeeds else resolves to false
     */
    addLecture: async function(classId, lectureDate, lectureDocument) {
        try {
            // teacher id object id type validation
            if(!mongoose.Types.ObjectId.isValid(lectureDocument.teacher_id)) {
                lectureDocument.teacher_id = null;
            }
            // adding lecture under the given lecture date, if the record for the date exists
            let result = await classModel.findOneAndUpdate({ 
                _id: mongoose.Types.ObjectId(classId), 
                "lectures.date": new Date(lectureDate) 
            },
            {
                "$push": {
                    "lectures.$.schedule": lectureDocument
                }
            });

            // no record for the lecture exists adding new one
            if(!result) {
                result = await classModel.findOneAndUpdate({ 
                    _id: mongoose.Types.ObjectId(classId)
                },
                {
                    "$push": {
                        "lectures": {
                            date: new Date(lectureDate),
                            schedule: [lectureDocument]
                        }
                    }
                }).exec();
            }
            return true;
        }
        catch(err) {
            console.log(err);
            return false;
        }
    },
    /**
     * Updates a lecture to given class with given lecture date
     * @param {String} classId object id string of the class
     * @param {String} lectureDate Date string for the lecture date
     * @param {String} subjectCode subject code
     * @param {Object} lectureDocument Object containing lecture details
     * @returns {Promise} Promise object which resolves to true, if addition succeeds else resolves to false
     */
    updateLecture: async function(classId, lectureDate, subjectCode, lectureDocument) {
        try {
            // teacher id object id type validation
            if(!mongoose.Types.ObjectId.isValid(lectureDocument.teacher_id)) {
                lectureDocument.teacher_id = null;
            }
            await classModel.updateOne({ 
                _id: mongoose.Types.ObjectId(classId), 
            },
            {
                "$set": {
                    "lectures.$[lecture].schedule.$[schedule]": lectureDocument
                }
            },
            {
                arrayFilters: [{ "lecture.date": new Date(lectureDate) }, { "schedule.subject_code": subjectCode } ]
            }).exec();
            return true;
        }
        catch(err) {
            console.log(err);
            return false;
        }
    },
    /**
     * Gets all lectures by for a class by date
     * @param {String} classId Class id
     * @param {Date}} Lecture date
     * @returns {Promise} Promise object which resolves to lectures array 
     */
    getLecturesByDate: async function(classId, lectureDate) {
        try {
            let result = await classModel.find({ _id: mongoose.Types.ObjectId(classId)} )
            .select({ lectures: { "$elemMatch": { date: new Date(lectureDate) } } }).exec();
            return result[0].lectures[0].schedule;
        }
        catch(err) {
            console.log(err);
            return [];
        }
    },
    /**
     * Deletes a lecture based on given lecture date
     * @param {String} lectureDate Lecture date
     * @returns {Promise} Promise object which resolves to true if operation succeeds else resolves to false 
     */
    deleteLecturesByDate: async function(classId, lectureDate) {
        try {
            let result = await classModel.findOneAndUpdate({ 
                _id: mongoose.Types.ObjectId(classId),
                "lectures.date": new Date(lectureDate)
            },
            {
                "$pull": { 
                    lectures: { 
                        date: new Date(lectureDate) 
                    } 
                }
            }).select({ 
                lectures: { 
                    "$elemMatch": { 
                        date: new Date(lectureDate) 
                    } 
                } 
            }).exec();

            if(result) {
                if(result.lectures.length > 0) {
                    return result.lectures[0].schedule;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        }
        catch(err) {
            console.log(err);
            return false;
        }
    },
    /**
     * Deletes a lecture based on given date and subject code for the lecture
     * @param {String} lectureDate Lecture date
     * @param {String} subjectCode Subject code for the lecture
     * @returns {Promise} Promise object which resolves to true if operation succeeds else resolves to false
     */
    deleteLecturesBySubjectCode: async function(classId, lectureDate, subjectCode) {
        try {
            await classModel.updateMany({ 
                _id: mongoose.Types.ObjectId(classId), 
                "lectures.date": new Date(lectureDate),
                "lectures.schedule.subject_code": subjectCode 
            }, 
            {
                "$pull": { 
                    "lectures.$[lecture].schedule.$[schedule]": subjectCode 
                }
            },
            {
                arrayFilters: [ { "lecture.date": new Date(lectureDate) }, { "schedule.subject_code": subjectCode } ]
            })
            .exec();
            return true;
        }
        catch(err) {
            console.log(err);
            return false;
        }
    }
};
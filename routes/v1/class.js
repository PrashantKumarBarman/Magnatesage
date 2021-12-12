let express = require('express');
let classController = require('../../controllers/class');
let lecturesController = require('../../controllers/lectures');

let router = express.Router();

// Gets list of all classes
router.get('/list', classController.getAllClasses);

// creates a class
router.post('/', classController.classValidator(), classController.addClass);

// adds a lecture to a class
router.post('/:classId/lectures/:date', lecturesController.lectureValidator(), lecturesController.addLecture);

// gets lectures for a class by date
router.get('/:classId/lectures/:date', lecturesController.lectureValidator(), lecturesController.getLecturesByDate);

// delete lectures for a class by subject code and lecture date
router.delete('/:classId/lectures/:date/:subjectCode', lecturesController.lectureValidator(), lecturesController.deleteLecturesBySubjectCode);

// delete lectures for a class by date
router.delete('/:classId/lectures/:date', lecturesController.lectureValidator(), lecturesController.deleteLecturesByDate);

// updates a lecture from a class by class id and lecture date
router.put('/:classId/lectures/:date', lecturesController.lectureValidator(), lecturesController.updateLecture);

// updates a class by id
router.put('/:classId', classController.classValidator(), classController.updateClass);

// finds a class by id
router.get('/:classId', classController.classValidator(), classController.getClass);

module.exports = router;
//imports of files
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Note = require('../models/notemodel');

//get all notes
router.get('/',auth, async (req, res, next) => {
    try {
        const noteList = await Note.find({user: req.user.id});
        if (!noteList) {
            const error = new Error('No notes found');
            error.status = 500;
            return next(error);
        }
        res.status(200).send(noteList);
    } catch (error) {
        error.status = 500;
        next(error);
    }
});

//get a note by ID
router.get('/:id',auth, async (req, res, next) => {
    try {
        if (req.params.id.length !== 24) { //if the id is not 24 characters long returns an error
            const error = new Error('Invalid ID');
            error.status = 400;
            return next(error);
        }
        const note = await Note.findById(req.params.id);
        //if the note is not found returns an error
        if (!note) { 
            const error = new Error(`The note with the id ${req.params.id} was not found`);
            error.status = 404;
            return next(error);
        }
        //if the note user is not the same as the request user id returns an error
        if(note.user.toString() !== req.user.id) {
            const error = new Error('Unauthorized');
            error.status = 401;
            return next(error);
        }
        return res.status(200).send(note);
    } catch (error) {
        error.status = 500;
        next(error);
    }
});

//create a new note
router.post('/', auth,async (req, res, next) => {
    try {
        //sets the request body title note to the note
        let note = new Note({
            title: req.body.title,
            note: req.body.note,
            user: req.user.id
        });
        note = await note.save();
        //if the note is not created returns an error
        if (!note) {
            const error = new Error('Cannot create note');
            error.status = 404;
            return next(error);
        }
        res.send(note);
    } catch (error) {
        if (error.code === 11000) { 
            const error = new Error('Duplicate note detected. Please avoid spamming the save button.');
            error.status = 409;
            return next(error);
        } else {
            error.status = 500;
        }
        next(error);
    }
});

//update a note by ID
router.put('/:id',auth, async (req, res, next) => {
    try {
        let note = await Note.findById(req.params.id);
        // console.log('user id',note.user.toString())
        if(note.user.toString() !== req.user.id) {
            const error = new Error('Unauthorized');
            error.status = 401;
            return next(error);
        }
        //sets the request body title note to the note with a new date of update
        await Note.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            note: req.body.note,
            updatedAt: new Date()
        }, { 
            new: true 
        });
        ////if the note is not saved returns an error
        if (!note) {
            const error = new Error('Note was not saved (404)');
            error.status = 404;
            return next(error);
        }
        return res.status(200).json({success:true, message: "Note was saved successfully"})
    } catch (error) {
        error.status = 500;
        next(error);
    }
});

//delete a note by ID
router.delete('/:id', auth,async (req, res, next) => {
    try {
        //sets the note to the id from the request 
        const note = await Note.findById(req.params.id);
        //if the note is not found returns an error
        // console.log(note)
        // console.log(req.user.id)
        if (!note) {
            const error = new Error('Note not found');
            error.status = 404;
            return next(error);
        }
        //checks if the note user is the same as the request user id
        if (note.user.toString() !== req.user.id) {
            const error = new Error('Not Authorized');
            error.status = 401;
            return next(error);
        }
        //otherwise it returns a success message
        await note.deleteOne();
        return res.status(200).json({success:true, message: "Note was deleted successfully"})
    } catch (error) {
        console.error('Error:', error);
        error.status = 500;
        next(error);
    }
});
module.exports = router;

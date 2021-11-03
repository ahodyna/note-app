const { Note } = require("../dataBase");
const ErrorHandler = require("../errors/ErrorHandler");
const mongoose = require("mongoose");


function isPositiveNumber(number) {
    return number !== undefined 
        && number !== "" 
        && !isNaN(Number(number)) 
        && Number(number) >= 0
}

function isValidMongoId(id) {
    try {
        new mongoose.Types.ObjectId(id);
        return true;
    } catch (e) {
        return false;
    }
}

module.exports = {
    getNoteById: async (req, res, next) => {
        try {
            const { id } = req.params;

            if (!isValidMongoId(id)) {
                throw new ErrorHandler(400, "Invalid Id")
            }
            const note = await Note.findById(id);

            if (!note) {
                throw new ErrorHandler(400, "Note not found");
            }

            res.status(200).json({
                "note": {
                    "_id": note._id,
                    "userId": note.ownerId,
                    "completed": note.check,
                    "text": note.text,
                    "createdDate": note.createdAt

                }
            })
        } catch (e) {
            next(e);
        }
    },

    getAllNotes: async (req, res, next) => {
        try {
            if (req.query.offset && !isPositiveNumber(req.query.offset)) {
                throw new ErrorHandler(400, "Parameter 'offset' should be positive number")
            }
            if (req.query.limit && !isPositiveNumber(req.query.limit)) {
                throw new ErrorHandler(400, "Parameter 'limit' should be positive number")
            }

            const userId = req.loggedUser._id.toString();

            const notesCount = await Note.count({ ownerId: userId });

            Note.find({ ownerId: userId })
                .skip(Number(req.query.offset) || 0)
                .limit(Number(req.query.limit) || 0)
                .then((response) => {
                    let serchedResult = response.map((note) => {
                        return {
                            "_id": note._id,
                            "userId": note.ownerId,
                            "completed": note.check,
                            "text": note.text,
                            "createdDate": note.createdAt
                        };
                    });
                    res.status(200).json({
                        "offset": req.query.offset || 0,
                        "limit": req.query.limit || 0,
                        "count": Math.floor(notesCount || 0),
                        "notes": serchedResult
                    })
                })

        } catch (e) {
            next(e);
        }
    },

    deleteNoteById: async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!isValidMongoId(id)) {
                throw new ErrorHandler(400, "Invalid Id")
            }

            const userId = req.loggedUser._id.toString();
            const note = await Note.findById(id);

            if (!note) {
                throw new ErrorHandler(400, "Note not found")
            }
            if (userId !== note.ownerId) {
                throw new ErrorHandler(400, "Delete permitted only for owner")
            }

            await Note.findByIdAndDelete(id);

            res.status(200).json({ "message": "Success" })

        } catch (e) {
            next(e);
        }
    },

    addNote: async (req, res, next) => {
        try {
            const book = req.body
            book.ownerId = req.loggedUser._id;
            await Note.create(book);

            res.status(200).json({ "message": "Success" })
        } catch (e) {
            next(e);
        }
    },
    updateNoteInfo: async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!isValidMongoId(id)) {
                throw new ErrorHandler(400, "Invalid Id")
            }

            const userId = req.loggedUser._id.toString();
            const note = await Note.findById(id);

            if (!note) {
                throw new ErrorHandler(400, "Entity not found")
            }

            if (userId !== note.ownerId) {
                throw new ErrorHandler(400, "Update permitted only for owner")
            }

            await Note.findByIdAndUpdate(id, req.body);

            res.status(200).json({ "message": "Success" })
        } catch (e) {
            next(e);
        }
    },
    updateStatusNote: async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!isValidMongoId(id)) {
                throw new ErrorHandler(400, "Invalid Id")
            }

            const note = await Note.findById(id);
            const userId = req.loggedUser._id.toString();
            if (!note) {
                throw new ErrorHandler(400, "Entity not found")
            }
            if (userId !== note.ownerId) {
                throw new ErrorHandler(400, "Status update permitted only for owner")
            }
            await Note.findByIdAndUpdate(id, { check: !note.check });

            res.status(200).json({ "message": "Success" })
        } catch (e) {
            next(e);
        }
    }
};

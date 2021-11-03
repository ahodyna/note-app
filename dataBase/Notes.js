const { Schema, model } = require("mongoose")

const noteSchema = new Schema({
    text: {
        type: String,
        required: true,
        trim: true
    }, 
    check: {
        type: Boolean,
        default: false,
        required: true   
    },
    ownerId: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

module.exports = model("note", noteSchema)
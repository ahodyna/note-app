const { Schema, model } = require("mongoose");
const dataBaseTablesEnum = require("../configs/dataBaseTables.enum");
const userRolesEnum = require("../configs/userRoles.enum");
const passwordService = require("../services/password.services");

const userSchema = new Schema({
    password: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    role: {
        type: String,
        default: userRolesEnum.USER,
        enum: Object.values(userRolesEnum)
    }
}, { timestamps: true });



userSchema.statics = {
    async createWithHashPassword(userObject) {

        const hashPassword = await passwordService.hash(userObject.password);

        return this.create({ password: hashPassword, username: userObject.username });
    }
};
module.exports = model(dataBaseTablesEnum.USER, userSchema);
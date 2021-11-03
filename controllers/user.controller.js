const { User } = require("../dataBase");
const passwordService = require("../services/password.services");
const ErrorHandler = require("../errors/ErrorHandler");
const { OAuth } = require("../dataBase");


module.exports = {
    getUserById: async (req, res, next) => {
        try {
            const userId = req.loggedUser._id.toString();

            let user = await User.findById(userId);

            return res.status(200).json({
                "user": {
                    "_id": user._id,
                    "username": user.username,
                    "createdDate": user.createdAt
                }
            })
        } catch (e) {
            next(e);
        }
    },

    createUser: async (req, res, next) => {
        try {

            const { username } = req.body;

            let user = await User.findOne({ "username": username });
            if (user) {                
                throw new ErrorHandler(400, "User already exists");
            }

            await User.createWithHashPassword(req.body);
            return res.status(200).json({ "message": "Success" })
        } catch (e) {
            next(e);
        }
    },
    deleteUserById: async (req, res, next) => {
        try {
            const userId = req.loggedUser._id.toString();
            await User.findByIdAndDelete(userId);

            await OAuth.deleteOne({ "user": req.loggedUser._id });
            
            return res.status(200).json({ "message": "Success" })
        } catch (e) {
            next(e);
        }
    },
    updateUser: async (req, res, next) => {
        try {
            const userId = req.loggedUser._id.toString();

            const user = await User.findOne({ "_id": req.loggedUser._id})
            await passwordService.compare(req.body.oldPassword, user.password)
            const hashPassword = await passwordService.hash(req.body.newPassword);

            await User.findByIdAndUpdate(userId, { password: hashPassword });
            return res.status(200).json({ "message": "Success" })
   
        } catch (e) {
            next(e);
        }
    }
};
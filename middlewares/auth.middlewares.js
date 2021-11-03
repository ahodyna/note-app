const ErrorHandler = require("../errors/ErrorHandler");
const { jwtService } = require("../services");
const { OAuth } = require("../dataBase");
const dataBaseTablesEnum = require("../configs/dataBaseTables.enum");


module.exports = {
    checkAccessToken: async (req, res, next) => {
        try {
            const token = req.headers.authorization.split(" ")[1];
            if (!token) {
                throw new ErrorHandler(400, "Error message");
            }
            await jwtService.verifyToken(token);

            const tokenFromDB = await OAuth.findOne({ access_token: token }).populate(dataBaseTablesEnum.USER);

            if (!tokenFromDB) {
                throw new ErrorHandler(400, "Error message");
            }
            req.loggedUser = tokenFromDB.user;

            next();
        } catch (e) {
            next(e);
        }
    }
}
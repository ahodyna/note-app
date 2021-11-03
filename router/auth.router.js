const router = require("express").Router();

const { authContoller, userController } = require("../controllers");


router.post("/login", authContoller.login);

router.post("/register", userController.createUser);

module.exports = router;
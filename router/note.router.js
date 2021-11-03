const router = require("express").Router();
const noteController = require("../controllers/note.controller");
const authMiddlewares = require("../middlewares/auth.middlewares");

router.post("/", authMiddlewares.checkAccessToken, noteController.addNote);

router.get("/", authMiddlewares.checkAccessToken, noteController.getAllNotes);

router.get("/:id", authMiddlewares.checkAccessToken, noteController.getNoteById);

router.delete("/:id", authMiddlewares.checkAccessToken, noteController.deleteNoteById);

router.put("/:id", authMiddlewares.checkAccessToken, noteController.updateNoteInfo);

router.patch("/:id", authMiddlewares.checkAccessToken, noteController.updateStatusNote);

module.exports = router;
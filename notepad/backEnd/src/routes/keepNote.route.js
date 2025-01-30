import { Router } from "express";
import { createNote, updateTextNote, findNote, reUploadFileNote, deleteNote, binNote, restoreNote, deleteFile, archiveNote, restoreArchiveNote, getNote, getListSearch, getImageSearch, getURLsearch } from "../controllers/keepNote.controller.js"
import { verifyLogin } from "../middlewares/user.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = Router()

router.route("/createnote").post(verifyLogin, upload.single("image"), createNote)

router.route("/updatetextnote/:id").patch(verifyLogin, updateTextNote)
router.route("/reuploadfile/:id").post(verifyLogin, upload.single("image"), reUploadFileNote)

router.route("/deletenote/:id").delete(verifyLogin, deleteNote)
router.route("/deletefile/:id").delete(verifyLogin, deleteFile)
router.route("/binnote/:id").patch(verifyLogin, binNote)
router.route("/restorebinnote").patch(verifyLogin, restoreNote)
router.route("/archivenote/:id").patch(verifyLogin, archiveNote)
router.route("/restorearchivenote").patch(verifyLogin, restoreArchiveNote)

router.route("/note/:id").get(verifyLogin, getNote)

router.route("/findnote").post(verifyLogin, findNote)

router.route("/searchlist").get(verifyLogin, getListSearch)
router.route("/searchimage").get(verifyLogin, getImageSearch)
router.route("/searchurl").get(verifyLogin, getURLsearch)

export default router
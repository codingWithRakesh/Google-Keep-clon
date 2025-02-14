import { Router } from "express";
import { registerUser, loginUser, currentUser, logOutUser, allNotes, lebelNotes, deleteNotes, archiveNotes, allLabels, getNote, searchData, deleteAccount } from "../controllers/user.controller.js"
import { verifyLogin } from "../middlewares/user.middleware.js"

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/currentuser").get(verifyLogin, currentUser)
router.route("/logout").post(verifyLogin, logOutUser)

router.route("/label/:labelName").get(verifyLogin, lebelNotes)
// router.route("/label/:labelName").get( lebelNotes)
router.route("/binnote").get(verifyLogin, deleteNotes)
router.route("/archivenote").get(verifyLogin, archiveNotes)

router.route("/alllabels").get(verifyLogin, allLabels)

router.route("/notes").get(verifyLogin, allNotes)
router.route("/note/:id").get(verifyLogin, getNote)

router.route("/search").post(verifyLogin, searchData)
// router.route("/notes").get( allNotes)

router.route("/deleteaccount").delete(verifyLogin, deleteAccount)

export default router
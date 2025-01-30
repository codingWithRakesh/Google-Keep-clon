import { Router } from "express";
import { createLabel, updateLabel, deleteLable, findLables,lebelNotes } from "../controllers/label.controller.js"
import { verifyLogin } from "../middlewares/user.middleware.js"

const router = Router()

router.route("/createlabel").post(verifyLogin, createLabel)
router.route("/updatelable").patch(verifyLogin, updateLabel)
router.route("/deletelable").delete(verifyLogin, deleteLable)

router.route("/label/:labelName").get(verifyLogin, lebelNotes)

router.route("/alllabels").get(verifyLogin,findLables)

export default router
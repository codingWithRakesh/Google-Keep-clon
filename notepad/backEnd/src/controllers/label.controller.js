import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Label } from "../models/label.model.js"
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

const createLabel = asyncHandler(async (req, res) => {
    const { labelName } = req.body
    if (!labelName) {
        throw new ApiError(400, "name is required")
    }
    const existedLabel = await Label.findOne({ labelName })
    if (existedLabel) {
        throw new ApiError(400, "label alredy existd")
    }
    const label = await Label.create({ labelName, owner: req.user._id })
    if (!label) {
        throw new ApiError(500, "something went wrong")
    }
    return res.status(200).json(new ApiResponse(200, label, "lable created successfully"))
})

const updateLabel = asyncHandler(async (req, res) => {
    const {id,labelName} = req.body
    if(!id){
        throw new ApiError(400,"id is required")
    }
    const label = await Label.findByIdAndUpdate(id,{labelName},{new : true})
    if(!label){
        throw new ApiError(404,"not found")
    }
    return res.status(200).json(new ApiResponse(200,label,"update successfully"))
})

const deleteLable = asyncHandler(async (req,res) => {
    const {id,labelName} = req.body
    if(!id){
        throw new ApiError(400,"id is required")
    }
    const label = await Label.findByIdAndDelete(id,{labelName},{new : true})
    if(!label){
        throw new ApiError(404,"not found")
    }
    return res.status(200).json(new ApiResponse(200,{},"delete successfully"))
})

const lebelNotes = asyncHandler(async (req, res) => {
    const { labelName } = req.params
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "keepnotes",
                localField: "_id",
                foreignField: "owner",
                as: "allNotes",
                pipeline: [
                    {
                        $lookup: {
                            from: "labels",
                            localField: "labelId",
                            foreignField: "_id",
                            as: "labels",
                        }
                    },  
                    {
                        $addFields: {
                            isLabel: {
                                $cond: {
                                    if: {
                                        $gt: [{
                                            $size: "$labels"
                                        }, 0]
                                    },
                                    then: true,
                                    else: false
                                }
                            },
                            labelName: {
                                $first: "$labels.labelName"
                            }
                        }
                    },
                    {
                        $project : {
                            labels : 0
                        }
                    },
                    {
                        $match : {
                            labelName : labelName
                        }
                    }
                ]
            }
        }
    ]);

    if (!user) {
        throw new ApiError(404, "not found")
    }

    return res.status(200).json(new ApiResponse(200, user, "all notes"))

})

const findLables = asyncHandler(async (req,res) => {
    const allLabels = await Label.find()
    return res.status(200).json(new ApiResponse(200,allLabels,"successfully"))
})

export { createLabel, updateLabel, deleteLable, findLables,lebelNotes }
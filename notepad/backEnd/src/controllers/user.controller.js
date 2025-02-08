import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from '../models/user.model.js'
import { options } from "../constants.js";
import mongoose from "mongoose";
import { KeepNote } from "../models/keepNote.model.js";
import { Label } from "../models/label.model.js";

const accessAndRefreshTokenGenrator = async (usedId) => {
    try {
        const user = await User.findById(usedId)
        const accessToken = user.generateAccessToken()
        const refereshToken = user.generateRefreshToken()

        user.refreshToken = refereshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refereshToken }
    } catch (error) {
        throw new ApiError(500, "something went wrong in token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { userName, email, fullName, password } = req.body
    if ([userName, email, fullName, password].some((data) => data?.trim() === "")) {
        throw new ApiError(400, "all fields are requerd")
    }
    const existedUser = await User.findOne({
        $or: [{ userName }, { email }]
    })
    if (existedUser) {
        throw new ApiError(400, "user alredy existd")
    }
    const user = await User.create({
        fullName,
        email,
        userName: userName.toLowerCase(),
        password
    })
    const createUser = await User.findById(user._id).select("-password -refreshToken")
    if (!createUser) {
        throw new ApiError(500, "something went wrong")
    }
    return res.status(200).json(new ApiResponse(200, createUser, "register successfuly"))
})

const loginUser = asyncHandler(async (req, res) => {
    const { userName, email, password } = req.body
    if (!(userName || email)) {
        throw new ApiError(400, "all fields are requerd")
    }
    const user = await User.findOne({
        $or: [{ userName }, { email }]
    })
    if (!user) {
        throw new ApiError(404, "not found")
    }
    const isPassword = await user.isPasswordCorrect(password)
    if (!isPassword) {
        throw new ApiError(401, "Bad request")
    }
    const { accessToken, refereshToken } = await accessAndRefreshTokenGenrator(user._id)
    const loginUser = await User.findById(user._id).select("-password -refreshToken")

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refereshToken", refereshToken, options)
        .json(new ApiResponse(200, { user: loginUser, refereshToken, accessToken }, "login successfully"))
})

const currentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, req.user, "successfully"))
})

const logOutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        $unset: {
            refreshToken: 1
        }
    },
        {
            new: true
        })
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refereshToken", options)
        .json(new ApiResponse(200, {}, "logout successfully"))
})

const allNotes = asyncHandler(async (req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $project: {
                password: 0,
                refreshToken: 0
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
                        $match: {
                            isBin: false,
                            isArchive: false
                        }
                    },
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
                        $project: {
                            labels: 0
                        }
                    }
                ]
            },
        }
    ]);

    if (!user) {
        throw new ApiError(404, "not found")
    }

    return res.status(200).json(new ApiResponse(200, user, "all notes"))

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
            $project: {
                password: 0,
                refreshToken: 0
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
                        $match: {
                            isBin: false,
                        }
                    },
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
                        $project: {
                            labels: 0
                        }
                    },
                    {
                        $match: {
                            labelName: labelName
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


const deleteNotes = asyncHandler(async (req, res) => {
    const deleteData = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $project: {
                password: 0,
                refreshToken: 0
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
                        $match: {
                            isBin: true
                        }
                    },
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
                        $project: {
                            labels: 0
                        }
                    },
                ]
            }
        }
    ]);
    if (!deleteData) {
        throw new ApiError(404, "not found")
    }
    return res.status(200).json(new ApiResponse(200, deleteData, "delete datas"))
})

const archiveNotes = asyncHandler(async (req, res) => {
    const archiveData = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $project: {
                password: 0,
                refreshToken: 0
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
                        $match: {
                            isArchive: true,
                            isBin: false,
                        }
                    },
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
                        $project: {
                            labels: 0
                        }
                    },
                ]
            }
        }
    ]);
    if (!archiveData) {
        throw new ApiError(404, "not found")
    }
    return res.status(200).json(new ApiResponse(200, archiveData, "archive datas"))
})

const allLabels = asyncHandler(async (req, res) => {
    const alllabels = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $project: {
                userName: 1
            }
        },
        {
            $lookup: {
                from: "labels",
                localField: "_id",
                foreignField: "owner",
                as: "allLabels"
            }
        }
    ])
    if (!alllabels) {
        throw new ApiError(404, "not found")
    }
    return res.status(200).json(new ApiResponse(200, alllabels, "successfully"))
})

const getNote = asyncHandler(async (req, res) => {
    const { id } = req.params
    console.log("id ", id, "req id ", req.user._id)
    const note = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $project: {
                password: 0,
                refreshToken: 0
            }
        },
        {
            $lookup: {
                from: "keepnotes",
                localField: "_id",
                foreignField: "owner",
                as: "note",
                pipeline: [
                    {
                        $match: {
                            _id: new mongoose.Types.ObjectId(id)
                        }
                    },
                    {
                        $lookup: {
                            from: "labels",
                            localField: "labelId",
                            foreignField: "_id",
                            as: "label"
                        }
                    },
                    {
                        $addFields: {
                            isLabel: {
                                $cond: {
                                    if: {
                                        $gt: [{
                                            $size: "$label"
                                        }, 0]
                                    },
                                    then: true,
                                    else: false
                                }
                            },
                            labelName: {
                                $first: "$label.labelName"
                            }
                        }
                    },
                    {
                        $project: {
                            label: 0
                        }
                    },
                ]
            },
        }
    ])
    if (!note) {
        throw new ApiError(404, "not found")
    }
    return res.status(200).json(new ApiResponse(200, note, "successfully"))
})

const searchData = asyncHandler(async (req, res) => {
    const { searchValue } = req.body
    const regex = new RegExp(`.*${searchValue}.*`, 'i');
    const data = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $project: {
                password: 0,
                refreshToken: 0
            }
        },
        {
            $lookup: {
                from: "keepnotes",
                localField: "_id",
                foreignField: "owner",
                as: "note",
                pipeline: [
                    {
                        $match: {
                            $or: [
                                { title: { $regex: regex } },
                                { content: { $regex: regex } },
                                { listContent: { $regex: regex } }
                            ],
                            isBin: false
                        }
                    },
                    {
                        $lookup: {
                            from: "labels",
                            localField: "labelId",
                            foreignField: "_id",
                            as: "label"
                        }
                    },
                    {
                        $addFields: {
                            isLabel: {
                                $cond: {
                                    if: {
                                        $gt: [{
                                            $size: "$label"
                                        }, 0]
                                    },
                                    then: true,
                                    else: false
                                }
                            },
                            labelName: {
                                $first: "$label.labelName"
                            }
                        }
                    },
                    {
                        $project: {
                            label: 0
                        }
                    },
                ]
            }
        }
    ])
    if (!data) {
        throw new ApiError(404, "not found")
    }
    res.status(200).json(new ApiResponse(200, data, "ok"))
})

const deleteAccount = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    await KeepNote.deleteMany({ owner: userId });

    await Label.deleteMany({ owner: userId });

    await User.findByIdAndDelete(userId);

    return res.status(200).json(new ApiResponse(200, {}, "User account deleted successfully"));
})

export { registerUser, loginUser, currentUser, logOutUser, allNotes, lebelNotes, deleteNotes, archiveNotes, allLabels, getNote, searchData, deleteAccount }
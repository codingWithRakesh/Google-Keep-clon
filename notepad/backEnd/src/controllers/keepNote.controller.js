import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { KeepNote } from '../models/keepNote.model.js'
import { options } from "../constants.js";
import { uploadOnCloudinary, deleteFromCloudinary, getPublicId } from "../utils/cloudinary.js"
import mongoose from "mongoose";
import {Label} from '../models/label.model.js'

const createNote = asyncHandler(async (req, res) => {
    let { title, content, listContent, listBoolean, isPin, labelName, isArchive } = req.body

    try {
        if (typeof listContent === 'string') {
            listContent = JSON.parse(listContent);
        }
    } catch (error) {
        listContent = [];
        throw new ApiError(506,error.message)
    }

    try {
        if (typeof listBoolean === 'string') {
            listBoolean = JSON.parse(listBoolean);
        }
    } catch (error) {
        listBoolean = [];
        throw new ApiError(506,error.message)
    }

    let labelId = null;
    if (labelName) {
        const labelCurrent = await Label.findOne({ labelName });
        if (!labelCurrent) {
            throw new ApiError(400, "Label not found");
        }
        labelId = labelCurrent._id;
    }

    let image = [];
    if (req.file) {
        const imagePath = req.file?.path
        const uploadedImage = await uploadOnCloudinary(imagePath);
        image.push(uploadedImage?.url);
    }

    if (!(title || content || listContent || req.file)) {
        throw new ApiError(400, "can't store empty data")
    }

    const note = await KeepNote.create({
        title: title || "",
        content: content || "",
        listContent: listContent || [],
        listBoolean: listBoolean || [],
        isPin,
        image: image || [],
        owner: req.user._id,
        labelId: labelId || null,
        isArchive
    })

    if (!note) {
        throw new ApiError(500, "something went wrong")
    }

    res.status(201).json(new ApiResponse(201, note, "Note created successfully"))
})


const updateTextNote = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { title, content, listContent, listBoolean, isPin } = req.body

    if (!id) {
        throw new ApiError(400, "Note ID is required")
    }

    if (!(title || content || listContent)) {
        throw new ApiError(400, "All fields are required")
    }

    const note = await KeepNote.findByIdAndUpdate(
        id,
        {
            title,
            content,
            listContent,
            listBoolean,
            isPin
        },
        { new: true }
    )

    if (!note) {
        throw new ApiError(404, "Note not found")
    }

    res.status(200).json(new ApiResponse(200, note, "Note updated successfully"))
})

const reUploadFileNote = asyncHandler(async (req, res) => {
    const { id } = req.params
    const imagePath = req.file?.path

    if (!imagePath) {
        throw new ApiError(400, "File missing")
    }

    const keepNote = await KeepNote.findById(id)
    if (!keepNote) {
        throw new ApiError(404, "Note not found")
    }

    const image = await uploadOnCloudinary(imagePath)
    if (!image.url) {
        throw new ApiError(400, "Error while uploading")
    }

    keepNote.image.push(image.url)
    await keepNote.save({ validateBeforeSave: false });

    res.status(200).json(new ApiResponse(200, keepNote, "Upload successful"))
})

const deleteNote = asyncHandler(async (req, res) => {
    const { id } = req.params
    if (!id) {
        throw new ApiError(400, "Note ID is required")
    }
    const note = await KeepNote.findByIdAndDelete(id)
    if (!note) {
        throw new ApiError(404, "Note not found")
    }
    res.status(200).json(new ApiResponse(200, {}, "Note deleted successfully"))
})

const binNote = asyncHandler(async (req, res) => {
    const { id } = req.params
    if (!id) {
        throw new ApiError(400, "Note ID is required")
    }
    const note = await KeepNote.findByIdAndUpdate(id, { isBin: true }, { new: true, runValidators: true })
    if (!note) {
        throw new ApiError(404, "Note not found")
    }
    res.status(200).json(new ApiResponse(200, note, "Note deleted successfully"))
})

const restoreNote = asyncHandler(async (req, res) => {
    const { id } = req.body
    if (!id) {
        throw new ApiError(400, "id not found")
    }
    const note = await KeepNote.findByIdAndUpdate(id, { isBin: false }, { new: true, runValidators: true })
    if (!note) {
        throw new ApiError(404, "Note not found")
    }
    res.status(200).json(new ApiResponse(200, note, "Note restore successfully"))
})

const deleteFile = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { image } = req.body;

    if (!id || !image) {
        throw new ApiError(400, "Note ID and image are required");
    }

    try {
        const publicId = getPublicId(image)
        await deleteFromCloudinary(publicId);
    } catch (error) {
        throw new ApiError(500, "Failed to delete image from Cloudinary");
    }

    const updateNote = await KeepNote.findByIdAndUpdate(
        id,
        { $pull: { image: image } },
        { new: true }
    );

    if (!updateNote) {
        throw new ApiError(404, "Note not found");
    }

    res.status(200).json(new ApiResponse(200, updateNote, "Image deleted successfully"));

})

const archiveNote = asyncHandler(async (req, res) => {
    const { id } = req.params
    if (!id) {
        throw new ApiError(400, "Note ID is required")
    }
    const note = await KeepNote.findByIdAndUpdate(id, { isArchive: true }, { new: true, runValidators: true })
    if (!note) {
        throw new ApiError(404, "Note not found")
    }
    res.status(200).json(new ApiResponse(200, note, "Note Archive successfully"))
})

const restoreArchiveNote = asyncHandler(async (req, res) => {
    const { id } = req.body
    if (!id) {
        throw new ApiError(400, "id not found")
    }
    const note = await KeepNote.findByIdAndUpdate(id, { isArchive: false }, { new: true, runValidators: true })
    if (!note) {
        throw new ApiError(404, "Note not found")
    }
    res.status(200).json(new ApiResponse(200, note, "Note unArchive successfully"))
})

const findNote = asyncHandler(async (req, res) => {
    const allDatas = await KeepNote.find()
    res.status(200).json(new ApiResponse(200, allDatas, "successfully"))
})

const getNote = asyncHandler(async (req, res) => {
    const { id } = req.params
    const note = await KeepNote.aggregate([
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
    ])
    if (!note) {
        throw new ApiError(404, "not found")
    }
    return res.status(200).json(new ApiResponse(200, note, "successfully"))
})

const getListSearch = asyncHandler(async (_, res) => {
    const searchList = await KeepNote.aggregate([
        {
            $match: {
                $expr: {
                    $gt: [{ $size: "$listContent" }, 0]
                },
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
    ]);
    if (!searchList) {
        throw new ApiError(404, "not found")
    }
    return res.status(200).json(new ApiResponse(200, searchList, "successfully"))
})

const getImageSearch = asyncHandler(async (_, res) => {
    const searchImage = await KeepNote.aggregate([
        {
            $match: {
                $expr: {
                    $gt: [{ $size: "$image" }, 0]
                },
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
    ])
    if (!searchImage) {
        throw new ApiError(404, "not found")
    }
    return res.status(200).json(new ApiResponse(200, searchImage, "successfully"))
})

const getURLsearch = asyncHandler(async (_, res) => {
    const searchURL = await KeepNote.aggregate([
        {
            $match: {
                isBin: false,
                content: {
                    $type: "string",
                    $regex: "(https?:\\/\\/|www\\.|[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})",
                    $options: "i"
                }
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
    ])
    if (!searchURL) {
        throw new ApiError(404, "not found")
    }
    return res.status(200).json(new ApiResponse(200, searchURL, "successfully"))
})

export { createNote, updateTextNote, findNote, reUploadFileNote, deleteNote, binNote, restoreNote, deleteFile, archiveNote, restoreArchiveNote, getNote, getListSearch, getImageSearch, getURLsearch }
import { Schema, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const keepNoteSchema = new Schema({
    title: {
        type: String,
    },
    content: {
        type: String,
    },
    listContent : {
        type : [String],
        default : []
    },
    listBoolean : {
        type : [Boolean],
        default : []
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    image: [{
        type : String
    }],
    isPin: {
        type: Boolean,
        default: false
    },
    isBin: {
        type: Boolean,
        default: false
    },
    isArchive: {
        type: Boolean,
        default: false
    },
    labelId : {
        type : Schema.Types.ObjectId,
        ref : "Label"
    }
}, { timestamps: true })

keepNoteSchema.plugin(mongooseAggregatePaginate)

export const KeepNote = model("KeepNote", keepNoteSchema)
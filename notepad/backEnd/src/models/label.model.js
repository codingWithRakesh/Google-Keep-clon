import { Schema, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const labelSchema = new Schema({
    labelName : {
        type : String,
        required : true,
        unique: true,
    },
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
},{timestamps:true})

labelSchema.plugin(mongooseAggregatePaginate)
export const Label = model("Label",labelSchema)
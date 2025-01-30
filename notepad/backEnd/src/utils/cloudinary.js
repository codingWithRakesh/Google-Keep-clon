import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (filePath) => {
    try {
        if(!filePath) return null
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type : 'auto'
        });
        fs.unlinkSync(filePath)
        return result;
    } catch (error) {
        fs.unlinkSync(filePath)
        return null;
    }
};

const getPublicId = (url) => {
    const parts = url.split("/")
    const publicIdEx = parts[parts.length -1]
    const publicId = publicIdEx.split(".")[0]
    return publicId
}

const deleteFromCloudinary = async (publicId) => {
    try {
        if(!publicId) return null
        const result = await cloudinary.uploader.destroy(publicId);
        console.log("successfully upload")
        return result;
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        return null
    }
};

export { uploadOnCloudinary, deleteFromCloudinary, getPublicId };
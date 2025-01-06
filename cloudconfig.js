const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');

cloudinary.config({
    // KEY NAME ARE DEFAULT USE THIS KEY NAME FOR ALL PROJECT
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: 'some-folder-name',
//         format: async (req,res) => 'png', //supports promises as well
//         public_id: (req,res) => 'computed-filename-using-request'
//     },
// });

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'livingora_DEV',
        //key name can be any name
        allowedFormats: ["png","jpg","jpeg"],
    },
});

module.exports={
    cloudinary,
    storage,
}
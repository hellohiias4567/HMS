const express = require('express');
const multer = require('multer');
const router = express.Router();
// const path = require('path');


const { v2: cloudinary } = require('cloudinary');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
// Set up storage configuration
/*const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // specify upload directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // unique file name
  }
});




const upload = multer({ storage: storage }); */
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});






const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: 'sunshine-hospital/profiles',
                resource_type: 'image'
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        stream.end(fileBuffer);
    });
};




// Define the route for file upload
// router.post('/upload', upload.single('profilePic'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).send({ message: 'Please upload a file' });
//   }
//   const profilePicPath = `/uploads/${req.file.filename}`;
//   res.send({ filePath: profilePicPath, message: 'File uploaded successfully' });
// });


router.post(
    '/upload',
    upload.single('profilePic'),
    async (req, res) => {

        try {

            if (!req.file) {
                return res.status(400).json({
                    message: 'Please upload a file'
                });
            }

            const result =
                await uploadToCloudinary(req.file.buffer);

            res.json({
                filePath: result.secure_url,
                message: 'File uploaded successfully'
            });

        } catch (error) {

            console.error('UPLOAD ERROR:', error);

            res.status(500).json({
                message: 'Image upload failed',
                error: error.message
            });
        }
    }
);


router.get('/homed', (req, res) => {
    return res.json({ 'status': 'work' })
})

// module.exports = router;
module.exports = {
    router,
    uploadToCloudinary
};
import path from "path";
import express from "express";
import multer from "multer";

const router = express.Router();

// ✅ Storage config (disk)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        const extname = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${Date.now()}${extname}`);
    },
});

// ✅ File filter
const fileFilter = (req, file, cb) => {
    const filetypes = /jpe?g|png|webp/;
    const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

    const extname = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;

    if (filetypes.test(extname) && mimetypes.test(mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Images only"), false);
    }
};

// ✅ Multer setup
const upload = multer({
    storage,
    fileFilter,
});

// ✅ Route 
router.post("/", upload.single("image"), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image file provided" });
        }

        const formattedPath = `/${req.file.path.replace(/\\/g, "/")}`;

        res.status(200).json({
            message: "Image uploaded successfully",
            image: formattedPath, 
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;









//Buffer 

// import path from "path";
// import express from "express";
// import multer from "multer";
// import Image from "../models/imageModel.js"; 

// const router = express.Router();

// // ✅ memory storage (BUFFER)
// const storage = multer.memoryStorage();

// // ✅ file filter
// const fileFilter = (req, file, cb) => {
//     const filetypes = /jpeg|jpg|png|webp/;
//     const mimetypes = /image\/jpeg|image\/jpg|image\/png|image\/webp/;

//     const extname = path.extname(file.originalname).toLowerCase();
//     const mimetype = file.mimetype;

//     if (filetypes.test(extname) && mimetypes.test(mimetype)) {
//         cb(null, true);
//     } else {
//         cb(new Error("Only image files allowed"), false);
//     }
// };

// // ✅ multer config
// const upload = multer({
//     storage,
//     fileFilter,
//     limits: { fileSize: 5 * 1024 * 1024 } // 5MB
// });

// // ✅ POST: Upload + Save to MongoDB
// router.post("/", upload.single("image"), async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ message: "No image uploaded" });
//         }

//         // ✅ Save buffer in DB
//         const newImage = new Image({
//             name: req.file.originalname,
//             img: {
//                 data: req.file.buffer,
//                 contentType: req.file.mimetype,
//             },
//         });

//         await newImage.save();

//         res.status(201).json({
//             message: "Image uploaded & saved to MongoDB",
//             id: newImage._id,
//             fileInfo: {
//                 name: req.file.originalname,
//                 type: req.file.mimetype,
//                 size: req.file.size,
//             }
//         });

//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// // ✅ GET: Fetch image
// router.get("/:id", async (req, res) => {
//     try {
//         const image = await Image.findById(req.params.id);

//         if (!image) {
//             return res.status(404).send("Image not found");
//         }

//         res.set("Content-Type", image.img.contentType);
//         res.send(image.img.data);

//     } catch (err) {
//         res.status(500).send(err.message);
//     }
// });

// export default router;
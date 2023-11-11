const express = require("express");
const router = require("express").Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const Image = require("../Schema/ImageSchema");
const Category = require("../Schema/CategorySchema");
const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} = require("firebase/storage");
const config = require("../config/firebase");
initializeApp(config.firebaseConfig);
const storage = getStorage();
const storageRef = ref(storage);

router.post("/", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const skip = (page - 1) * limit;
    try {
      const totalImages = await Image.countDocuments();
      const uploadedImages = await Image.find().skip(skip).limit(limit);
  
      if (!uploadedImages || uploadedImages.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Images not found",
        });
      }
      const AllImages = uploadedImages.map((image) => ({
        _id: image._id,
        userId: image.userId,
        title: image.title,
        sales: image.sale,
        description: image.description,
        uploadTime: image.uploadTime,
        images: image.image,
        price: image.price,
      }));
  
      res.json({
        AllImages,
        page,
        totalPages: Math.ceil(totalImages / limit),
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        success: false,
        message: "Error fetching images",
      });
    }
  });

router.post("/", upload.single("image"), async (req, res) => {
    try {
      const imageBuffer = req.file.buffer;
  
      // Save image to Firebase
      const filename = `${Date.now()}_${req.file.originalname}`;
      const fileRef = ref(storageRef, `images/images/${filename}`);
      const metadata = { contentType: req.file.mimetype };
      await uploadBytesResumable(fileRef, imageBuffer, metadata);
      const downloadURL = await getDownloadURL(fileRef);

      let categoryID = null;
      const existingCategory = await Category.findOne({
        category: req.body.category,
      });
  
      if (existingCategory) {
        categoryID = existingCategory._id;
      } else {
        const newCategory = new Category({
          category: req.body.category,
        });
        const savedCategory = await newCategory.save();
        categoryID = savedCategory._id;
      }

      const image = new Image({
        userId: req.body.userId,
        title: req.body.title,
        description: req.body.description,
        image: downloadURL,
        sale: req.body.sale,
        price: req.body.price,
        category: categoryID,
      });
  
      const savedImage = await image.save();
      res.json(savedImage);
    } catch (err) {
      res.json({ message: err });
    }
  });
module.exports = router;

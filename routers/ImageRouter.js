const express = require('express');
const router = require('express').Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const Image = require('../Schema/ImageSchema');
const Category = require('../Schema/CategorySchema');
const { initializeApp } = require("firebase/app");
const {getStorage,ref,getDownloadURL,uploadBytesResumable,deleteObject} = require("firebase/storage");
const config = require("../config/firebase");
initializeApp(config.firebaseConfig);
const storage = getStorage();
const storageRef = ref(storage);


router.get('/', async (req, res) => {
    try {
        const images = await Image.find();
        res.json(images);
    } catch (err) {
        res.json({ message: err });
    }
});
router.post('/', upload.single('image'), async (req, res) => {
    const imageBuffer = req.file.buffer;

    //Save image to firebase
    const filename = `${Date.now()}_${req.file.originalname}`;
    const fileRef = ref(storageRef, `images/images/${filename}`);
    const metadata = { contentType: req.file.mimetype };
    await uploadBytesResumable(fileRef, imageBuffer, metadata);
    const downloadURL = await getDownloadURL(fileRef);

    const image = new Image({
        userId: req.body.userId,
        title: req.body.title,
        description: req.body.description,
        image: downloadURL,
        sale: req.body.sale,
        price: req.body.price,
        category: req.body.category,
    });
    try {
        const savedImage = await image.save();
        res.json(savedImage);
    } catch (err) {
        res.json({ message: err });
    }
});
module.exports = router;
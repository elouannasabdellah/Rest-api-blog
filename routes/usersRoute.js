
const router= require('express').Router();

const { getAllUsersCtrl, getUserCtrl, updateUserProfileCtr, getUsersCountCtrl, profilePhotoUploadCtrl, deleteUserProfileCtrl } = require('../controllers/usersController');
const { verifyToken, verifyTokenAndAdmin, verifyTokenAndUser, verifyTokenAndAdminAndUser } = require('../middelwares/verifyToken');

const validateObjectId= require('../middelwares/validateObjectId');
const photoUpload = require('../middelwares/photoUpload');

// api/users/profile

router.get('/profile', verifyTokenAndAdmin, getAllUsersCtrl );
router.get('/profile/:id' , validateObjectId, getUserCtrl );
// update user
router.put('/profile/:id',  validateObjectId , verifyTokenAndUser, updateUserProfileCtr );
// delete user 
router.delete("/profile/:id" ,validateObjectId, verifyTokenAndAdminAndUser , deleteUserProfileCtrl )

// api/users/profile/profile-photo-upload : 
// update profilePhoto
router.post('/profile/profile-photo-upload', verifyToken, photoUpload.single("image"), profilePhotoUploadCtrl );

 
 // Count User
 //api/users/count
router.get('/count', verifyTokenAndAdmin, getUsersCountCtrl );


module.exports= router;
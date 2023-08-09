 
const asyncHandler= require('express-async-handler');

const { UserModel, validateUpdateUser }= require('../models/User');

const bcrypt= require('bcryptjs');

const path = require('path');
const fs = require('fs');
const { cloudiaryUploadImage, cloudiaryRemoveImage, cloudiaryRemoveMultipleImage }= require('../utils/cloudinary');

const { Comment }= require('../models/Comment');
const {Post } = require('../models/Post');


/*----------------------------

    * @desc Get all Users Profile 
    router: /api/users/profile
    method: GET
    access: private (only admin) 

*-----------------------------*/

 module.exports.getAllUsersCtrl= asyncHandler( async(req,res)=>{
   // console.log(req.headers.authorization.split(' ')[1]);
    const users= await UserModel.find().select("-password").populate("posts");
    res.status(200).json(users);

} )

/*----------------------------

    * @desc Get  User Profile 
    router: /api/users/profile/:id
    method: GET
    access: public 

*-----------------------------*/

module.exports.getUserCtrl= asyncHandler( async(req,res)=>{
 
     const user= await UserModel.findById(req.params.id).select("-password").populate("posts");
     
     if(!user) {
        return res.status(400).json({message: "User not found"})
     }

     res.status(200).json(user);
 
 } );

 /*----------------------------

    * @desc update  User Profile 
    router: /api/users/profile/:id
    method: PUT
    access: private (only user himself) 

*-----------------------------*/

module.exports.updateUserProfileCtr= asyncHandler( async(req,res)=>{

    const {error}= validateUpdateUser(req.body);
    if(error) {
        return res.status(400).json({message : error.details[0].message })
    }

    if(req.body.password) {
        const salt= await bcrypt.genSalt(10);
        req.body.password= await bcrypt.hash(req.body.password, salt);
    }   

    const updateUser= await UserModel.findByIdAndUpdate(req.params.id, {
        $set: {
            username: req.body.username, 
            password: req.body.password,
            bio: req.body.bio
        }
    }, {new: true} ).select('-password');

    res.status(200).json(updateUser);

} );

/*----------------------------

    * @desc Get Count Users  
    router: /api/users/count
    method: GET
    access: private (only admin) 

*-----------------------------*/

module.exports.getUsersCountCtrl= asyncHandler( async(req,res)=>{

     const count= await UserModel.count();
     res.status(200).json(count);
 
 } )


  /*----------------------------

    * @desc Profile Photo Upload 
    router: /api/users/profile/profile-photo-upload
    method: POST
    access: private (only logged in user) 

*-----------------------------*/

module.exports.profilePhotoUploadCtrl= asyncHandler( async(req,res)=>{
   // console.log(req.file);

   //1 validation
   if(!req.file) {
    res.status(400).json( {message: "no profile provided"} );
   }

   // 2 Get the path to the image
   const imagePath= path.join(__dirname, `../images/${req.file.filename}` )

   //3 Upload to cloudinary
   const result = await cloudiaryUploadImage(imagePath)
   console.log(result);
    //4 Get the user from DB

    const user = await UserModel.findById(req.user.id);

   //5 Delete the old profile photo if exist  ( Delete in cloudinary )

   if(user.profilePhoto.publicId !== null) {
      await cloudiaryRemoveImage( user.profilePhoto.publicId );
   }
   //6 Change the profilePhoto field  in the DB

   user.profilePhoto = {
    url: result.secure_url,
    publicId : result.public_id
   }

   await user.save();

   //7 send the response to client
    res.status(200).json({message: "Your profile photo uploaded successfully",
    profilePhoto: { url: result.secure_url, publicId: result.public_id }

    })
    
    //8 Remove image from the server (in folder images )

    fs.unlinkSync(imagePath);

} );


/* 
    delete  user profile (Account)
    route: /api/users/profile/:id
    @method  =>DELETE
    @ access Private(only admin  or user himself  )
    -----------------------------
*/

module.exports.deleteUserProfileCtrl= asyncHandler( async(req,res)=>{

    //1 Get the user from DB 
    const user= await UserModel.findById(req.params.id);
    if(!user) {
        return res.status(404).json({message: " user not found" });
    }

    //2  Get all posts from DB 
    const posts= await Post.find({ user: user._id })

    //3  Get the public ids from the posts
    const publicIds= posts?.map( (post)=> post.image.publicId )

    //4 Delete all posts image from cloudinary that belong to this user
    if(publicIds?.length >0) {
        await cloudiaryRemoveMultipleImage(publicIds);
    }
    
    //5 Delete the profile picture from cloudinary 

    await cloudiaryRemoveImage(user.profilePhoto.publicId)

    //6  Delete user posts & comments 
    await Post.deleteMany( { user: user._id } ); // DELEET tous les posts qui appartient a ce user
    await Comment.deleteMany( {user: user._id } )

    //7 Delete the user himself 

    await UserModel.findByIdAndDelete(req.params.id);

    //8 send a response to the client 
    res.status(200).json(  {message: "Your profile has been deleted "} );

} )

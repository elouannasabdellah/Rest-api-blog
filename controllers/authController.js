
const asyncHandler= require('express-async-handler');

const bcrypt= require('bcryptjs');

const { UserModel, validateRegisterUser , validateLoginUser , generateAuthToken }= require('../models/User');

/*----------------------------

    * Register New User    - sign up
    router: /api/auth/register
    method: POST
    access: public 

*-----------------------------*/

 module.exports.registerUserCtrl= asyncHandler( async (req,res,next)=>{

    //validation
    //is user already exists
    //hash password 
    // new user and save it to Db
    // send a response to client 


     //validation
    const { error }= validateRegisterUser(req.body);
    if(error) {
        return res.status(400).json({message: error.details[0].message });
    }
     //is user already exists

     let user = await UserModel.findOne({ email:req.body.email });

     if(user) {
        res.status(400).json({message: "User already exist "});
     }

     //hash password 
     const salt= await bcrypt.genSalt(10);
     const hashedPassword= await bcrypt.hash(req.body.password, salt);

     // new user and save it to Db
     user= new UserModel({
        username: req.body.username,
        email:req.body.email,
        password: hashedPassword
     });
     
     // Creating new Verification & save it to DB 
     // Making the link 
     // putting the link into html template 
     // Sending  email to the user 


     await user.save();

     res.status(201).json({message:" You registered successfully , please log in!"})

 } );

  /*----------------------------

    * Login  User    - sign in 
    router: /api/auth/login
    method: POST
    access: public 

*-----------------------------*/

 module.exports.LoginUserCtrl= asyncHandler( async(req,res)=>{

    // 1 Validation
    // 2 is user exist
    // 3 check the password
    // 4  generate Token (jwt)
    // 5  response to client  

    //1
    const { error }= validateLoginUser(req.body);
    if(error) {
        return res.status(400).json({message: error.details[0].message });   
    }

    //2 
    const user= await UserModel.findOne({ email:req.body.email });
    if(!user) {
        return res.status(400).json({message: "Invalid email Or password"});
    }
    //3
    const isPasswordMatch= await bcrypt.compare(req.body.password, user.password );
    if(!isPasswordMatch) {
        return res.status(400).json({message: "Invalid email Or password"});
    }


    //4 
    const token= user.generateAuthToken();
    
    //5 
    res.status(200).json({
      
        _id:user._id,
        isAdmin: user.isAdmin,
        profilePhoto: user.profilePhoto,
      
        token,
 })

 } )

const mongoose= require('mongoose');

const Joi= require('joi');

const jwt= require("jsonwebtoken");

//User Schema

const UserSchema= new mongoose.Schema({

    username:{
        type: String,
        required: true,
        trim:true,
        minLength: 2,
        maxLength:100,
    },

    email:{
        type: String,
        required: true,
        trim:true,
        minLength: 5,
        maxLength:100,
        unique: true,
    },

    password:{
        type: String,
        required: true,
        trim:true,
        minLength: 8,
  
    },

    profilePhoto:{
        type:Object,
        default:{
            url:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png",
            publicId: null,
        }
    },

    bio: String,

    isAdmin:{
        type:Boolean,
        default:false,
    },

    isAccountVerified:{
        type:Boolean,
        default:false
    }

},{ timestamps:true,
    toJSON: {virtuals: true},
    toObject: { virtuals: true  }
} );

// populate Posts That Belongs To This User When he/she Get his/her Profile
// qui signifie get tous les posts the User quant Get One User

UserSchema.virtual("posts",  {
    ref:"Post",
    foreignField:"user",
    localField: "_id"    

})

// Generate Auth Token 

UserSchema.methods.generateAuthToken = function() {

    return jwt.sign({id : this._id, isAdmin:this.isAdmin } , process.env.JWT_SECRET ); 

}

//User Model 
const UserModel= mongoose.model("User", UserSchema );

 // Validate Register User
 function validateRegisterUser(obj) {

    const shema = Joi.object({
        username: Joi.string().trim().min(2).max(100).required(),
        email: Joi.string().trim().min(5).max(100).required().email(),
        password: Joi.string().trim().min(8).required(),

    });

    return shema.validate(obj);

 }

  // Validate Login User
  function validateLoginUser(obj) {

    const shema = Joi.object({
        email: Joi.string().trim().min(5).max(100).required().email(),
        password: Joi.string().trim().min(8).required(),

    });

    return shema.validate(obj);

 }

 
  // Validate Update User
  function validateUpdateUser(obj) {

    const shema = Joi.object({
        username: Joi.string().trim().min(2).max(100),
        password: Joi.string().trim().min(8),
        bio:Joi.string(),

    });

    return shema.validate(obj);

 }

 module.exports= {
    UserModel,
    validateRegisterUser,
    validateLoginUser,
    validateUpdateUser,
} 
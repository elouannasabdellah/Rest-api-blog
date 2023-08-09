
const mongoose= require('mongoose');

const VerificationTokenSchema= new mongoose.Schema( {

    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },

    token: {
        type: String,
        required: true,
    },


} , {timestamps: true } )

// Comment model

const VerificationToken= mongoose.model("VerifycationToken", VerificationTokenSchema);



module.exports= VerificationToken
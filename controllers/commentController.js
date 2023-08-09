
const asyncHandler= require('express-async-handler');
const { Comment, validateCreateComment, validateUpdateComment } = require('../models/Comment');
const { UserModel } = require('../models/User');
/* ---------------

@desc  Create New Commmment 
@route  /api/comments
@method  POST
@access  private (only  logged in user )

*--------------*/

module.exports.createCommentCtrl= asyncHandler( async(req,res) => {
  
    const { error }= validateCreateComment(req.body);
    if(error) {
        return res.status(400).json({message: error.details[0].message});
    }
    // IF user already write comment 
    // const userComment=  await Comment.findOne( {user:req.user.id , postId: req.body.postId } )
    // if(userComment){
    //     return res.status(400).json({message: "The User already write comment in this post" });
    // }

    const profile= await UserModel.findById( req.user.id )

    const comment = await Comment.create( {
        postId: req.body.postId,    
        text: req.body.text,
        user: req.user.id,
        username: profile.username,
    });

    res.status(201).json(comment);

} )



/* ---------------

@desc  Get All Commmments 
@route  /api/comments
@method  GET
@access  private (only admin )

*--------------*/

module.exports.getAllCommentsCtrl= asyncHandler( async(req,res) => { 

    const comments= await Comment.find().populate("user" );

    res.status(200).json(comments);

} )

/* ---------------

@desc  Delete  Commmment 
@route  /api/comments/:id
@method  DELETE
@access  private (only admin OR  owner of the comment )

*--------------*/

module.exports.deleteCommentCtrl= asyncHandler( async(req,res) => { 

    const comment= await Comment.findById(req.params.id);

    if(!comment) {
        return res.status(404).json( {message: "comment not found"} );
    }
        // admin and user qui est écrit le comment 
    if(req.user.isAdmin  || req.user.id === comment.user.toString() ) {

        await Comment.findByIdAndDelete( req.params.id);

        res.status(200).json({ message: "comment has been deleted" });

    } else {
        res.status(403).json({ message: "Access denied , not allowed " });

    } 

} )

/* ---------------

@desc  Update Commmment 
@route  /api/comments/:id
@method  PUT
@access  private (only  owner of the comment )

*--------------*/

module.exports.updateCommentCtrl= asyncHandler( async(req,res) => {

    const { error }= validateUpdateComment(req.body);
    if(error) {
        return res.status(400).json({message: error.details[0].message});
    }

    const comment = await Comment.findById(req.params.id);
    if(!comment) {
        return res.status(404).json({ message: "comment not found" });
    }
    // Owner the comment 
    if(req.user.id !== comment.user.toString() ){
        return res.status(403)
        .json({ message: "Access denied Only user himself can edit his comment" });
    }
    const updatedComment = await Comment.findByIdAndUpdate( req.params.id , {
            $set: {
                text: req.body.text,
            }
        } , { new: true }
    )

    res.status(200).json(updatedComment);

} )

const express= require('express');

const connectToDb= require('./config/connectToDb');

const { errorHandler } = require('./middelwares/error')
const { NotFount} = require('./middelwares/error')

require('dotenv').config() ;

connectToDb();

const app= express();

//Middleware

app.use(express.json());


//Routes

app.use("/api/auth", require('./routes/authRoute') );
app.use("/api/users", require('./routes/usersRoute') );
app.use("/api/posts", require('./routes/postsRoute'));
app.use("/api/comments", require('./routes/commentsRoute'));
app.use("/api/categories", require('./routes/categoriesRoute'));


// 
app.use(NotFount);

// Error Handler Middelware 
app.use(errorHandler)

//Ranning The server

const PORT =process.env.PORT || 6000;

app.listen(PORT, ()=>{
    console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT} `);
} )

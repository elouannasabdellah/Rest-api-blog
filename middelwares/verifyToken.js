
const jwt=require('jsonwebtoken')

// Verify Token
 function verifyToken(req,res,next) {

    const authToken= req.headers.authorization;

    if(authToken) {
        const token = authToken.split(' ')[1];
        try {
            
            const decodedPayload= jwt.verify(token, process.env.JWT_SECRET);
            req.user= decodedPayload;
            next();

            // il ya token ms n'est pas incorrecte
        } catch (error) {
            return res.status(401).json({message: "invalid token , access denied"})
        }
        // pas de token 
    } else {
        return res.status(401).json({message: "No token provided"})
    }

 }

    // verify Token & Admin

    function verifyTokenAndAdmin(req,res, next) {

        verifyToken(req, res, () =>{
            if(req.user.isAdmin){
                next();
            } else {
                return res.status(403).json({message: "not allowed , only admin"});
            }
        });

    }

        // verify Token & User himself

        function verifyTokenAndUser(req,res, next) {

            verifyToken(req, res, () =>{
                if(req.user.id === req.params.id ){
                    next();
                } else {
                    return res.status(403).json({message: "not allowed , only user himself"});
                }
            });
    
        }


           // verify Token admin & User himself

           function verifyTokenAndAdminAndUser(req,res, next) {

            verifyToken(req, res, () =>{
                if(req.user.id === req.params.id || req.user.isAdmin ){
                    next();
                } else {
                    return res.status(403).json({message: "not allowed , only user himself or admin "});
                }
            });
    
        }

 module.exports= { 
    verifyToken,
    verifyTokenAndAdmin,
    verifyTokenAndUser,
    verifyTokenAndAdminAndUser
  }
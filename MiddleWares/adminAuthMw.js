const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Student = mongoose.model("student");


const isAdmin = async (req, res, next) =>{
    const token = String(req.get("Authorization")).split();
    try{
        const decoded = jwt.verify(token[0], process.env.SECRET_KEY);
        if (decoded.role) {
            if (decoded.role == "admin") {
                // Admin authentication
                req.email = decoded.email;
                req.role = decoded.role;
                next();
              }
              else{
                res.status(401).send({ error: 'User Is Not Authenticated' });
              }
              
        }
    }
    catch(err){
        res.status(401).send({ error: 'User Is Not Authenticated' });
    }
}


module.exports = isAdmin;
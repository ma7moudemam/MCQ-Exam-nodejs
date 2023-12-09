const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Student = mongoose.model("student");

const auth = async (req, res, next) => {
  const token = String(req.get("Authorization")).split();

  try {
    const decoded = jwt.verify(token[0], process.env.SECRET_KEY);

    // if(decoded.role == "user"){
    //     try{
    //         const user = await User.findOne({email:decoded.user.email});

    //         if(!user){
    //             throw new Error();
    //         }
    //         req.user = user;
    //         req.role = decoded.role;
    //         next();

    //     }
    //     catch(err){
    //         res.status(401).send({error:"User Is Not Authenticated"});
    //     }
    // }

    // else if(decoded.role == ("admin")){
    //     req.email = decoded.email;
    //     req.role = decoded.role;
    //     next();
    // }

    if (decoded.role) {
      if (decoded.role == "admin") {
        // Admin authentication
        req.email = decoded.email;
        req.role = decoded.role;
        next();
      }else{
        try{
            const student = await Student.findOne({ email: decoded.email });

            if (!student) {
                throw new Error();
              }

              req.user = student;
              next();
        }
        catch(err){
            res.status(401).send({ error: 'User Is Not Authenticated' });
        }
      }
    } else {

        try {
            const student = await Student.findOne({ email: decoded.email });
    
            if (!student) {
              throw new Error();
            }
    
            req.user = student;
            next();
          } catch (err) {
            res.status(401).send({ error: 'User Is Not Authenticated' });
          }
    }
  } catch (err) {
    res.status(401).send({ error: "User Is Not Authenticated" });
  }
};

module.exports = auth;

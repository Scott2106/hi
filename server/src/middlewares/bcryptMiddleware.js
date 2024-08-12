const bcrypt = require("bcrypt");

const saltRounds = 10;

module.exports.hashPassword = (req, res, next) => {
  console.log("Hash Password Middleware");
    const callback = (err, hash) => {
      if (err) {
        console.error("Error bcrypt:", err);
        res.status(500).json(err);
      } else {
        res.locals.hash = hash;
        console.log(hash);
       next();
      }
    };
  
    bcrypt.hash(req.body.password, saltRounds, callback);
  };
  
module.exports.comparePassword = (req, res, next) => {
    // Check password
    const callback = (err, isMatch) => {
      if (err) {
        console.error("Error bcrypt:", err);
        //====== (Logging)Q
        logger.info('Request logged', {
          request_method: req.method,
          api_requested: req.originalUrl,
          user_ip: req.ip,
          user_os: req.headers['user-agent'],
          error_message: err, // or the error message if an error occurred
          site_id: res.locals.site_id,
          user_id: res.locals.user_id
        });
        // ==========
        res.status(500).json();
      } else {
        if (isMatch) {
          res.locals.message = "Correct password."
          next();
        } else {
          res.status(401).json({
            message: "Incorrect email or password.",
          });
        }
      }
    };
 //  console.log(req.body.password + " and " + res.locals.hash); 
    bcrypt.compare(req.body.password, res.locals.hash, callback);
  };
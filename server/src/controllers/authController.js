const authModel = require("../models/authModel");

// Check email verification status
module.exports.checkVerificationStatus = async (req, res, next) => {
  const { user_id, site_id } = res.locals;
  const data = { user_id, site_id };
  try {
    const response = await authModel.checkEmailVerify(data);
    if (response.email_verified_at === null) {
      next();
    } else {
      res
        .status(409)
        .json({ message: "Email already verified." });
      return;
    }
  } catch (error) {
    const errMsg = {
      errorFunction: "Error Checking Verification Status",
      error: error.message,
    };
    console.log(errMsg);
    res.status(500).json(errMsg);
  }
};

// Old Code to add user reord into authentication table
// module.exports.addNewAuthenticationPassword = async (req, res, next) => {
//   const { site_id, hash, user_id } = res.locals;
//   const data = {
//     site_id,
//     hash,
//     user_id,
//   };

//   try {
//     const userAuth = await authModel.insertNewAuth(data);
//     console.log("User Authentication Table", userAuth);
//     if (userAuth) {
//       next();
//     }
//   } catch (error) {
//     const errMsg = {
//       errorFunction: "Failed to add new authentication",
//       errorFunction: error.message,
//     };
//     res.status(500).json(errMsg);
//   }
// };

module.exports.storeRefreshTokenInAuth = async (req, res, next) => {
  console.log(refreshTokenInCookie);
  const { site_id, user_id } = res.locals;
  const { refresh_token } = req.cookies;
  const data = { site_id, user_id, refresh_token };

  try {
    const user = await authModel.updateAuthRefreshToken(data);
    if (user) {
      res.status(200).json({ message: user });
    } else {
      return res.status(409).json({ message: "Error!!" });
    }
  } catch (error) {
    const errMsg = {
      errorFunction: "Error storing refresh token in authentication",
      errorMessage: error.message,
    };
    console.log(errMsg);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getReport = async (req, res) => {
  try {
    const report = await authModel.getVerificationReport();
    console.log(report);
    if (report[0] === undefined) {
      res.status(204).json({ message: "Not enough data for report" });
    }else {
      res.status(200).json(report);
    }
  } catch (error) {
    console.error("Error getting report:", error);
    res.status(500).json({ message: "Failed to get report" });
  }
};

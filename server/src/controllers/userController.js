const userModel = require("../models/userModel");
const OAuthController = require("./OAuthController");
const dns = require("dns");
const { promisify } = require("util");

const checkValidDomain = async (email) => {
  const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const domainName = email.split("@")[1];

  if (!domainRegex.test(domainName)) {
    return false;
  }

  try {
    // Promisify dns.resolveMx for use with async/await
    const resolveMx = promisify(dns.resolveMx);
    const resolveA = promisify(dns.resolve4);
    const resolveCname = promisify(dns.resolveCname);

    // Check for MX records first
    const mxRecords = await resolveMx(domainName);
    console.log(mxRecords);
    if (mxRecords && mxRecords.length > 0) {
      return true;
    }

    // Fallback to A or CNAME record if no MX records are found
    const aRecords = await resolveA(domainName);
    console.log(aRecords);

    if (aRecords && aRecords.length > 0) {
      return true;
    }

    const cnameRecords = await resolveCname(domainName);
    console.log(cnameRecords);
    if (cnameRecords && cnameRecords.length > 0) {
      return true;
    }

    return false;
  } catch (err) {
    return false;
  }
};

module.exports.createNewUser = async (req, res, next) => {
  try {
    const { access_token } = res.locals;
    const { site_id } = req.params;
    const { email } = res.locals.userData.data;
    const { provider_id } = res.locals.credentials.um_provider;
    const data = { email, site_id, provider_id, access_token };

    console.log(data);

    const response = await userModel.insertUser(data);
    console.log("User Registration Response: ", response);

    res.locals.user_id = response.authentication.user_id;
    next();
  } catch (error) {
    const errMsg = {
      errorFunction: "Error Inserting User",
      error: error.message,
    };
    console.log(errMsg);
    res.status(500).json(errMsg);
    return;
  }
};

module.exports.confirmUserEmail = (req, res, next) => {
  try {
    const { sub, email, id } = res.locals.userData.data;
    const { provider_id } = res.locals.credentials.um_provider;

    const oauthId = id || sub;
    const redirectUrl =
      process.env.FRONTEND_URL +
      `/confirmEmail?email=${email}&oauthId=${oauthId}&provider=${provider_id}`;

    res.redirect(redirectUrl);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports.getUserIdByEmail = async (req, res, next) => {
  const { email } = res.locals;
  const data = { email };
  console.log("Getting User ID by Email: ", email);
  try {
    const response = await userModel.checkEmail(data);
    if (response === null) {
      res.status(401).json({ message: "Incorrect email or password" });
      return;
    } else {
      res.locals.user_id = response.user_id;
      console.log("Getting User ID by Email: ", res.locals.user_id);
      next();
    }
  } catch (error) {
    const errMsg = {
      errorFunction: "Error Getting User ID by Email",
      error: error.message,
    };
    console.log(errMsg);
    res.status(500).json(errMsg);
    return;
  }
};

module.exports.validateDomain = async (req, res, next) => {
  const { email } = req.body;
  try {
    let domainValidality = await checkValidDomain(email);
    console.log("Validate Domain: " + domainValidality);
    if (domainValidality) {
      res.locals.email = email;
      next();
    } else {
      res.status(401).json({ message: "Invalid Email Address" });
      return;
    }
  } catch (error) {
    const errMsg = {
      errorFunction: "Error Validating Domain",
      error: error.message,
    };
    console.log(errMsg);
    res.status(500).json(errMsg);
    return;
  }
};

// check email duplicates before registering
module.exports.checkEmailDuplicate = async (req, res, next) => {
  const { site_id, email } = res.locals;

  try {

      let data = { email };
      // check email in user table
      const user = await userModel.checkEmail(data);
      console.log(user);

      // if user does not exist, proceed
      if (user == null) {
        next();
      } else {
        // if user exists, get user_id
        let user_id = user.user_id;
        res.locals.user_id = user_id;
        let data = { user_id, site_id };

        // find if user exists for a specific site
        const userAndSite = await userModel.findUserByIdandSite(data);
        console.log(userAndSite);

        // if user does not exist for a specific site, proceed
        if (userAndSite == null) {
          next();
        } else {
          res
            .status(409)
            .json({ message: "Email already exists. Please log in." });
          return;
        }
      }
  } catch (error) {
    const errMsg = {
      errorFunction: "Error Checking Email Duplicate",
      error: error.message,
    };
    console.log(errMsg);
    res.status(500).json(errMsg);
    return;
  }
};

module.exports.getUserInfo = async (req, res, next) => {
  const { email } = req.body;
  const data = { email };
  try {
    const response = await userModel.checkEmail(data);

    // If user does not exist, return 404 status
    if (response === null) {
      res.status(404).json({ message: "Incorrect email or password." });
      return;
    }

    // If user exists, check verificatios status
    else {
      res.locals.user_id = response.user_id;
      res.locals.status_id = response.status_id;
      next();
    }
  } catch (error) {
    const errMsg = {
      errorFunction: "Error Checking Email Exists",
      error: error.message,
    };
    console.log(errMsg);
    res.status(500).json(errMsg);
    return;
  }
};

module.exports.checkEmailExists = async (req, res, next) => {
  const { email } = req.body;
  const data = { email };
  try {
    const response = await userModel.checkEmail(data);

    // If user does not exist, proceed to register
    if (response === null) {
      next();
    }

    // If user exists, return conflict status
    else {
      res.status(409).json({ message: "User already exits." });
      return;
    }
  } catch (error) {
    const errMsg = {
      errorFunction: "Error Checking Email Exists",
      error: error.message,
    };
    console.log(errMsg);
    res.status(500).json(errMsg);
    return;
  }
};

module.exports.registerUser = async (req, res, next) => {
  const { site_id, hash, email } = res.locals;
  const data = { email, site_id, hash };

  try {
    const response = await userModel.insertNewUser(data);
    res.locals.user_id = response[0].register_user;
    console.log("Register User: ", response);
    next();
  } catch (error) {
    const errMsg = {
      errorFunction: "Error Registering User",
      error: error.message,
    };
    console.log(errMsg);
    res.status(500).json(errMsg);
    return;
  }
};


// HEATHER
// module.exports.addNewUser = async (req, res, next) => {
//   // check if user_id has been retrieved from prev middleware
//   // if user exists in the user table
//   if (res.locals.user_id != null) {
//     next();
//   } else {
//     try {
//       const { email } = res.locals;
//       const data = { email };
//       const user = await userModel.insertNewUserNoProvider(data);
//       if (user) {
//         // Set the user_id in res.locals for use in subsequent middleware
//         res.locals.user_id = user.user_id;
//         console.log(user);
//         //  console.log(user.use_id);

//         next();
//         // return res.status(200).json(user);
//       } else {
//         // User creation failed, return conflict status
//         res.status(409).json({ message: "Error!!" });
//         return;
//       }
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ message: "Internal server error" });
//       return;
//     }
//   }
// };

// module.exports.addNewUserSiteRole = async (req, res, next) => {
//   //const siteParam = parseInt(req.params.site_id);

//   const data = {
//     site_id: res.locals.site_id,
//     user_id: res.locals.user_id,
//   };
//   // console.log(data);
//   try {
//     const user = await userModel.insertNewUserSiteRole(data);
//     if (user) {
//       return res.status(200).json({ message: "Created" });
//     } else {
//       return res.status(409).json({ message: "Error!!" });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

module.exports.updateUserStatus = async (req, res, next) => {
  const status_id = 1;
  const { user_id } = res.locals;
  const data = {
    user_id,
    status_id,
  };

  try {
    const response = await userModel.updateStatus(data);

    if (response.changedRows === 0) {
      res.status(400).json({ message: "Status not updated" });
      return;
    } else {
      console.log("Update User Status: ", response);
      next();
    }
  } catch (error) {
    const errMsg = {
      errorFunction: "Error Updating User Status",
      error: error.message,
    };
    console.log(errMsg);
    res.status(500).json(errMsg);
    return;
  }
};

module.exports.getUserDetailsUserSiteRole = async (req, res, next) => {
  const data = {
    user_id: res.locals.user_id,
    site_id: res.locals.site_id,
  };
  try {
    const user = await userModel.findUserSiteRole(data);
    // console.log(user);
    if (user == null) {
      return res
        .status(409)
        .json({ message: "etUserDetailsUserSiteRole error" });
    } else {
      res.locals.role = user.role;
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// module.exports.deleteUserByAdmin = async (req, res) => {
//   const { userId, siteId } = req.params;
//   const data = { userId, siteId };
//   try {
//       const user = await userModel.getUserByIds(data);
//       // will not be able to delete super admin as site admin can only delete user from his own site
//       // cannot delete another and site admin (can modify)
//       if (user && user.roleId !== 2) {
//           try {
//               const deletedUser = await userModel.deleteUserBySiteId(data);
//                   return res.status(200).json({ message: 'User deleted successfully' });

//           } catch (error) {
//               return res.status(400).json({ message: 'User not deleted' });
//           }
//       }
//       else if(!user)  {
//           return res.status(404).json({ message: 'User not found' });
//       }
//       else {
//           return res.status(401).json({ message: 'This action cannot be done' });
//       }
//   } catch (error) {
//       return res.status(500).json({ message: 'Internal Server Error.' });
//   }
// }

module.exports.findUserPassword = async (req, res, next) => {
  const data = {
    user_id: res.locals.user_id,
    site_id: res.locals.site_id,
  };

  try {
    console.log(data);

    const user = await userModel.findUserByIdandSite(data);
    // console.log(user);
    if (user == null || user.password == null) {
      res.status(409).json({ message: "User or site no match" });
      return;
    } else {
      res.locals.hash = user.password;
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

// get user role from user_id and site_id
module.exports.getUserDetailsUserSiteRole = async (req, res, next) => {
  const data = {
    user_id: res.locals.user_id,
    site_id: res.locals.site_id,
  };
  try {
    const user = await userModel.findUserSiteRole(data);
    // console.log(user);
    if (user == null) {
      return res
        .status(409)
        .json({ message: "getUserDetailsUserSiteRole error" });
    } else {
      res.locals.role = user.role;
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

module.exports.updateUserPassword = async (req, res, next) => {
  try {
    const { user_id, site_id, hash } = res.locals;
    const data = { user_id, site_id, hash };
    const response = await userModel.updatePasswordById(data);
    if (response.changedRows === 0) {
      res.status(400).json({ message: "Password not updated" });
      return;
    } else {
      console.log("Update User Password By ID: ", response);
      res.status(204).json({ message: "Password Updated" });
      return;
    }
  } catch (error) {
    const errMsg = {
      errorFunction: "Error Updating Password By ID",
      error: error.message,
    };
    console.log(errMsg);
    res.status(500).json(errMsg);
    return;
  }
};

module.exports.updateUserVerificationStatus = async (req, res, next) => {
  try {
    const { user_id, site_id } = res.locals;
    const data = { user_id, site_id };
    const response = await userModel.updateEmailVerification(data);
    if (response.changedRows === 0) {
      return res
        .status(400)
        .json({ message: "Verification status not updated" });
    } else {
      console.log("Update User Verification Status: ", response);
      next();
    }
  } catch (error) {
    const errMsg = {
      errorFunction: "Error Updating Verification Status",
      error: error.message,
    };
    console.log(errMsg);
    res.status(500).json(errMsg);
  }
};

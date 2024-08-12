const sessionModel = require("../models/sessionModel");
const jwtMiddleware = require("../middlewares/jwtMiddleware");
const e = require("express");

const refreshTokenDuration = process.env.JWT_REFRESH_EXPIRES_IN;

// module.exports.addNewSessionNoVerify = async (req, res, next) => {
//   res.locals.site_id = 1;
//   const site_id = parseInt(res.locals.site_id);

//   // If user has not been verified, do not add a session
//  // const { status_id } = res.locals;
//   // if (status_id === ) {
//   //   next();
//   // } 
  
//   // // If user has been verified, add a session
//   // else {
//     const data = {
//       site_id: site_id,
//       user_id: res.locals.user_id,
//       refresh_token: res.locals.refresh_token,
//     };

//     const session = await sessionModel.insertNewSession(data);

//     if (session) {
//       console.log("session " + session.refresh_token);
//       // to check whether the method is OAuth
//       // if so, need another middleware to redirect user to home page
//       if (res.locals.credentials) {
//         return res.status(403).json({ message: "Forbidden User" });
//       } else {
//         return res.status(200).json({ message: "Session created." });
//       }
//     } else {
//       return res.status(404).json({ message: "ERROR" });
//     }
//  // }
// };

// to add a new session
module.exports.addNewSession = async (req, res, next) => {
  res.locals.site_id = 1;
  const site_id = parseInt(res.locals.site_id);

  // If user has not been verified, do not add a session
  const { status_id } = res.locals;
  if (status_id === 2) {
    next();
  } 
  
  // If user has been verified, add a session
  else {
    const data = {
      site_id: site_id,
      user_id: res.locals.user_id,
      refresh_token: res.locals.refresh_token,
    };

    const session = await sessionModel.insertNewSession(data);

    if (session) {
      console.log("session " + session.refresh_token);
      // to check whether the method is OAuth
      // if so, need another middleware to redirect user to home page
      if (res.locals.credentials) {
        return res.status(403).json({ message: "Forbidden User" });
      } else {
        return res.status(200).json({ message: "Session created." });
      }
    } else {
      return res.status(404).json({ message: "ERROR" });
    }
  }
};

module.exports.checkRefreshToken = async (req, res, next) => {
  console.log("check refresh token");
  let token;
  console.log(req.cookies);

  // Check token in cookies
  // should be request from the client instead of cookie
  if (!req.cookies.refresh_token) {
    return res.status(401).json({
      refresh_token_available: false,
      message: "No refresh token available",
    });
  } else {
    token = req.cookies.refresh_token;
  }

  const data = {
    refresh_token: token,
  };

  // if refresh token is included and valid, create new access token
  try {
    const session = await sessionModel.findSessionByToken(data);
    console.log("session " + JSON.stringify(session));
    if (session) {
      res.locals.session_id = session.session_id;
      res.locals.user_id = session.user_id;
      res.locals.site_id = session.site_id;

      next();
    } else {
      return res.status(401).json({ error: "Invalid refresh token." });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "Invalid refresh token." });
  }
};

module.exports.updateRefreshToken = async (req, res) => {
  let token;
  console.log("update: " + req.cookies.refresh_token);
  // Check token in cookies
  // should be request from the client instead of cookie
  if (req.cookies.refresh_token) {
    token = req.cookies.refresh_token;
  }

  const data = {
    refresh_token: token,
    session_id: res.locals.session_id,
  };
  try {
    const session = await sessionModel.findSessionByToken(data);
    // console.log("session " + session);

    if (session.refresh_token != token) {
      const newRefreshTokenUpdate = await sessionModel.updateSessionByToken(
        data
      );
      newRefreshTokenUpdate.user_id = res.locals.user_id;
      console.log("new token");

      console.log(newRefreshTokenUpdate.refresh_token);
    }

    res.status(200).json({ user_id: res.locals.user_id });
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports.updateLogoutTimestamp = async (req, res) => {
  try {
    const { user_id, site_id } = req.params;
    let session;
    let data;
    const refresh_token = req.cookies.refresh_token;

    if (res.locals.expiry_duration) {
      // check whether the session is expired or logged out
      const expiry_duration = res.locals.expiry_duration; // Properly declare expiry_duration
      data = { user_id, site_id, refresh_token, expiry_duration };
      session = await sessionModel.updateLogoutTimestamp(data);
    } else {
      data = { user_id, site_id, refresh_token };
      session = await sessionModel.updateLogoutTimestamp(data);
    }

    if (!session) {
      res.status(404).json({ message: "Session not found" });
    } else {
      // Clearing refresh token from cookie
      res.clearCookie("refresh_token", {
        httpOnly: true,
      });
      res
        .status(200)
        .json({ message: "Logout timestamp updated successfully" });
    }
  } catch (error) {
    console.error("Error updating logout timestamp:", error);
    res.status(500).json({ message: "Failed to update logout timestamp" });
  }
};

module.exports.getReport = async (req, res) => {
  try {
    const report = await sessionModel.getSessionReport(refreshTokenDuration);
    console.log(report)
    if (report[0] === undefined) {
      return res.status(204).json({ message: "Not enough data for report" });
    } else {
      return res.status(200).json(report);
    }
  } catch (error) {
    console.error("Error getting report:", error);
    res.status(500).json({ message: "Failed to get report" });
  }
};

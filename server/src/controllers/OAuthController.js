const OAuthModel = require("../models/OAuthModel");
const dotenv = require("dotenv");
const crypto = require("crypto");
const validator = require("validator");

dotenv.config();

const authorizeURL = (provider, site_api_key) => {
  const redirectBaseUrl = "https://authinc-inc2024-group4.onrender.com";
  // const redirectBaseUrl = "localhost:5000";

  const state = crypto.randomBytes(20).toString("hex");
  const authEndpoints = {
    Github: {
      url: "https://github.com/login/oauth/authorize",
      scope: ["user:email", "repo:invite", "read:user", "codespace"],
      state: state,
      redirect_uri:
        redirectBaseUrl + `/api/OAuth/callback/${site_api_key}/${provider}`,
      response_type: null,
    },
    LinkedIn: {
      url: "https://www.linkedin.com/oauth/v2/authorization",
      scope: ["openid+email", "email"],
      state: state,
      redirect_uri:
        redirectBaseUrl + `/api/OAuth/callback/${site_api_key}/${provider}`,
      response_type: "code",
      grant_type: "authorization_code",
    },
    Google: {
      url: "https://accounts.google.com/o/oauth2/v2/auth",
      scope: [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
      ],
      state: state,
      redirect_uri:
        redirectBaseUrl + `/api/OAuth/callback/${site_api_key}/${provider}`,
      response_type: "code",
      grant_type: "authorization_code",
    },
  };

  return authEndpoints[provider];
};

module.exports.getOAuthCredentials = async (req, res, next) => {
  try {
    const { provider_name } = req.params;
    const { site_id } = res.locals;
    if (!provider_name || !site_id) {
      return res
        .status(400)
        .json({ message: "Please provide all the required fields" });
    }
    if (
      !validator.isNumeric(String(site_id)) &&
      !validator.isAlpha(String(provider_name))
    ) {
      return res
        .status(400)
        .json({ message: "Invalid user_id or site_id format" });
    }
    const data = { provider_name, site_id };
    console.log(data);

    const credentials = await OAuthModel.readOAuthCredentials(data);
    if (credentials == null) {
      res.status(404).json({ message: "No credentials found" });
    } else {
      res.locals.credentials = credentials;
      console.log(credentials);
      next();
    }
  } catch (error) {
    const errMsg = {
      errorFunction: "Error Sending OAuth Credentials",
      error: error.message,
    };
    console.log(errMsg);
    res.status(500).json(errMsg);
  }
};

module.exports.generateAuthURL = (req, res) => {
  const { provider_name } = req.params;
  const { site_api_key } = res.locals;
  const { client_id } = res.locals.credentials;
  const { url, scope, state, redirect_uri, response_type } = authorizeURL(
    provider_name,
    site_api_key
  );

  try {
    const authURL = `${url}?client_id=${client_id}&scope=${scope[0]}&state=${state}&redirect_uri=${redirect_uri}&response_type=${response_type}`;
    console.log(authURL);
    res.status(200).json({ authURL });
  } catch (error) {
    const errMsg = {
      errorFunction: "Error Generating Authorization URL",
      error: error.message,
    };
    res.status(500).json(errMsg);
  }
};

module.exports.getToken = async (req, res, next) => {
  try {
    const { provider_name, site_id } = req.params;
    const { code, error } = req.query;
    const { client_id, client_secret } = res.locals.credentials;
    const { redirect_uri, grant_type } = authorizeURL(provider_name, site_id);

    const data = {
      client_id,
      client_secret,
      code,
      redirect_uri,
      provider_name,
      grant_type,
    };

    const response = await OAuthModel.exchangeToken(data);

    const { access_token } = response.data;
    res.locals.access_token = access_token;

    console.log(response.data);
    console.log(access_token);
    next();
  } catch (error) {
    const errMsg = {
      errorFunction: "Error Generating OAuth Token",
      error: error.message,
    };
    console.log(errMsg);
    res.status(500).json(errMsg);
  }
};

module.exports.getUserData = async (req, res, next) => {
  try {
    const { access_token } = res.locals;
    const { provider_id } = res.locals.credentials.um_oauth_provider;
    const { provider_name } = req.params;

    const data = { access_token, provider_name };
    console.log(data);

    const userData = await OAuthModel.readUserData(data);
    if (userData == null) {
      res.status(404).json("Error Retrieving User Data: ", userData);
    } else {
      console.log("User profile data: ", userData.data);

      if (userData.data.email == null) {
        try {
          const userEmail = await OAuthModel.readUserEmail(data);
          userData.data.email = userEmail.data[0].email;
        } catch (error) {
          res.status(400).json({ error: error.message });
        }
      }

      res.locals.userData = userData.data;
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports.addUserOauthRelation = async (req, res, next) => {
  try {
    const { site_id, provider_id } = req.params;
    const { email, oauthId } = req.body;

    if (!site_id || !provider_id || !email || !oauthId) {
      return res
        .status(400)
        .json({ message: "Please provide all the required fields" });
    }

    const data = {
      site_id,
      provider_id,
      email,
      oauthId,
    };

    const response = await OAuthModel.addOAuthUser(data);
    res.locals.user_id = response.authentication.user_id;
    console.log(response.authentication.user_id);
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.returnOAuthCredentials = async (req, res) => {
  const { client_id, client_secret } = res.locals.credentials;
  const escaped_client_id = validator.escape(client_id);
  const escaped_client_secret = validator.escape(client_secret);
  return res.status(200).json({
    client_id: escaped_client_id,
    client_secret: escaped_client_secret,
  });
};

module.exports.validateOauthCredentials = (client_id, client_secret) => {
  const isValidClientId =
    validator.isLength(client_id, { min: 5 }) &&
    validator.isAlphanumeric(client_id, "en-US", { ignore: "-_" });

  const isValidClientSecret =
    validator.isLength(client_secret, { min: 5 }) &&
    validator.isAlphanumeric(client_secret, "en-US", { ignore: "-_" });

  return isValidClientId && isValidClientSecret;
};

module.exports.updateClientIDandSecret = async (req, res) => {
  try {
    const { site_id, provider_name } = req.params;
    const { client_id, client_secret } = req.body;
    const data = { site_id, provider_name, client_id, client_secret };

    if (!site_id || !provider_name || !client_id || !client_secret) {
      return res
        .status(400)
        .json({ message: "Please provide all the required fields" });
    }

    if (!this.validateOauthCredentials(client_id, client_secret)) {
      return res
        .status(400)
        .json({ message: "Invalid client_id or client_secret format" });
    }

    const credentials = await OAuthModel.updateOAuthCredentials(data);
    if (credentials.count === 0) {
      res.status(404).json({
        message:
          "Unable to update OAuth credentials. Either the site is invalid. ",
      });
    } else {
      res.status(200).json({ message: "Credentials updated successfully" });
    }
  } catch (error) {
    if (error.message.includes("Provider not found")) {
      res.status(404).json({ message: error.message });
    } else {
      const errMsg = {
        errorFunction: "Error updating OAuth Credentials",
        error: error.message,
      };
      console.log(errMsg);
      res.status(500).json(errMsg);
    }
  }
};

module.exports.addClientIDandSecret = async (req, res) => {
  try {
    const { site_id, provider_name } = req.params;
    const { client_id, client_secret } = req.body;
    const data = { site_id, provider_name, client_id, client_secret };

    if (!site_id || !provider_name || !client_id || !client_secret) {
      return res
        .status(400)
        .json({ message: "Please provide all the required fields" });
    }

    if (!this.validateOauthCredentials(client_id, client_secret)) {
      return res
        .status(400)
        .json({ message: "Invalid client_id or client_secret format" });
    }

    const credentials = await OAuthModel.insertOAuthCredentials(data);
    if (credentials == null) {
      res.status(404).json({
        message:
          "Unable to insert OAuth credentials. Either site or provider not found. ",
      });
    } else {
      res.status(201).json({ message: "Credentials inserted successfully" });
    }
  } catch (error) {
    if (error.message.includes("Provider not found")) {
      res.status(404).json({ message: error.message });
    } else if (error.message.includes("Credentials already exist.")) {
      res.status(409).json({ message: error.message });
    } else {
      const errMsg = {
        errorFunction: "Error inserting OAuth Credentials",
        error: error.message,
      };
      console.log(errMsg);
      res.status(500).json(errMsg);
    }
  }
};

module.exports.checkUser = async (req, res, next) => {
  try {
    const { provider_id } = res.locals.credentials.um_oauth_provider;
    const { site_id } = req.params;
    const { sub, id, email } = res.locals.userData;
    const oauth_sub_id = id || sub;

    const data = { site_id, provider_id, oauth_sub_id };
    const response = await OAuthModel.getUser(data);

    console.log("Check User Exists Log: ", response);

    if (response === null) {
      const redirectUrl =
        process.env.FRONTEND_URL +
        `/confirmEmail?email=${email}&oauthId=${oauth_sub_id}&provider=${provider_id}`;
      res.redirect(redirectUrl);
    } else {
      res.locals.user_id = response.user_id;
      console.log(res.locals.user_id);
      next();
    }
  } catch (error) {
    const errMsg = {
      errorFunction: "Error Checking User",
      error: error.message,
    };
    res.status(500).json(errMsg);
  }
};

module.exports.oauthLoginRedirect = async (req, res) => {
  console.log("OAuth Login Redirect");
  console.log("Headers:", res.getHeaders());
  res.redirect(process.env.FRONTEND_URL + "/home");
};

module.exports.checkOAuthID = async (req, res, next) => {
  try {
    const { user_id, site_id } = res.locals;
    const data = { user_id, site_id };
    const response = await OAuthModel.getOAuthID(data);
    if (response.oauth_sub_id == null) {
      next();
    } else {
      res.status(409).json({ message: "User Already Exists" });
    }
  } catch (error) {
    const errMsg = {
      errorFunction: "Error Retrieving OAuth ID",
      error: error.message,
    };
    res.status(500).json(errMsg);
  }
};

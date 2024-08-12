const requestModel = require("../models/requestModel");

// Check if request record exists for the user
// If exists, update token to a new one and set status to false
// If not, create a new request record
module.exports.checkRequest = async (req, res, next) => {
  try {
    const { user_id, site_id, service_id } = res.locals;
    const data = { user_id, site_id, service_id };

    const response = await requestModel.getRequest(data);

    if (response === null) {
      this.createRequest(req, res, next);
    } else {
      this.updateRequest(req, res, next);
    }
    console.log("Check Request Successful");
  } catch (error) {
    const errMsg = {
      errorFunction: "Error Checking Request",
      error: error.message,
    };
    console.log(errMsg);
    res.status(500).json(errMsg);
  }
};

// Check if token exists and usage status
module.exports.checkTokenAvailability = async (req, res, next) => {
  try {
    const { token } = req.body;
    const { user_id, site_id, service_id } = res.locals;
    const data = { user_id, site_id, service_id, token };

    const response = await requestModel.getRequest(data);

    console.log("Token Params: ", token);
    console.log("Token DB: ", response.token);

    if (response === null) {
      res.status(404).json({ message: "Token not found" });
      return;
    } else if (response.used === true || response.token !== token) {
      res.status(401).json({ message: "Invalid Token" });
      return;
    } else {
      console.log("Token Availability: ", response.used);
      next();
    }
  } catch (error) {
    const errMsg = {
      errorFunction: "Error Checking Token Availability",
      error: error.message,
    };
    console.log(errMsg);
    res.status(500).json(errMsg);
  }
};

// Create a new request record by the user of the requested service in the database
module.exports.createRequest = async (req, res, next) => {
  const { user_id, site_id, service_id, token } = res.locals;
  const data = { user_id, site_id, service_id, token };

  try {
    const response = await requestModel.insertRequest(data);
    console.log(
      `Create Request for service ${service_id}: ", ${JSON.stringify(response)}`
    );
    // res.status(201).json({ message: "Request created" });
    next();
  } catch (error) {
    const errMsg = {
      errorFunction: `Error Creating Request for service ${service_id}:`,
      error: error.message,
    };
    console.log(errMsg);
    res.status(500).json(errMsg);
  }
};

// Update the existing request record by the user of the requested service in the database
module.exports.updateRequest = async (req, res, next) => {
  const { user_id, site_id, service_id, token } = res.locals;
  const data = { user_id, site_id, service_id, token };

  try {
    const response = await requestModel.updateRequest(data);
    console.log(
      `Update Request for service ${service_id}: ", ${JSON.stringify(response)}`
    );
    // res.status(204).json({ message: "Request Updated" });
    next();
  } catch (error) {
    const errMsg = {
      errorFunction: `Error Updating Request for service ${service_id}:`,
      error: error.message,
    };
    console.log(errMsg);
    res.status(500).json(errMsg);
  }
};

// Validate all the token state to "used" after service is successfully completed
module.exports.updateRequestStatus = async (req, res, next) => {
  try {
    const { user_id, site_id } = res.locals;
    const data = { user_id, site_id };

    const response = await requestModel.updateUseState(data);
    if (response.changedRows === 0) {
      res.status(400).json({ message: "Token already used" });
    } else {
      console.log("Update Request Status: ", response);
      next();
    }
  } catch (error) {
    const errMsg = {
      errorFunction: "Error Updating Request Status",
      error: error.message,
    };
    console.log(errMsg);
    res.status(500).json(errMsg);
  }
};

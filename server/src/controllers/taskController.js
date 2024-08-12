const taskModel = require("../models/taskModel");

module.exports.recordForgotPasswordTask = async (req, res, next) => {
  try {
    const email = res.locals.email;
    const { user_id, site_id, token } = res.locals;
    const payload = {
      data: [email],
      content: `http://localhost:3000/resetPassword?token=${token}`,
    };
    const priorityStatus = "High";
    const p_task_name = "sendResetPassword";
    const p_table_name = "um_user";
    const p_pk_name = "user_id";

    const data = {
      p_task_name,
      p_table_name,
      p_pk_name,
      p_payload: JSON.stringify(payload),
      p_priority: priorityStatus,
      p_task_by_user: user_id,
      p_site_id: site_id,
    };

    const response = await taskModel.generateTaskQueue(data);
    console.log("Task Queue Creation Response", response);
    res.status(201).json({ message: "Task Queue Created" });
  } catch (error) {
    //====== (Logging)
    logger.info("Request logged", {
      request_method: req.method,
      api_requested: req.originalUrl,
      user_ip: req.ip,
      user_os: req.headers["user-agent"],
      error_message: error, // or the error message if an error occurred
      site_id: res.locals.site_id,
      user_id: res.locals.user_id,
    });
    // ==========
    const errMsg = {
      errorFunction: "Error Creating Task Queue",
      error: error.message,
    };
    console.log(errMsg);
    res.status(500).json(errMsg);
  }
};

module.exports.recordVerificationTask = async (req, res, next) => {
  try {
    const email = res.locals.email;
    const { user_id, site_id, token } = res.locals;
    const payload = {
      data: [email],
      content: `http://localhost:3000/verifyUser?token=${token}`,
    };
    const priorityStatus = "High";
    const p_task_name = "sendVerificationEmail";
    const p_table_name = "um_user";
    const p_pk_name = "user_id";

    const data = {
      p_task_name,
      p_table_name,
      p_pk_name,
      p_payload: JSON.stringify(payload),
      p_priority: priorityStatus,
      p_task_by_user: user_id,
      p_site_id: site_id,
    };

    const response = await taskModel.generateTaskQueue(data);
    console.log("Task Queue Creation Response", response);
    res.status(201).json({ message: "Task Queue Created" });
  } catch (error) {
    //====== (Logging)
    logger.info("Request logged", {
      request_method: req.method,
      api_requested: req.originalUrl,
      user_ip: req.ip,
      user_os: req.headers["user-agent"],
      error_message: error, // or the error message if an error occurred
      site_id: res.locals.site_id,
      user_id: res.locals.user_id,
    });
    // ==========
    const errMsg = {
      errorFunction: "Error Creating Task Queue",
      error: error.message,
    };
    console.log(errMsg);
    res.status(500).json(errMsg);
  }
};

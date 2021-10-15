const Config = require("../models/Config");

// @desc Create Config
// @route POST /api/v1/config/create
// @access Private
exports.createConfig = async (req, res, next) => {
  let config;

  try {
    config = await Config.findOne();
  } catch (err) {
    next(err);
  }

  if (!config) {
    try {
      config = await Config.create({ ...req.body });
    } catch (err) {
      next(err);
    }

    res.status(200).json({
      success: true,
      message: "Configuration data has been saved successfully",
      data: { ...config._doc },
    });
  } else {
    res.status(400).json({
      success: false,
      message:
        "A config has already been created. Use update functionality in stead",
    });
  }
};

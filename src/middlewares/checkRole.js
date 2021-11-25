const { User } = require("../../models");

exports.checkRolePartner = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.userId.id,
      },
    });

    if (user.role === "partner") {
      next();
    } else {
      res.status(401).send({
        status: "failed",
        message: "Access denied, cause you are not Partner",
      });
    }
  } catch (error) {
    res.status(401).send({
      status: "failed",
      message: "You have to login first!",
    });
  }
};

exports.checkRoleUser = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.userId.id,
      },
    });

    if (user.role === "user") {
      next();
    } else {
      res.status(401).send({
        status: "failed",
        message: "Access denied, cause you are not User",
      });
    }
  } catch (error) {
    res.status(401).send({
      status: "failed",
      message: "You have to login first!",
    });
  }
};
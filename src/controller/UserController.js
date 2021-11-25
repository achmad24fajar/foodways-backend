let { User } = require('../../models/');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.send({
      status: 'success',
      message: 'All users was successfully display',
      data: {
        users,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: 'error',
      message: 'Server error',
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await User.destroy({
      where: {
        id,
      },
    });

    res.send({
      status: 'success',
      message: 'User Succesfully Delete',
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: 'error',
      message: 'Server Error',
    });
  }
};

exports.getUsersByPartner = async (req, res) => {
  try {
    const { partner } = req.params;

    const usersFromDB = await User.findAll({
      where: {
        role: 'partner',
      },
      attributes: {
        exclude: [
          'email',
          'password',
          'phone',
          'location',
          'role',
          'createdAt',
          'updatedAt',
        ],
      },
    });

    const usersString = JSON.stringify(usersFromDB);
    const users = JSON.parse(usersString);

    res.send({
      status: 'Success',
      message: 'All partner was successfully get',
      data: {
        users,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: 'error',
      message: 'Server Error',
    });
  }
};

exports.getUsersBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const usersFromDB = await User.findOne({
      where: {
        slug: slug,
      },
      attributes: {
        exclude: [
          'email',
          'password',
          'phone',
          'location',
          'role',
          'createdAt',
          'updatedAt',
        ],
      },
    });

    const usersString = JSON.stringify(usersFromDB);
    const user = JSON.parse(usersString);

    res.send({
      status: 'Success',
      message: 'All partner was successfully get',
      data: {
        user,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: 'error',
      message: 'Server Error',
    });
  }
};

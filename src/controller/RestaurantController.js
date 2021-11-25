let { Restaurant, User } = require('../../models/');
const bcrypt = require('bcrypt');

exports.addRestaurant = async (req, res) => {
  try {
    const {
      restaurant_name,
      open,
      close,
      email,
      telephone,
      longitude,
      langitude,
    } = req.body;

    const point = { type: 'Point', coordinates: [longitude, langitude] };

    const checkResto = await Restaurant.findOne({
      where: {
        userId: req.userId.id,
      },
    });

    if (checkResto) {
      return res.status(400).send({
        status: 'error',
        message: 'You cannot make more than 1 restaurant!',
      });
    }
    const resto = await Restaurant.create({
      restaurant_name: restaurant_name,
      open: open,
      close: close,
      email: email,
      telephone: telephone,
      address: point,
      userId: req.userId.id,
    });

    console.log(resto);

    if (!resto) {
      return res.status(400).send({
        status: 'error',
        message: 'Your data is not valid!.',
      });
    }

    res.send({
      status: 'success',
      message: `Congrats ${resto.restaurant_name}!`,
    });
  } catch (err) {
    res.send({
      status: 'error',
      message: 'Server error',
    });
  }
};

exports.getRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      where: {
        userId: req.userId.id,
      },
    });

    if (!restaurant) {
      return res.status(400).send({
        status: 'error',
        message: 'Restaurant not found!',
      });
    }

    res.send({
      status: 'success',
      message: 'Restourant is available!',
      data: restaurant,
    });
  } catch (err) {
    res.send({
      status: 'error',
      message: 'Server error',
    });
  }
};

exports.updateRestaurant = async (req, res) => {
  try {
    const {
      restaurant_name,
      open,
      close,
      email,
      telephone,
      longitude,
      langitude,
    } = req.body;

    const point = { type: 'Point', coordinates: [longitude, langitude] };

    const restaurant = await Restaurant.findOne({
      where: {
        userId: req.userId.id,
      },
    });

    if (!restaurant) {
      return res.status(400).send({
        status: 'error',
        message: 'Restaurant not found!',
      });
    }

    const updateResto = await Restaurant.update(
      {
        restaurant_name: restaurant_name,
        open: open,
        close: close,
        email: email,
        telephone: telephone,
        address: point,
      },
      {
        where: req.userId.id,
      }
    );

    res.send({
      status: 'success',
      message: 'Restaurant was successfully updated!',
      data: updateResto,
    });
  } catch (err) {
    res.send({
      status: 'error',
      message: 'Server error',
    });
  }
};

exports.deleteRestaurant = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.userId.id,
      },
    });

    const isValidPass = await bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!isValidPass) {
      return res.status(400).send({
        status: 'error',
        message: 'Password is invalid!',
      });
    }

    await Restaurant.destroy({
      where: {
        userId: req.userId.id,
      },
    });

    res.send({
      status: 'success',
      message: 'Your restaurant are closed!',
    });
  } catch {
    res.status(500).send({
      status: 'error',
      message: 'Server error',
    });
  }
};

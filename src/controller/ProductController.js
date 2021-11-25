let { Product, User, Restaurant } = require('../../models/');
const Sequelize = require('sequelize');
const Joi = require('joi');
const CryptoJS = require('crypto-js');
const { decrypt } = require('crypto-js/aes');

exports.getProducts = async (req, res) => {
  try {
    const { restaurant_name } = req.params;

    const restaurant = await Restaurant.findOne({
      where: {
        restaurant_name: restaurant_name,
      },
    });

    const products = await Product.findAll({
      where: {
        userId: restaurant.dataValues.userId,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'UserId'],
      },
    });
    res.send({
      status: 'success',
      message: 'Users Succesfully Get',
      data: {
        restaurant_name: restaurant.dataValues.restaurant_name,
        products,
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

exports.getDetailProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'UserId'],
      },
    });

    const restaurant = await Restaurant.findOne({
      where: {
        userId: product.dataValues.userId,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'role', 'password'],
      },
    });

    res.send({
      status: 'success',
      message: 'User Succesfully Get',
      data: {
        restaurant,
        product,
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

exports.getProductsByUser = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      where: {
        userId: req.userId.id,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'userId', 'UserId'],
      },
    });
    const products = await Product.findAll({
      where: {
        userId: req.userId.id,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'userId', 'UserId'],
      },
    });
    res.send({
      status: 'success',
      message: 'Users Succesfully Get',
      data: {
        restaurant,
        products,
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

exports.getDetailProductWithAuth = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'userId', 'UserId'],
      },
    });

    const restaurant = await Restaurant.findOne({
      where: {
        userId: req.userId.id,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'role', 'password'],
      },
    });

    res.send({
      status: 'success',
      message: 'User Succesfully Get',
      data: {
        restaurant,
        product,
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

exports.addProduct = async (req, res) => {
  try {
    const { title, price } = req.body;

    console.log(req.body);

    const schema = Joi.object({
      title: Joi.string().required(),
      price: Joi.number().required(),
    });

    const { error } = schema.validate(req.body);

    if (error)
      return res.status(400).send({
        status: 'validation failed',
        message: error.details[0].message,
      });

    const postProduct = await Product.create({
      title: title,
      price: price,
      image: req.files.image[0].filename,
      userId: req.userId.id,
    });

    const product = await Product.findOne({
      where: {
        id: postProduct.id,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'userId', 'UserId'],
      },
    });

    const restaurant = await Restaurant.findOne({
      where: {
        userId: req.userId.id,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });

    res.send({
      status: 'success',
      message: 'Users Succesfully Get',
      data: {
        product: {
          ...product.dataValues,
          restaurant,
        },
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

exports.editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, price, image } = req.body;

    const schema = Joi.object({
      title: Joi.string().required(),
      price: Joi.required(),
    });

    const { error } = schema.validate(req.body);

    if (error)
      return res.status(400).send({
        status: 'validation failed',
        message: error.details[0].message,
      });

    const checkId = await Product.findOne({
      where: {
        id,
      },
    });

    if (!checkId)
      return res.send({
        status: 'success',
        message: `Data with id: ${id} not found`,
      });

    const updateProduct = await Product.update(
      {
        title: title,
        price: price,
        image: req.files.image[0].filename,
      },
      {
        where: {
          id,
        },
      }
    );

    const product = await Product.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: User,
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'role'],
          },
        },
      ],
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'userId', 'UserId'],
      },
    });

    res.send({
      status: 'success',
      message: 'Users Succesfully Get',
      data: {
        product,
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

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await Product.destroy({
      where: {
        id,
      },
    });

    res.send({
      status: 'success',
      message: 'Product Succesfully Delete',
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: 'error',
      message: 'Server Error',
    });
  }
};

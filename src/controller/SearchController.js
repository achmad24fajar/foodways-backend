const { Product, Restaurant } = require('../../models');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.Search = async (req, res) => {
  const products = await Product.findAll({
    where: {
      title: {
        [Op.like]: `%${req.body.keyword}%`,
      },
    },
  });
};

const { Transaction, Order, Product, User } = require('../../models');
const { Op } = require('sequelize');

exports.getTransactions = async (req, res) => {
  try {
    const userId = req.userId.id;

    const transactionsFromDB = await Transaction.findAll({
      where: {
        partnerId: userId,
      },
      include: [
        {
          model: User,
          attributes: {
            exclude: [
              'id',
              'email',
              'password',
              'role',
              'gender',
              'phone',
              'createdAt',
              'updatedAt',
              'image',
              'location',
              'slug',
            ],
          },
        },
        {
          model: Order,
          as: 'orders',
          attributes: {
            exclude: [
              'transactionId',
              'createdAt',
              'updatedAt',
              'ProductId',
              'productId',
              'TransactionId',
            ],
          },
          include: [
            {
              model: Product,
              attributes: {
                exclude: ['id', 'createdAt', 'updatedAt', 'price'],
              },
            },
          ],
        },
      ],
      attributes: {
        exclude: ['updatedAt', 'userId'],
      },
    });

    const transactionsString = JSON.stringify(transactionsFromDB);
    const transactionsObject = JSON.parse(transactionsString);
    console.log(transactionsObject.User);

    const loopTransactions = transactionsObject.map((transaction) => {
      const order = transaction.orders.map((order) => {
        return {
          id: order.id,
          ...order.Product,
          qty: order.qty,
        };
      });
      return {
        id: transaction.id,
        ...transaction.User,
        status: transaction.status,
        total: transaction.total,
        orders: {
          order,
        },
      };
    });

    res.send({
      status: 'Success',
      message: 'All data successfully get',
      data: {
        transaction: loopTransactions,
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

exports.getDetailTransactions = async (req, res) => {
  try {
    const { id } = req.params;
    const transactions = await Transaction.findAll({
      where: {
        id,
      },
      include: [
        {
          model: User,
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'role', 'password'],
          },
        },
        {
          model: Order,
          as: 'orders',
          where: {
            transactionId: id,
          },
          attributes: {
            exclude: [
              'transactionId',
              'createdAt',
              'updatedAt',
              'ProductId',
              'productId',
              'TransactionId',
            ],
          },
          include: [
            {
              model: Product,
              attributes: {
                exclude: ['id', 'createdAt', 'updatedAt', 'userId'],
              },
            },
          ],
        },
      ],
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'UserId'],
      },
    });

    res.send({
      status: 'success',
      message: 'Users Succesfully Get',
      data: {
        transactions,
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

exports.addTransactions = async (req, res) => {
  try {
    const products = req.body;
    console.log(req.body);
    let totalPrice = 0;
    let total = 0;
    let partnerId = 0;

    const addTransaction = await Transaction.create({
      userId: req.userId.id,
      status: 'Pending',
    });

    const saveData = await products.forEach((product) => {
      totalPrice = product.price * product.qty;
      total += totalPrice;
      partnerId = product.userId;
      const saveOrders = Order.create({
        productId: product.id,
        qty: product.qty,
        transactionId: addTransaction.dataValues.id,
        totalPrice: totalPrice,
      });
    });

    const updateTransaction = await Transaction.update(
      {
        total: total + 20000,
        partnerId: partnerId,
      },
      {
        where: {
          id: addTransaction.dataValues.id,
        },
      }
    );

    const user = await User.findOne({
      where: {
        id: req.userId.id,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'role', 'password'],
      },
    });

    const orderuser = await Order.findAll({
      where: {
        transactionId: addTransaction.dataValues.id,
      },
      include: [
        {
          model: Product,
          attributes: {
            exclude: ['id', 'createdAt', 'updatedAt', 'userId'],
          },
        },
      ],
      attributes: {
        exclude: [
          'transactionId',
          'createdAt',
          'updatedAt',
          'ProductId',
          'productId',
          'TransactionId',
        ],
      },
    });

    res.send({
      status: 'success',
      message: 'Users Succesfully Get',
      data: {
        transactions: {
          id: addTransaction.dataValues.id,
          user: user.dataValues,
          status: 'Pending',
          orders: orderuser,
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

exports.editTransactions = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;

    const editTransaction = await Transaction.update(body, {
      where: {
        id,
      },
    });

    const idUser = await Transaction.findOne({
      where: {
        id,
      },
    });

    const user = await User.findOne({
      where: {
        id: idUser.dataValues.userId,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'role', 'password'],
      },
    });

    const orderuser = await Order.findAll({
      where: {
        transactionId: id,
      },
      include: [
        {
          model: Product,
          attributes: {
            exclude: ['id', 'createdAt', 'updatedAt', 'userId'],
          },
        },
      ],
      attributes: {
        exclude: [
          'transactionId',
          'createdAt',
          'updatedAt',
          'ProductId',
          'productId',
          'TransactionId',
        ],
      },
    });

    res.send({
      status: 'success',
      message: 'Users Succesfully Get',
      data: {
        transactions: {
          id: id,
          user: user.dataValues,
          status: idUser.dataValues.status,
          orders: orderuser,
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

exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId.id;

    const getTransaction = await Transaction.findOne({
      where: {
        id: id,
      },
    });

    if (!getTransaction) {
      return res.status(400).send({
        status: 'failed',
        message: 'Id not found',
      });
    }

    const checkUser = getTransaction.dataValues.userId == userId ? true : false;

    if (!checkUser) {
      return res.status(400).send({
        status: 'failed',
        message: 'You have not authorization to delete this transaction',
      });
    }

    const orders = await Order.findAll({
      where: {
        transactionId: id,
      },
    });

    await orders.forEach((order) => {
      const dOrder = Order.destroy({
        where: {
          transactionId: id,
        },
      });
    });

    const dTransaction = await Transaction.destroy({
      where: {
        id: id,
      },
    });

    res.send({
      status: 'success',
      message: 'Users Succesfully Get',
      data: {
        status: 'Success',
        message: 'Data successfully deleted',
        data: {
          id: id,
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

exports.myTransactions = async (req, res) => {
  try {
    const userId = req.userId.id;

    const transactionsFromDB = await Transaction.findAll({
      where: {
        userId: userId,
      },
      include: [
        {
          model: Order,
          as: 'orders',
          attributes: {
            exclude: [
              'transactionId',
              'createdAt',
              'updatedAt',
              'ProductId',
              'productId',
              'TransactionId',
            ],
          },
          include: [
            {
              model: Product,
              attributes: {
                exclude: ['id', 'createdAt', 'updatedAt', 'price'],
              },
            },
          ],
        },
      ],
      attributes: {
        exclude: ['updatedAt', 'userId'],
      },
    });

    const transactionsString = JSON.stringify(transactionsFromDB);
    const transactionsObject = JSON.parse(transactionsString);

    console.log(transactionsObject[0].orders);

    const loopTransactions = transactionsObject.map((transaction) => {
      const order = transaction.orders.map((order) => {
        return {
          id: order.id,
          ...order.Product,
          qty: order.qty,
        };
      });
      return {
        id: transaction.id,
        status: transaction.status,
        total: transaction.total,
        orders: {
          order,
        },
      };
    });

    if (!transactionsObject) {
      return res.status(400).send({
        status: 'failed',
        message: "You haven't transaction yet",
      });
    }

    res.send({
      status: 'Success',
      message: 'All data successfully get',
      data: {
        transaction: loopTransactions,
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

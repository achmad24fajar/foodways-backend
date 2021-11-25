const express = require('express');
const router = express.Router();

const { uploadFile } = require('../middlewares/upload');
const { authenticated } = require('../middlewares/auth');

const {
  getUsers,
  deleteUser,
  getUsersByPartner,
  getUsersBySlug,
} = require('../controller/UserController');
const {
  getProducts,
  getProductsByUser,
  getDetailProductWithAuth,
  addProduct,
  editProduct,
  deleteProduct,
  getDetailProduct,
} = require('../controller/ProductController');
const {
  registerUser,
  loginUser,
  checkAuth,
} = require('../controller/AuthController');
const { checkRolePartner, checkRoleUser } = require('../middlewares/checkRole');
const {
  getTransactions,
  getDetailTransactions,
  addTransactions,
  editTransactions,
  deleteTransaction,
  myTransactions,
} = require('../controller/TransactionController');
const {
  addRestaurant,
  getRestaurant,
} = require('../controller/RestaurantController');

router.get('/users', getUsers);
router.get('/users/:role', getUsersByPartner);
router.get('/user/:slug', getUsersBySlug);
router.delete('/users/:id', deleteUser);
router.post('/user/restaurant', authenticated, addRestaurant);
router.get('/user/get/restaurant', authenticated, getRestaurant);

// Product with Auth
router.post(
  '/product',
  authenticated,
  checkRolePartner,
  uploadFile('image', ''),
  addProduct
);
router.patch(
  '/product/:id',
  authenticated,
  uploadFile('image', ''),
  editProduct
);
router.delete('/product/:id', authenticated, checkRolePartner, deleteProduct);
router.get('/products', authenticated, getProductsByUser);
router.get('/product/partner/:id', authenticated, getDetailProductWithAuth);

// Product without Auth
router.get('/products/:restaurant_name', getProducts);
router.get('/product/:id', getDetailProduct);

router.get('/transactions', authenticated, checkRolePartner, getTransactions);
router.get(
  '/transaction/:id',
  authenticated,
  checkRolePartner,
  getDetailTransactions
);
router.post('/transaction', authenticated, checkRoleUser, addTransactions);
router.patch(
  '/transaction/:id',
  authenticated,
  checkRolePartner,
  editTransactions
);
router.delete(
  '/transaction/:id',
  authenticated,
  checkRoleUser,
  deleteTransaction
);
router.get('/my-transactions', authenticated, checkRoleUser, myTransactions);

router.post('/register', uploadFile('image', ''), registerUser);
router.post('/login', loginUser);
router.get('/check-auth', authenticated, checkAuth);

module.exports = router;

const { Router } = require('express');
const multer = require('multer');
const uploadConfig = require('../config/upload');

const DishesController = require('../controllers/DishesController');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const ensureIsAdmin = require('../middlewares/ensureIsAdmin');

const dishesRoutes = Router();
const upload = multer(uploadConfig.MULTER);

const dishesController = new DishesController();

dishesRoutes.use(ensureAuthenticated);

dishesRoutes.post(
  '/',
  ensureIsAdmin,
  upload.single('img'),
  dishesController.create
);
dishesRoutes.get('/', dishesController.index);
dishesRoutes.get('/:id', dishesController.show);
dishesRoutes.delete('/:id', ensureIsAdmin, dishesController.delete);
dishesRoutes.put(
  '/:id',
  ensureIsAdmin,
  upload.single('img'),
  dishesController.update
);

module.exports = dishesRoutes;
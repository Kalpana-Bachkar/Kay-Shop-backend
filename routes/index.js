import express from 'express';

const router = express.Router();

import { getAllProducts, getProductById, getProductByName, getProductByCategory } from '../Controllers/index.js';

// router.get('/', controller.getAllProducts);
router.get('/products', getAllProducts);
router.get('/productById/:id', getProductById);
router.get('/productByName/:name', getProductByName);
router.get('/productByCategory/:category', getProductByCategory);


export default router;
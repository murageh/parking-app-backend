import express from 'express';
const router = express.Router();
import paymentController from '../controllers/payments.controller.mjs';

/* GET payments. */
router.get('/', paymentController.get);

// GET payment by id
router.get('/:id', paymentController.getSingle);

/* POST payment */
router.post('/', paymentController.create);

/* PUT payment */
router.put('/:id', paymentController.update);

/* DELETE payment */
router.delete('/:id', paymentController.remove);

export default router;

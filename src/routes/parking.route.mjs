import express from 'express';
const router = express.Router();
import parkingController from '../controllers/parking.controller.mjs';

/* GET payments. */
router.get('/', parkingController.get);

// GET user by id
router.get('/:id', parkingController.getSingle);

/* POST user */
router.post('/', parkingController.create);

/* PUT user */
router.put('/:id', parkingController.update);

/* DELETE user */
router.delete('/:id', parkingController.remove);

export default router;

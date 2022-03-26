import express from 'express';
const router = express.Router();
import usersController from '../controllers/user.controller.mjs';

/* GET payments. */
router.get('/', usersController.get);

// GET user by id
router.get('/:id', usersController.getSingle);

// GET bill by user id
router.get('/:id/getBill', usersController.getBill);

/* POST user */
router.post('/', usersController.create);

/* user login */
router.post('/login', usersController.login);

/* book parking */
router.post('/:id/bookParking', usersController.bookParking);

/* book parking */
router.post('/:id/pay', usersController.pay);

/* PUT user */
router.put('/:id', usersController.update);

/* DELETE user */
router.delete('/:id', usersController.remove);

export default router;

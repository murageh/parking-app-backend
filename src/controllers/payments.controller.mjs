import payments from '../services/payments.service.mjs';

// payments.destroy().then(res => console.log(res));
// payments.init().then(res => console.log(res));

async function get(req, res, next) {
  try {
      res.json(await payments.getMultiple());
  } catch (err) {
      console.error(`Error while getting payments. `, err.message);
      next(err);
  }
}

async function getSingle(req, res, next) {
  try {
      res.json(await payments.getSingle(req.params.id));
  } catch (err) {
      console.error(`Error while getting payment. `, err.message);
      next(err);
  }
}

async function create(req, res, next) {
  try {
    res.json(await payments.create(req.body));
  } catch (err) {
    console.error(`Error while creating payment.`, err.message);
    next(err);
  }
}

async function update(req, res, next) {
  try {
    res.json(await payments.update(req.params.id, req.body));
  } catch (err) {
    console.error(`Error while updating payment. `, err.message);
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    res.json(await payments.remove(req.params.id));
  } catch (err) {
    console.error(`Error while deleting payment. `, err.message);
    next(err);
  }
}

export default {
  get,
  getSingle,
  create,
  update,
  remove
};

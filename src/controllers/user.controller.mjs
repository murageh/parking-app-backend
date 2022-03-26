import users from '../services/users.service.mjs';

// payments.destroy().then(res => console.log(res));
// payments.init().then(res => console.log(res));

async function get(req, res, next) {
  try {
      res.json(await users.getMultiple());
  } catch (err) {
      console.error(`Error while getting users. `, err.message);
      next(err);
  }
}

async function getSingle(req, res, next) {
  try {
      res.json(await users.getSingle(req.params.id));
  } catch (err) {
      console.error(`Error while getting user. `, err.message);
      next(err);
  }
}

async function create(req, res, next) {
  try {
    res.json(await users.create(req.body));
  } catch (err) {
    console.error(`Error while creating user`, err.message);
    next(err);
  }
}

async function login(req, res, next) {
  try {
    res.json(await users.login(req.body));
  } catch (err) {
    console.error(`Error while logging in. `, err.message);
    next(err);
  }
}

async function bookParking(req, res, next) {
  try {
    res.json(await users.bookParking(req.params.id, req.body));
  } catch (err) {
    console.error(`Error while booking parking. `, err.message);
    next(err);
  }
}

async function getBill(req, res, next) {
  try {
    res.json(await users.getBill(req.params.id));
  } catch (err) {
    console.error(`Error while getting user bill. `, err.message);
    next(err);
  }
}

async function pay(req, res, next) {
  try {
    res.json(await users.pay(req.params.id, req.body));
  } catch (err) {
    console.error(`Error while paying. `, err.message);
    next(err);
  }
}

async function update(req, res, next) {
  try {
    res.json(await users.update(req.params.id, req.body));
  } catch (err) {
    console.error(`Error while updating user. `, err.message);
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    res.json(await users.remove(req.params.id));
  } catch (err) {
    console.error(`Error while deleting user. `, err.message);
    next(err);
  }
}

export default {
  get,
  getSingle,
  create,
  login,
  getBill,
  bookParking,
  pay,
  update,
  remove
};

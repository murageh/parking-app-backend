import parkingSpots from '../services/parking.service.mjs';

// payments.destroy().then(res => console.log(res));
// payments.init().then(res => console.log(res));

async function get(req, res, next) {
  try {
      res.json(await parkingSpots.getMultiple());
  } catch (err) {
      console.error(`Error while getting parking spots. `, err.message);
      next(err);
  }
}

async function getSingle(req, res, next) {
  try {
      res.json(await parkingSpots.getSingle(req.params.id));
  } catch (err) {
      console.error(`Error while getting parking spot. `, err.message);
      next(err);
  }
}

async function create(req, res, next) {
  try {
    res.json(await parkingSpots.create(req.body));
  } catch (err) {
    console.error(`Error while creating parking spot.`, err.message);
    next(err);
  }
}

async function update(req, res, next) {
  try {
    res.json(await parkingSpots.update(req.params.id, req.body));
  } catch (err) {
    console.error(`Error while updating parking spot. `, err.message);
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    res.json(await parkingSpots.remove(req.params.id));
  } catch (err) {
    console.error(`Error while deleting parking spot. `, err.message);
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

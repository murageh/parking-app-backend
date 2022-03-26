import db from "../models/index.mjs";
const bcrypt = import("bcrypt");
const {sequelize, users, parkingSpots, payments} = db;

async function destroy() {
    let message = 'Database deleted successfully';
    let success = true;

    try {
        await parkingSpots.destroy().then(res => console.log("deleting database " + res));
    } catch (error) {
        message = 'Could not delete database ' + error;
        success = false;
    }

    return {success, message};
}

async function init() {
    // const connection = await mysql.createConnection(dbConfig);
    let message = 'Parking Spots table initialized successfully';
    let success = true;

    try {
        await parkingSpots.sync().then(res => console.log("table initialization " + res));
    } catch (error) {
        message = 'Could not initialize parking spots table ' + error;
        success = false;
    }

    return {success, message};
}

async function getMultiple() {
    let success = true, message = "Fetch successful";
    const savedSPots = await parkingSpots.findAll().catch(error => {
        success = false;
        message = "Could not fetch parking spots. " + error
    });

    return {
        success,
        message,
        spots: savedSPots,
    }
}

async function getSingle(id) {
    let success = true, message = "Fetch successful";

    const spot = await parkingSpots.findByPk(id).catch(error => {
        success = false;
        message = "Could not fetch parking spot. " + error
    });

    return {
        success: true,
        spot: spot ?? {},
    }
}

async function getSingleFromUserId(userId) {
    let success = true, message = "Fetch successful";

    const spots = await parkingSpots.findAll({
        where: {
            UserId: userId
        },
    }).catch(error => {
        success = false;
        message = "Could not fetch parking spots by user id. " + error
    });

    return {
        success: true,
        spots: spots ?? [],
    }
}

async function create(body) {
    let message = 'Parking spot created successfully.';
    let success = true;

    const spot = await parkingSpots.create({
        name: body.name,
        cost: body.cost,
        duration: body.duration,
        lateFee: body.lateFee
    }).catch(error => {
        success = false;
        console.log(error.errors);
        const e = error.errors[0] ?? {};
        message = "Could not create parking spot. " + e?.message ?? "";
    });

    return {success, message, spot: spot ?? {}};
}

async function update(id, spot) {
    let message = 'Parking Spot updated successfully.';
    let success = true;

    const savedSpot = await parkingSpots.findOne({
        where: {
            id: id
        },
    });

    let obj = {};
    const keys = spot.keys();
    for (let key of keys) {
        obj[key] = spot[key];
    }

    await savedSpot.update({
        ...obj
    }).catch(error => {
        success = false;
        message = "Could not update parking spot. " + error
    });

    await savedSpot.reload();

    return {success, message, spot: savedSpot};
}

async function remove(id) {
    let message = 'Parking spot deleted successfully.';
    let success = true;

    await parkingSpots.destroy({
        where: {
            id
        }
    }).catch(error => {
        success = false;
        message = "Could not delete parking spot. " + error
    });

    return {success, message};
}

export default {
    init,
    destroy,
    getMultiple,
    getSingle,
    create,
    update,
    remove
}

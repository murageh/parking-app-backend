import db from "../models/index.mjs";
const bcrypt = import("bcrypt");
const {sequelize, users, parkingSpots, payments} = db;

async function destroy() {
    let message = 'Database deleted successfully';
    let success = true;

    try {
        await users.destroy().then(res => console.log("deleting database " + res));
    } catch (error) {
        message = 'Could not delete database ' + error;
        success = false;
    }

    return {success, message};
}

async function init() {
    // const connection = await mysql.createConnection(dbConfig);
    let message = 'User table initialized successfully';
    let success = true;

    try {
        await users.sync().then(res => console.log("table initialization " + res));
    } catch (error) {
        message = 'Could not initialize user table ' + error;
        success = false;
    }

    return {success, message};
}

async function getMultiple() {
    let success = true, message = "Fetch successful";
    const usersSaved = await users.findAll({
        attributes: {exclude: ['password']},
        include: [db.parkingSpots, db.payments],
    }).catch(error => {
        success = false;
        message = "Could not fetch payments. " + error
    });

    return {
        success,
        message,
        users: usersSaved,
    }
}

async function getSingle(id) {
    let success = true, message = "Fetch successful";

    const user = await users.findByPk(id, {
        attributes: {exclude: ['password']},
        include: [db.parkingSpots, db.payments]
    }).catch(error => {
        success = false;
        message = "Could not fetch payments. " + error
    });

    return {
        success: true,
        user: user ?? {},
    }
}

async function getSingleFromEmail(email) {
    let success = true, message = "Fetch successful";

    const user = await users.findOne({
        where: {
            email: email
        },
        include: [db.parkingSpots, db.payments],
        attributes: {exclude: ['password']}
    }).catch(error => {
        success = false;
        message = "Could not fetch user. " + error
    });

    return {
        success: true,
        user: user ?? {},
    }
}

async function login(body) {
    let success = true, message = "Login successful";

    const user = await users.findOne({
        where: {
            email: body.email
        },
        include: [db.parkingSpots, db.payments],
    }).catch(error => {
        success = false;
        message = "Could not login. " + error
    });
    if (!user) {
        return {
            success: false, message: "Invalid email.", user: {}
        }
    }
    // console.log({user})
    const validPassword = (await bcrypt).compareSync(body.password, user.password ?? undefined);

    if (validPassword) return {
        success, message, user
    }; else return {
        success: false, message: "Invalid password", user: {}
    }
}

async function getBill(id) {
    let success = true, message = "Bill fetched successfully.";

    const user = await users.findOne({
        where: {
            id: id
        },
        include: [db.parkingSpots, db.payments],
    }).catch(error => {
        success = false;
        message = "Could not find user. " + error
    });

    if (!user.parkingSpot) {
        return {success: false, message: "User has not booked any space", bill: 0}
    }

    const startTime = new Date(user.parkingSpot.bookedAt);
    const endTime = new Date();

    const flatFee = user.parkingSpot.cost;
    const additionalFee = Math.ceil((((endTime - startTime) / (1000 * 60)) - 5 - user.parkingSpot.duration ) * user.parkingSpot.lateFee);
    let totalCost = flatFee + additionalFee;
    if (totalCost < flatFee) totalCost = flatFee;

    return {
        success,
        message,
        startTime, endTime, flatFee, additionalFee,
        totalCost,
        user
    };
}

async function bookParking(id, body) {
    let success = true, message = "Parking spot booked successfully";
    const spotId = body.parkingSpotId;
    let carRegNumber = body.carRegNo;

    if (!spotId || !carRegNumber){
        return {success: false, message: `spotId or carRegNumber cannot be null.`, user: {}}
    }

    const user = await users.findOne({
        where: {
            id: id
        },
        include: [db.parkingSpots, db.payments],
    }).catch(error => {
        success = false;
        message = "Could not find user. " + error
    });
     if (!user){
         return {success: false, message: `User does not exist.`, user: {}}
     }
    if (user.parkingSpot !== null) {
        return {success: false, message: `User has already booked a spot with ID(${user.parkingSpot.id})`, user: {}}
    }

    const onlineSpot = await parkingSpots.findOne({where: {id: spotId}})
        .catch(e => console.log(e));

    if (!onlineSpot){
        return {success: false, message: `The requested parking spot does not exist.`, user: {}}
    }

    if (onlineSpot.booked){
        return {success: false, message: `The requested parking spot is already booked.`, user: {}}
    }

    carRegNumber = carRegNumber.toUpperCase();

    await user.update({
        carRegNumber: carRegNumber,
        // ParkingSpotId: onlineSpot['id'],
    }).catch(e => {
        console.log(e);
        success = false;
        message = "Could not update user details. " + e;
    });
    await onlineSpot.update({
        booked: true,
        currentVehicle: carRegNumber,
        bookedAt: sequelize.fn('NOW')
    }).catch(e => {
        console.log(e);
        success = false;
        message = "Could not update parking spot details. " + e
    });

    await user.setParkingSpot(onlineSpot);
    await onlineSpot.setUser(user);

    await user.reload();

    return {
        success, message, user
    };
}

async function pay(id, body) {
    let success = true, message = "Payment successful.";
    let carRegNumber = null;

    const user = await users.findOne({
        where: {
            id: id
        },
        include: db.parkingSpots,
    }).catch(error => {
        success = false;
        message = "Could not find user. " + error
    });

    if (!user){
        return {success: false, message: `User does not exist.)`, paid: 0}
    }
    if (!user.parkingSpot){
        return {success: false, message: `User has not booked any parking spot.)`, paid: 0}
    }

    const onlineSpot = await parkingSpots.findOne({where: {id: user.parkingSpot.id}})
        .catch(e => console.log(e));

    carRegNumber = onlineSpot.dataValues.currentVehicle;
    const payment = await payments.create({
        amountPaid: body.amount,
        carRegNumber,
        parkingSpotName: user.parkingSpot.name
        // UserId: user.id,
        // OnlineSpotId: onlineSpot.id,
    }).catch(e => {
        console.log(e);
        success = false;
        message = "Could not create payment details. " + e
    });

    await user.setParkingSpot(null).catch(e => {
        console.log(e);
        success = false;
        message = "Could not update user details. " + e;
    });
    await onlineSpot.update({
        booked: false,
        currentVehicle: null,
        bookedAt: null
    }).catch(e => {
        console.log(e);
        success = false;
        message = "Could not update parking spot details. " + e
    });
    await user.addPayment(payment);
    await onlineSpot.addPayment(payment);

    await user.reload();

    return {
        success, message, paid: body.amount
    };
}

async function create(body) {
    let message = 'User created successfully.';
    let success = true;

    const user = await users.create({
        name: body.name,
        email: body.email,
        password: body.password
    }).catch(error => {
        success = false;
        console.log(error.errors);
        const e = error.errors[0] ?? {};
        message = "Could not create user. " + e?.message ?? "";
    });

    return {success, message, user: user ?? {}};
}

async function update(id, user) {
    let message = 'User updated successfully.';
    let success = true;

    const savedUser = await users.findOne({
        where: {
            id: id
        },
    });

    let obj = {...user}; //TODO: Unsafe. Should filter settable fields.

    await savedUser.update({
        ...obj
    }).catch(error => {
        success = false;
        message = "Could not update user. " + error
    });

    await savedUser.reload();

    return {success, message, user: savedUser};
}

async function remove(id) {
    let message = 'User deleted successfully.';
    let success = true;

    await users.destroy({
        where: {
            id
        }
    }).catch(error => {
        success = false;
        message = "Could not delete user. " + error
    });

    return {success, message};
}

export default {
    init,
    destroy,
    getMultiple,
    getSingle,
    login,
    getSingleFromEmail,
    bookParking,
    getBill,
    pay,
    create,
    update,
    remove
}

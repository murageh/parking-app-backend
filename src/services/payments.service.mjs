import db from "../models/index.mjs";
const bcrypt = import("bcrypt");
const {sequelize, payments} = db;

async function destroy() {
    let message = 'Database deleted successfully';
    let success = true;

    try {
        await payments.destroy().then(res => console.log("deleting database " + res));
    } catch (error) {
        message = 'Could not delete database ' + error;
        success = false;
    }

    return {success, message};
}

async function init() {
    // const connection = await mysql.createConnection(dbConfig);
    let message = 'payments table initialized successfully';
    let success = true;

    try {
        await payments.sync().then(res => console.log("table initialization " + res));
    } catch (error) {
        message = 'Could not initialize payments table ' + error;
        success = false;
    }

    return {success, message};
}

async function getMultiple() {
    let success = true, message = "Fetch successful";
    const savedPayments = await payments.findAll().catch(error => {
        success = false;
        message = "Could not fetch payments. " + error
    });

    return {
        success,
        message,
        payments: savedPayments,
    }
}

async function getSingle(id) {
    let success = true, message = "Fetch successful";

    const payment = await payments.findByPk(id).catch(error => {
        success = false;
        message = "Could not fetch parking payment. " + error
    });

    return {
        success: true,
        payment: payment ?? {},
    }
}

async function create(body) {
    let message = 'payment created successfully.';
    let success = true;

    const payment = await payments.create({
        amount: body.name,
    }).catch(error => {
        success = false;
        console.log(error.errors);
        const e = error.errors[0] ?? {};
        message = "Could not create payment. " + e?.message ?? "";
    });

    return {success, message, payment: payment ?? {}};
}

async function update(id, payment) {
    let message = 'payment updated successfully.';
    let success = true;

    const savedPayment = await payments.findOne({
        where: {
            id: id
        },
    });

    let obj = {};
    const keys = payment.keys();
    for (let key of keys) {
        obj[key] = payment[key];
    }

    await savedPayment.update({
        ...obj
    }).catch(error => {
        success = false;
        message = "Could not update payment. " + error
    });

    await savedPayment.reload();

    return {success, message, payment: savedPayment};
}

async function remove(id) {
    let message = 'payment deleted successfully.';
    let success = true;

    await payments.destroy({
        where: {
            id
        }
    }).catch(error => {
        success = false;
        message = "Could not delete payment. " + error
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

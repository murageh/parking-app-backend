import {Sequelize} from "@sequelize/core";
import dbConfig from "../configs/db.config.mjs";
import createUser from "../models/user.model.mjs";
import createParkingSpot from "../models/parkingSpot.model.mjs";
import createPayment from "../models/payment.model.mjs";

const sequelize = await new Sequelize(
    dbConfig.DB, dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        pool: dbConfig.pool,
        operatorsAliases: false
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

const User = createUser(sequelize, Sequelize);
const ParkingSpot = createParkingSpot(sequelize, Sequelize);
const Payment = createPayment(sequelize, Sequelize);

User.hasOne(ParkingSpot, {foreignKey: 'ParkingSpotId'});
ParkingSpot.belongsTo(User, {foreignKey: 'UserId'});
User.hasMany(Payment, {foreignKey: 'UserId'});
ParkingSpot.hasMany(Payment, {foreignKey: 'ParkingSpotId'});

db.users = User;
db.parkingSpots = ParkingSpot;
db.payments = Payment;

export default db;
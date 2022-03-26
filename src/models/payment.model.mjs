import bcrypt from "bcrypt";

export default (sequelize, Sequelize) => {
    return sequelize.define(
        'payment',
        {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            amountPaid: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
        }, {
            // Other model options go here
            sequelize: sequelize, // We need to pass the connection instance
            modelName: 'Payment' // We need to choose the model name
        }
    );
}
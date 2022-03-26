import bcrypt from "bcrypt";

export default (sequelize, Sequelize) => {
    return sequelize.define(
        'user',
        {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true
                }
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
                set(value) {
                    const salt = bcrypt.genSaltSync(10);
                    value = bcrypt.hashSync(value, salt);
                    this.setDataValue('password', value);
                }
            },
        }, {
            // Other model options go here
            sequelize: sequelize, // We need to pass the connection instance
            modelName: 'User' // We need to choose the model name
        }
    );
}
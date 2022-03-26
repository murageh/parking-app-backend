export default (sequelize, Sequelize) => {
    return sequelize.define('parkingSpot', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            cost: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            duration: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                comment: "Duration in minutes"
            },
            lateFee: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                comment: "Late fee per evey 5 minutes"
            },
            booked: {
                type: Sequelize.BOOLEAN
            },
            bookedAt: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: null
            },
            currentVehicle: {
                type: Sequelize.TEXT
            },
        },
        {
            sequelize: sequelize, // We need to pass the connection instance
            modelName: 'ParkingSpot' // We need to choose the model name
        }
    )
}

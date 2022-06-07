const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Rental extends Model {};

Rental.init (
    {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        start_date: {
          type: DataTypes.DATEONLY,
          allowNull: false,
        },
        return_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
          },
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'rental',
    }
    
)

module.exports = Rental;
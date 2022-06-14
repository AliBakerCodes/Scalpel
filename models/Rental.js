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
          type: DataTypes.STRING,
          allowNull: false,
        },
        return_date: {
            type: DataTypes.STRING,
            allowNull: false,
          },
        rented_to_user_id: {
          type: DataTypes.INTEGER,
          allowNull: true
        }
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
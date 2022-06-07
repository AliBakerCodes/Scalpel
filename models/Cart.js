const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Cart extends Model {};

Cart.init (
    {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        item_id: {
            type: DataTypes.Integer,
            allowNull: false,
          },
        qty: {
          type: DataTypes.Integer,
          allowNull: false,
        },
        is_rental: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },
    {
        sequelize,
        timestamps: true,
        freezeTableName: true,
        underscored: true,
        modelName: 'cart',
    }
    
)

module.exports = Cart;
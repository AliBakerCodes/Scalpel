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
            type: DataTypes.INTEGER,
            allowNull: false,
          },
        qty: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
       
        is_active: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
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
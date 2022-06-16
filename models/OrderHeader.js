const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class OrderHeader extends Model {};

OrderHeader.init (
    {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        ship_to_addr_id: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        bill_to_addr_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        ship_date: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        subtotal: {
            type: DataTypes.INTEGER,
            allowNull:true,
        },
        tax: {
            type: DataTypes.INTEGER,
            allowNull:true,
        },
        shipping: {
            type: DataTypes.INTEGER,
            allowNull:true,
        },
        total: {
            type: DataTypes.INTEGER,
            allowNull:true,
        },
    },
    {
        sequelize,
        timestamps: true,
        freezeTableName: true,
        underscored: true,
        modelName: 'order_header',
    }
    
)

module.exports = OrderHeader;
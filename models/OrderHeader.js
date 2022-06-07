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
          allowNull: false,
        },
        bill_to_addr_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ship_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
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
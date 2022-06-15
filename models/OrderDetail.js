const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class OrderDetail extends Model {};

OrderDetail.init (
    {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        qty: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        is_rental: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        ship_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        // item_id: {
        //     type: DataTypes.INTEGER,
        //     references: {model: 'Item',
        // key: 'id'}
        // }

    },
    {
        sequelize,
        timestamps: true,
        freezeTableName: true,
        underscored: true,
        modelName: 'order_detail',
    }
    
)

module.exports = OrderDetail;
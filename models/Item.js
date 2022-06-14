const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Item extends Model {};

Item.init (
    {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
            type: DataTypes.TEXT('long'),
            allowNull: false,
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        purchase_price: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        rental_price: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        buy_price: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        deposit:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        thumbnail: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        is_rentable: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        is_rented: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        return_date: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },
    {
        sequelize,
        timestamps: true,
        freezeTableName: true,
        underscored: true,
        modelName: 'item',
    }
    
)

module.exports = Item;
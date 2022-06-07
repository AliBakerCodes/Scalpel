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
            type: DataTypes.STRING,
            allowNull: false,
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        purchase_price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        rental_price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        buy_price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        thumbnail: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        is_rented: {
            type: DataTypes.boolean,
            allowNull: false,
        },
        return_date: {
            type: DataTypes.boolean,
            allowNull: true,
        },
        active: {
            type: DataTypes.boolean,
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
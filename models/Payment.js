const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Payment extends Model {};

Payment.init (
    {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        card_num: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            isCreditCard: true,
          }
        },
        exp_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            validate: {
                isDate: true,
            }
        },
        CVC: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        card_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {   
      hooks: {
        beforeCreate: async (newPaymentData) => {
          newPaymentData.card_name = await bcrypt.hash(newPaymentData.card_name, 10);
          return newPaymentData;
        },
        beforeUpdate: async (updatedPaymentData) => {
          updatedPaymentData.card_name = await bcrypt.hash(updatedPaymentData.card_name, 10);
          return updatedPaymentData;
        },
        },
        sequelize,
        timestamps: true,
        freezeTableName: true,
        underscored: true,
        modelName: 'payment',
        
    }

)

module.exports = Payment;
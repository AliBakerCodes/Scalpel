const sequelize = require('../config/connection');
const { Op } = require("sequelize");
// const bcrypt = require('bcrypt');

const { User, 
        Category,
        Address,
        Item,
        OrderDetail,
        OrderHeader,
        Payment,
        Rental,
        Review} = require('../models');

const userData = require('./userData.json');
const itemData1 = require('./itemData-daeun.json');
const itemData2 = require('./itemseeds-bryson.json');
const itemData3 = require('./itemseeds-arashk.json');
const addresses = require('./address.json');
const category = require('./category.json');
const reviews = require('./review.json');
const rentals = require('./rentals.json')
const payments = require('./credit_card.json')

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });
  
  const categories = await Category.bulkCreate(category, {
    individualHooks: true,
    returning: true,
  });

  for (const item of itemData1) {
    await Item.create({
      ...item,
      user_id: users[Math.floor(Math.random() * users.length)].id,
      category_id:1,
    });
  };

  for (const item of itemData2) {
    await Item.create({
      ...item,
      user_id: users[Math.floor(Math.random() * users.length)].id,
      category_id:2,
    });
  };

  for (const item of itemData3) {
    await Item.create({
      ...item,
      user_id: users[Math.floor(Math.random() * users.length)].id,
      category_id: 3
    });
  };

  for (const address of addresses) {
    await Address.create({
      ...address,
      user_id: users[Math.floor(Math.random() * users.length)].id,
    });
  };

  await Address.update(
    {
      type: 'BILL',
      user_id: '1'
    },
    {
      where: {
        id: {
          [Op.or]: [1,2]
        }
      }
  });

  const items = await Item.findAll();
  const rentItems = await Item.findAll({
      include: [
        {
          model: User,
        }
      ]
    });

    for (const rental of rentals) {
      await Rental.create({
        ...rental,
        user_id: users[Math.floor(Math.random() * users.length)].id,
        rented_to_user_id: users[Math.floor(Math.random() * users.length)].id,
      });
    };

  for (const review of reviews) {
    await Review.create({
      ...review,
      user_id: users[Math.floor(Math.random() * users.length)].id,
      item_id: items[Math.floor(Math.random() * users.length)].id
    });
  };

//   let salsCard =[
//     {
//     "card_num": "4041371144484654",
//     "exp_date": "2023-05",
//     "CVC": 384,
//     "type": "visa"
//   }, {
//     "card_num": "4041598200996",
//     "exp_date": "2023-12",
//     "CVC": 822,
//     "type": "visa"
//   },
//   {
//     "card_num": "5100174393680310",
//     "exp_date": "2023-05",
//     "CVC": 400,
//     "type": "mastercard"
//   }, {
//     "card_num": "5010123737667854",
//     "exp_date": "2024-01",
//     "CVC": 855,
//     "type": "mastercard"
//   }
// ];

//   await Payment.create({
//     ...salsCard,
//     user_id: 1
//   });
  
const userAddressData = await Address.findAll({
  where: {
    type: 'BILL'
  },
  raw : true ,
    nest : true
});

// const usersWithAddresses = userAddressData.get({ plain: true });;


let i=0;
// console.log (userAddressData);
  for (const address of userAddressData) {
    // console.log(address['user_id']);
    await Payment.create({
      
      ...payments[i],
      user_id: address['user_id'],
    });
    i++;
  };


  process.exit(0);
};

seedDatabase();

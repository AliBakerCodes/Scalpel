const sequelize = require('../config/connection');
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



  process.exit(0);
};

seedDatabase();

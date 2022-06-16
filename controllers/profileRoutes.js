const router = require('express').Router();
const _ = require('lodash')
const { User, 
  Category,
  Address,
  Item,
  OrderDetail,
  OrderHeader,
  Payment,
  Rental,
  Review,
  Cart,
} = require('../models');
const withAuth = require('../utils/auth');

router.get('/payments', withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      // include: [{ model: Project }],
    });
    const user = userData.get({ plain: true });

    const paymentData = await Payment.findAll({
      include: [
        {
          model: Address,
        },
      ],
      where: {
        user_id: req.session.user_id,
      },
    });

    
    const allCategoryData = await Category.findAll({
      include:{model:Item}
    });

    const categories = allCategoryData.map((category) =>
      category.get({ plain: true }));

    console.log(req.session.user_id);
    console.log(paymentData);
    const payments = paymentData.map((payment) => payment.get({ plain: true }));
    console.log(payments);
    res.render('profile', {
      ...user,
      categories,
      payments,
      profilePartial: 'payments-view',
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/payments', withAuth, async (req, res) => {
  try {
    const newPayment = await Payment.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newPayment);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/payments/:id', withAuth, async (req, res) => {
  try {
    console.log('anything');
    const paymentData = await Payment.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });
    console.log(paymentData);
    if (!paymentData) {
      res.status(404).json({ message: 'No payment found with this id!' });
      return;
    }

    res.status(200).json(paymentData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/addresses', withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
    });
    const user = userData.get({ plain: true });
    const addressData = await Address.findAll({
      where: {
        user_id: req.session.user_id,
      },
    });
    console.log(req.session.user_id);
    console.log(addressData);
    const addresses = addressData.map((address) =>
      address.get({ plain: true })
    );
    console.log(addresses);

    const allCategoryData = await Category.findAll({
      include:{model:Item}
    });

    const categories = allCategoryData.map((category) =>
      category.get({ plain: true }));

    res.render('profile', {
      ...user,
      addresses,
      categories,
      profilePartial: 'address',
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/addresses/:id', withAuth, async (req, res) => {
  try {
    const addressData = await Address.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });
    console.log(addressData);
    if (!addressData) {
      res.status(404).json({ message: 'No address found with this id!' });
      return;
    }
    res.status(200).json(addressData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/addresses', withAuth, async (req, res) => {
  try {
    const newAddress = await Address.create({
      ...req.body,
      user_id: req.session.user_id,
    });
    console.log(req.body)
    console.log(newAddress);
    res.status(200).json(newAddress);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get('/items', withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
    });
    const user = userData.get({ plain: true });

    const itemData = await Item.findAll({
      include: [
        {
          model: Category,
        },
      ],
      include: [
        {
          model: Rental,
        },
      ],
      include: [
        {
          model: OrderDetail,
          include: [
            {
              model: OrderHeader,
            },
          ],
        },
      ],
      where: {
        user_id: req.session.user_id,
        active: true,
      },
    });

    const allCategoryData = await Category.findAll({
      include:{model:Item}
    });

    const categories = allCategoryData.map((category) =>
      category.get({ plain: true }));

    console.log(req.session.user_id);
    console.log(itemData);
    const items = itemData.map((item) => item.get({ plain: true }));
    console.log(items);
    res.render('profile', {
      ...user,
      items,
      categories,
      profilePartial: 'manage-items',
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.delete('/items/:id', withAuth, async (req, res) => {
  try {
    const itemData = await Item.update(
      {
        active: false,
      },
      {
        where: {
          id: req.params.id,
          user_id: req.session.user_id,
        },
      }
    );
    console.log('Delete Item:', itemData);
    res.status(200).json(itemData);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.get('/history', withAuth, async (req, res) => {
  try {
    const orderData = await OrderHeader.findAll({
    //  include: [{model: Address, model: OrderDetail,
    //     include: [{model: Item}]
    //   }, {model: User,
    //   attributes: { exclude: ['password'] }
    // }],
    where:{
      user_id: req.session.user_id
    },

  });

    // console.log(orderData)
    const orders = orderData.map((order) => order.get({ plain: true }));
    // console.log(_.get(orders, ['orders','0','order_details','item']));
    console.log(orders);

    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      // include: [{ model: Project }],
    });

    const user = userData.get({ plain: true });

    const allCategoryData = await Category.findAll({
      include:{model:Item}
    });

    const categories = allCategoryData.map((category) =>
      category.get({ plain: true }));

    res.render('profile', { 
      ...user,
      orders,
      categories,
      profilePartial: 'orderhistory-view',
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

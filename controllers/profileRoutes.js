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
  Cart} = require('../models');
const withAuth = require('../utils/auth');

router.get('/payments', withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      // include: [{ model: Project }],
    });

    const paymentData = await Payment.findAll({
      include: [
        {
          model: Address,
        }
      ],
      where:
      {
        user_id: req.session.user_id
      }
      
    });
    console.log(req.session.user_id)
    console.log(paymentData)
    const payments = paymentData.map((payment) => payment.get({ plain: true }));
    console.log(payments);
    res.render('profile', { 
      payments,
      profilePartial: 'payments-view',
      logged_in: req.session.logged_in 
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
    console.log('anything')
    const paymentData = await Payment.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });
    console.log(paymentData)
    if (!paymentData) {
      res.status(404).json({ message: 'No payment found with this id!' });
      return;
    }
    
    res.status(200).json(paymentData);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('/items', withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
    });

    const itemData = await Item.findAll({
      include: [
        {
          model: Category,
        }
      ],
      include: [
        {
          model: Rental,
        }
      ],
      include: [
        {
          model: OrderDetail,
          include: [
            {
              model: OrderHeader,
            }
          ],
        }
      ],
      where:
      {
        user_id: req.session.user_id,
        active: true
      }
      
    });
    console.log(req.session.user_id)
    console.log(itemData)
    const items = itemData.map((item) => item.get({ plain: true }));
    console.log(items);
    res.render('profile', { 
      items,
      profilePartial: 'manage-items',
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

router.delete('/items/:id', withAuth, async (req, res) => {
  try {
    const itemData = await Item.update({
      active: false
    },
    {
      where: 
        { 
          id: req.params.id,
          user_id: req.session.user_id
        },
    });
    console.log('Delete Item:', itemData);
    res.status(200).json(itemData);
  } catch (err) {
    console.log(err)
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
    console.log(orders)
    res.render('profile', { 
      orders,
      profilePartial: 'orderhistory-view',
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      // include: [{ model: Project }],
    });

    const user = userData.get({ plain: true });
    const url=req.path
    res.render('profile', {
      ...user,
      profilePartial: 'none',
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

module.exports = router;
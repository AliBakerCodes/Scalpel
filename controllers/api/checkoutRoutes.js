const router = require('express').Router();
const { redirect } = require('statuses');
const moment = require('moment');
const nodemailer=require('nodemailer')
const {
  User,
  Category,
  Address,
  Item,
  OrderDetail,
  OrderHeader,
  Payment,
  Rental,
  Cart,
  Review
} = require('../../models');
const withAuth = require('../../utils/auth');
const Op=require('sequelize').Op;


router.post('/', withAuth, async (req, res) => {
  try{
    const cartData = await Cart.findAll({
      where:{user_id: req.session.user_id},
      include: [
        {
          model: User,
          attributes: { exclude: ['password'] },
        },
        {
          model: Item
        }

        ],
    });
    
    const cart = cartData.map((cart) =>
      cart.get({ plain: true })
    );
    // console.log(cart)
    let subtotal=0;
    for (let i=0; i<cart.length; i++){
      if(cart[i].is_rental){
        subtotal=subtotal+(cart[i].item.rental_price*cart[i].rental_days*cart[i].qty)
      } else {
        subtotal=subtotal+(cart[i].item.buy_price*cart[i].qty)
      }
    };
    let tax=subtotal*.1;
    let shipping=10;
    let total=subtotal+tax+shipping;
    console.log(req.body)
    const orderHeaderData= await OrderHeader.create({
      ...req.body,
      user_id: req.session.user_id,
      ship_date: moment().format('MM/DD/YYYY'),
      status: 'SHIPPED',
      subtotal: subtotal,
      total: total,
      shipping: shipping,
      tax: tax
    });

    // const oheader = orderHeaderData.map((order) => order.get({ plain: true }));
    console.log(orderHeaderData.id)
    for (let i=0; i<cart.length; i++){
      let rental_id;
      let itemData = await Item.findAll({where:{
        id: cart[i].item.id,
      }});
      const items = itemData.map((item) => item.get({ plain: true }));
      console.log(items[0].user_id)
      if(cart[i].is_rental){
          let rentalData= await Rental.create({
            start_date: moment().format('MM/DD/YYYY'),
            return_date: moment().add(cart[i].rental_days, 'days').format('MM/DD/YYYY'),
            rented_to_user_id: req.session.user_id,
            user_id: items[0].user_id,
            item_id: items[0].id,
          });
          // const rental = rentalData.map((rental) => rental.get({ plain: true }));
          console.log(rentalData.id)
          const orderDetail= await OrderDetail.create({
            qty: cart[i].qty,
            is_rental: cart[i].is_rental,
            ship_date:moment().format('YYYY-MM-DD'),
            orderheader_id: orderHeaderData.id,
            item_id: cart[i].item.id,
            rental_id: rentalData.id
          });
      } else {
        const orderDetail= await OrderDetail.create({
          qty: cart[i].qty,
          is_rental: cart[i].is_rental,
          ship_date:moment().format('YYYY-MM-DD'),
          orderheader_id: orderHeaderData.id,
          item_id: cart[i].item.id
        });
      };
    }

    //Clear the cart
    for (let i=0; i<cart.length; i++){
      await Cart.destroy({
        where: { id: cart[i].id }
      });
    };
    res.status(200).json('Order Created')
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
})


module.exports = router;

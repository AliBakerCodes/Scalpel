const router = require('express').Router();
const nodemailer = require('nodemailer');
const { redirect } = require('statuses');
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
} = require('../models');
const withAuth = require('../utils/auth');
const Op=require('sequelize').Op;


router.get('/', async (req, res) => {
  try {
    console.log('It got here');
    // Get all projects and JOIN with user data
    const itemData = await Item.findAll({
      include: [
        {
          model: Category,
        },
        {
          model: User,
          attributes: { exclude: ['password'] },
        },
      ],
    });

    const categoryData = await Category.findAll({
      include: [
        {
          model: Item,
          include: [
            {
              model: User,
              attributes: { exclude: ['password'] },
            },
          ],
        },
      ],
    });

    const categories = categoryData.map((category) =>
      category.get({ plain: true })
    );

    // Serialize data so the template can read it
    const tempItems = itemData.map((items) => items.get({ plain: true }));
    let items = [];
    for (let i = 0; i < 8; i++) {
      items[i] = tempItems[Math.floor(Math.random() * tempItems.length)];
    }
   

    res.render('homepage', {
      items,
      categories,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//get a single item
router.get('/item/:id', async (req, res) => {
  try {
    const itemData = await Item.findByPk(req.params.id, {
      include: [
        {
          model: Category,
        },
        {
          model: Review,
          include:[{model: User}]
        }
      ],
    });

    const item = itemData.get({ plain: true });
    
    const reviews = item.reviews;
    const allCategoryData = await Category.findAll({
      include:{model:Item}
    });

    const categories = allCategoryData.map((category) =>
      category.get({ plain: true })
    );

    const categoryData = await Category.findByPk(item.category_id, {
      include: [
        {
          model: Item,
        },
      ],
    });
   
    const categorySelected = categoryData.get({ plain: true });
    const categoryItems = categorySelected.items;

    let categoryItem = [];
    for (let i = 0; i < 8; i++) {
      categoryItem.push(categoryItems[i]);
    }
    
    res.render('item-detail', {
      item,
      categories,
      categoryItem,
      reviews,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//get a single category
router.get('/category/:id', async (req, res) => {
  try {
    const allCategoryData = await Category.findAll({
      include:{model:Item}
    });

    const categories = allCategoryData.map((category) =>
      category.get({ plain: true })
    );

    const categoryData = await Category.findByPk(req.params.id, {
      include: [
        {
          model: Item,
        },
      ],
    });
    const categorySelected = categoryData.get({ plain: true });

    const items = categorySelected.items;

  
    res.render('category', {
      categories,
      categorySelected,
      items,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//review page
router.get('/item/:id/review', async (req, res) => {
  try {
    const itemData = await Item.findByPk(req.params.id, {
      include: [
        {
          model: Category,
        },
        {
          model: User,
          attributes: { exclude: ['password'] },
        },
        {
          model: Review,
        },
      ],
    });

    const item = itemData.get({ plain: true });
    

   
    res.render('review', {
      item,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/item/:id/review', async (req, res) => {
  try {
    const reviewData = await Review.create(req.body);
    req.session.save(() => {
     
      res.status(200).json(reviewData);
    });
    const reviewItems = await Review.findAll({
      attributes: {
        include: [
          [sequelize.fn('AVG', sequelize.col('rating')), 'n_rating']
        ]
      },
      group: 'item_id',
        raw : true, 
        nest : true
      });
    
        console.log(reviewItems);
        for(let i=0; i<reviewItems.length; i++){
    
          console.log(reviewItems[i].item_id, reviewItems[i].n_rating)
          await Item.update(
          {
            rating: reviewItems[i].n_rating
          },
          {
            where: {
              id: reviewItems[i].item_id
            }
        });
      };
  } catch (err) {
    res.status(400).json(err);
  }
});


router.get('/search', async (req, res) => {
  try {
    const {term} = req.query;
    const itemData = await Item.findAll({
      where:{name:{[Op.like]:'%'+term+'%'}}
    });
   
    const items = itemData.map((item) =>
      item.get({ plain: true })
    );
  
    const allCategoryData = await Category.findAll({
      include:{model:Item}
    });

    const categories = allCategoryData.map((category) =>
      category.get({ plain: true }));


    if(items.length===0) { 
      const errorMessage='No result found. Try again.';
      res.render('search',{
        errorMessage,
        categories,
        term,
        logged_in:req.session.logged_in
      });
      return;
      
    } else{
    

    res.render('search', {
      
      items,
      term,
      categories,
      logged_in: req.session.logged_in,
    });
  }
  }
   catch (err) {
    res.status(400).json(err);
  }
});

router.post('/cart', withAuth, async(req,res) =>{
  try{ 
  
   const cartData= await Cart.create ({
    item_id: req.body.item_id,
    qty: req.body.qty,
    user_id:req.session.user_id,
    is_rental:req.body.is_rental,
    is_active: true
    });  

    res.status(200).json(cartData)
    } catch(err){
       res.status(400).json(err)
      }

});


router.delete('/cart/:id', withAuth, async(req, res) => {
  // delete one product by its `id` value
  try {
    const cartData = await Cart.destroy({
      where: { id: req.params.id }
    });
    
    res.status(200).json(cartData);
    
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});



router.get('/cart', withAuth, async (req, res) => {
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
    console.log(cart)

    const allCategoryData = await Category.findAll({
      include:{model:Item}
    });

    const categories = allCategoryData.map((category) =>
      category.get({ plain: true })
    );  

    let subtotal=0;
    for (let i=0; i<cart.length; i++){
      if(cart[i].is_rental){
        subtotal=subtotal+(cart[i].item.rental_price*cart[i].rental_days*cart[i].qty)
      } else {
        subtotal=subtotal+(cart[i].item.buy_price*cart[i].qty)
      }
    };
    console.log(subtotal)
    let tax=subtotal*.1
    let shipping=10
    let total=subtotal+tax+shipping
    
    console.log(total)
    
    res.render('cart', {
      shipping,
      subtotal,
      tax,
      total,
      cart,
      categories,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(400).json(err);
  }
})

router.get('/checkout', withAuth, async (req, res) => {
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

    const allCategoryData = await Category.findAll({
      include:{model:Item}
    });
    const paymentData = await Payment.findAll({
      where: {user_id: req.session.user_id}
    });

    const payments = paymentData.map((payment) =>
      payment.get({ plain: true })
    );  

    const categories = allCategoryData.map((category) =>
      category.get({ plain: true })
    );  
    
    console.log(payments)

    const shipAddressData = await Address.findAll({
      where: {
        user_id: req.session.user_id,
        type: 'SHIP'
      },
    });

    const billAddressData = await Address.findAll({
      where: {
        user_id: req.session.user_id,
        type: 'BILL'
      },
    });

    const billAddresses = billAddressData.map((address) =>
      address.get({ plain: true })
    );

    const shipAddresses = shipAddressData.map((address) =>
      address.get({ plain: true })
    );
   let subtotal=0;
    for (let i=0; i<cart.length; i++){
      if(cart[i].is_rental){
        subtotal=subtotal+(cart[i].item.rental_price*cart[i].rental_days*cart[i].qty)
      } else {
        subtotal=subtotal+(cart[i].item.buy_price*cart[i].qty)
      }
    };

    console.log(subtotal);
    let tax=subtotal*.1;
    let shipping=10;
    let total=subtotal+tax+shipping;
    console.log(total);
    res.render('checkout', {
      subtotal,
      tax,
      total,
      cart,
      categories,
      payments,
      shipAddresses,
      billAddresses,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(400).json(err);
  }
})

router.post('/orderconfirmation', (req, res) => {
  const email = req.body.email
  const ordernumber = req.body.order_number
  const shippingaddress = req.body.ship_to_addr_id
  const shipdate = req.body.ship_date
  
  let transporter = nodemailer.createTransport({
      service: 'hotmail',
      auth: {
          user: "scalpelrentorbuy@outlook.com",
          pass: "scalpelisthebest!"
      
      }
  })

  const mailOptions = {
      from: 'scalpelrentorbuy@outlook.com',
      to: email,
      subject: 'Portfolio',
      text: "Your order is confirmed! Your oder number is: " + ordernumber + ". Shipping Address: " + shippingaddress + ". Estimated ship date: " + shipdate + "."
  }
  console.log(email)
  transporter.sendMail(mailOptions, (err, result) => {
      if (err){
      console.log(err)
          res.json('Opps error occured')
      } else{
          res.json('Email sent!');
      }
  })
})

// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      // include: [{ model: Project }],
    });

    const user = userData.get({ plain: true });
    const url = req.path;


    const allCategoryData = await Category.findAll({
      include:{model:Item}
    });

    const categories = allCategoryData.map((category) =>
      category.get({ plain: true }));


    res.render('profile', {
      ...user,
      categories,
      profilePartial: 'none',
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', async (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }
  const allCategoryData = await Category.findAll({
    include:{model:Item}
  });

  const categories = allCategoryData.map((category) =>
    category.get({ plain: true }));

  res.render('login', {
  categories
  });
});

module.exports = router;

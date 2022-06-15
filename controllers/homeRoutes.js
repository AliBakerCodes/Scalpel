const router = require('express').Router();
const {
  User,
  Category,
  Address,
  Item,
  OrderDetail,
  OrderHeader,
  Payment,
  Rental,
  Review,
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
    // console.log(tempItems)
    let items = [];
    for (let i = 0; i < 8; i++) {
      items[i] = tempItems[Math.floor(Math.random() * tempItems.length)];
      console.log('Pushing');
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
          model: User,
          attributes: { exclude: ['password'] },
        },
        {
          model: Review
        },
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
      categoryItem[i] =
        categoryItems[Math.floor(Math.random() * categoryItems.length)];
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
      category.get({ plain: true })


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

router.get('/cart', async (req, res) => {
  try {
    const cartData = await Cart.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: { exclude: ['password'] },
        },
      ],
    });

    const cart = cartData.get({ plain: true });

    res.render('cart', {
      cart,
      logged_in: req.session.logged_in,
    });
    // console.log(cartData, cart);
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
    const url = req.path;
    res.render('profile', {
      ...user,
      profilePartial: 'none',
      logged_in: true,
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

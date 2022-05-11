const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const CategoryData = await Category.findAll({
         // include: [
      //   {
      //     model: Product,
      //     through: ProductTag,
      //   },
      // ],
    });
    res.status(200).json(CategoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const CategoryData = await Category.findByPk(req.params.id, {
      include: [{ model: Product }]
    });
    if (!CategoryData) {
      res.status(404).json({ message: 'No Category found with this id!' });
      return;
    }

    res.status(200).json(CategoryData);
  } catch (err) {
    res.status(500).json(err.message);
  } 
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const categoryData = await Category.create(req.body);
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
  Category.create(req.body)
  .then((category) => {
    // if there's category tags, we need to create pairings to bulk create in the categoryTag model
    if (req.body.tagIds.length) {
      const categoryTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          category_id: category.id,
          tag_id,
        };
      });
      return categoryTag.bulkCreate(categoryTagIdArr);
    }
    // if no category tags, just respond
    res.status(200).json(category);
  })
  .then((categoryTagIds) => res.status(200).json(categoryTagIds))
  .catch((err) => {
    console.log(err);
    res.status(400).json(err);
  });
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
  Category.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((category) => {
      res.json(category)
    })
   
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err.message);
    });
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const CategoryData = await Category.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!CategoryData) {
      res.status(404).json({ message: 'No Category found with this id!' });
      return;
    }

    res.status(200).json(CategoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

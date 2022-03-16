const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const TagData = await Tag.findAll({
      // include: [
      //   {
      //     model: Product,
      //     through: ProductTag,
      //   },
      // ],
    });
    res.status(200).json(TagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const TagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, through: ProductTag, as: 'tag' }]
    });
    if (TagData) {
      res.status(404).json({ message: 'No Tag found with this id!' });
      return;
    }

    res.status(200).json(TagData);
  } catch (err) {
    res.status(500).json(err);
  } 
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const tagData = await Tag.create(req.body);
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
  Tag.create(req.body)
  .then((Tag) => {
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
  // update a tag's name by its `id` value
  Tag.update(req.body, {
    where: {
      id: req.params.id,
    },
  }).then((tag)=> {
    res.status(200).json(tag)
  })
    // .then((Tag) => {
    //   // find all associated tags from tagTag
    //   return tagTag.findAll({ where: { tag_id: req.params.id } });
    // })
    // .then((tagTags) => {
    //   // get list of current tag_ids
    //   const tagTagIds = tagTags.map(({ tag_id }) => tag_id);
    //   // create filtered list of new tag_ids
    //   const newtagTags = req.body.tagIds
    //     .filter((tag_id) => !tagTagIds.includes(tag_id))
    //     .map((tag_id) => {
    //       return {
    //         tag_id: req.params.id,
    //         tag_id,
    //       };
    //     });
    //   // figure out which ones to remove
    //   const tagTagsToRemove = tagTags
    //     .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
    //     .map(({ id }) => id);

    //   // run both actions
    //   return Promise.all([
    //     TagTag.destroy({ where: { id: tagTagsToRemove } }),
    //     TagTag.bulkCreate(newTagTags),
    //   ]);
    // })
    // .then((updatedTagTags) => res.json(updatedTagTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
  try {
    const TagData = Tag.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!TagData) {
      res.status(404).json({ message: 'No Tag found with this id!' });
      return;
    }

    res.status(200).json(TagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

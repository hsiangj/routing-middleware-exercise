const express = require('express');
const router = new express.Router();
const ExpressError = require('./expressError');
const items = require('./fakeDb');

router.get('/', function(req, res){
  res.json({ items })
})

router.get('/:name', function(req, res, next){
  const getItem = items.find(item => item.name === req.params.name)
  if (getItem === undefined) {
    throw new ExpressError('Item not found', 404);
  }
  res.json({item: getItem});
})

router.post('/', function(req, res, next){
  try{
    if(!req.body.name || !req.body.price) throw new ExpressError('Input is required', 400);
    const newItem = {name: req.body.name, price: req.body.price};
    items.push(newItem);
    return res.status(201).json({added: newItem})
  } catch(e){
    return next(e);
  }
})

router.patch('/:name', function(req, res, next){
  const updateItem = items.find(item => item.name === req.params.name);
  if (updateItem === undefined) {
    throw new ExpressError('Item not found', 404);
  }
  updateItem.name = req.body.name;
  updateItem.price = req.body.price;
  res.json({updated: updateItem})
})

router.delete('/:name', function(req, res){
  const removeItem = items.findIndex(item => item.name === req.params.name);
  if(removeItem === -1) {
    throw new ExpressError('Item not found', 404);
  }
  items.splice(removeItem, 1);
  res.json({message: 'Deleted'})
})


module.exports = router;
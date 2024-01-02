const {AddToCart} = require('../models/AddToCart');
const express = require('express');
const { OrderItem } = require('../models/order-item');
const router = express.Router();

router.get(`/`, async (req, res) =>{
    const AddToCartList = await AddToCart.find().populate('user', 'name')

    if(!AddToCartList) {
        res.status(500).json({success: false})
    } 
    res.send(AddToCartList);
}) 

router.get(`/:id`, async (req, res) =>{
    const addToCart = await AddToCartList.findById(req.params.id)
    .populate('user', 'name')
    .populate({ 
        path: 'orderItems', populate: {
            path : 'product', populate: 'category'} 
        });

    if(!addToCart) {
        res.status(500).json({success: false})
    } 
    res.send(addToCart);
})

router.post('/', async (req,res)=>{
    const addToCartsIds = Promise.all(req.body.orderItems.map(async (orderItem) =>{
        let newAddToCart = new OrderItem({
            product: orderItem.product
        })
        newAddToCart = await newAddToCart.save();
        return newAddToCart._id;
    }))
    const addToCartsIdsResolved =  await addToCartsIds; 
    
    let addToCart = new AddToCart({
        orderItems: addToCartsIdsResolved,
        user: req.body.user,
    })
    addToCart = await addToCart.save();
    
    if(!addToCart)
    return res.status(400).send('the addToCart cannot be created!')

    res.send(addToCart);
})

router.put('/:id',async (req, res)=> {
    const addToCart = await AddToCart.findByIdAndUpdate(
        req.params.id,
        {
            OrderNow:req.body.OrderNow
        },
        { new: true}
    )
    if(!addToCart) return res.status(400).send('the addToCart cannot be update!')
 
    res.send(addToCart);
})


router.delete('/:id', (req, res)=>{
    AddToCart.findOneAndDelete(req.params.id).then(async addToCart =>{
        if(addToCart) {
            await addToCart.orderItems.map(async orderItem => {
                await OrderItem.findByIdAndRemove(orderItem)
            })
            return res.status(200).json({success: true, message: 'the order is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "order not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})

module.exports =router;
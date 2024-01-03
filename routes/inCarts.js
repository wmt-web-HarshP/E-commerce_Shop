const express=require('express')
const router=express.Router()
const {InCart}=require('../models/InCart')

router.get(`/`, async (req, res) => {
    const inCartList = await InCart.find();

    if (!inCartList) {
        res.status(500).json({ success: false })
    }
    res.status(200).send(inCartList);
})

router.post(`/`, async (req, res) => {
    let inCartList = new InCart({
        productItem:req.body.productItem,
        user:req.body.user    
    })
    inCartList = await inCartList.save();

    if (!inCartList)
        return res.status(400).send('the inCartList cannot be created!')

    res.send(inCartList);
})

// router.put('/:id',async(req,res)=>{
//     const result=await InCart.updateOne({_id : req.params.id},
//         {$set:{qty:req.body.qty}})
//         if(result.nModified==0){
//             res.status(404).send("The item is not in the cart")
//             }else{
//                 res.send(result)
//                  }
// })

router.put('/:inCartId', async (req, res) => {
    const { inCartId } = req.params;
    const { type,productId } = req.body;

    // try {
        // Find the inCartInstance for a specific user (you may need user authentication logic here)
        const inCartInstance = await InCart.findById(inCartId);
        console.log(type);

        if(type==="increament"){ 
            inCartInstance.productItem.map((item)=>{

                console.log(item.product,productId);
              if(item.product.toString()===productId) {

                console.log(item.product,productId);
                item.qty=item.qty+1;
              }     
            })
        }

        if(type==="decreament"){ 
            inCartInstance.productItem.map((item)=>{

                console.log(item.product,productId);
              if(item.product.toString()===productId) {

                console.log(item.product,productId);
                item.qty=item.qty-1;
              }     
            })
        }

        
    //     if (!inCartInstance) {
    //         return res.status(404).json({ message: 'InCart not found for the user.' });
    //     }

    //     // Increment quantity
    //     if (incrementBy) {
    //         inCartInstance.incrementQuantity(inCartId, incrementBy);
    //     }

    //     // Decrement quantity
    //     if (decrementBy) {
    //         inCartInstance.decrementQuantity(inCartId, decrementBy);
    //     }

    //     // Save the updated inCartInstance to the database
        await inCartInstance.save();


        return res.json(inCartInstance);
    // } catch (error) {
    //     console.error(error);
    //     return res.status(500).json({ message: 'Internal Server Error' });
    // }
});

router.delete('/:id', async (req, res) => {
    let InCart = await inCartList.findOneAndDelete(req.params.id).then(InCart => {
        if (InCart) {
            return res.status(200).json({ success: true, message: 'the InCart is deleted!' })
        } else {
            return res.status(404).json({ success: false, message: "InCart not found!" })
        }
    }).catch(err => {
        return res.status(500).json({ success: false, error: err })
    })
})
        

module.exports=router           
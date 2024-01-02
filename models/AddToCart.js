const mongoose = require('mongoose');

const AddToCartSchema = mongoose.Schema({
    orderItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem',   
        required:true
    }],                                                                                                                                                                                                       
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    OrderNow:{
        type:String,
        default:false
    }
})

AddToCartSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

AddToCartSchema.set('toJSON', {
    virtuals: true,
});
 
exports.AddToCart = mongoose.model('AddToCart', AddToCartSchema);



/**
Order Example:

{
    "orderItems" : [
        {
            "quantity": 3,
            "product" : "5fcfc406ae79b0a6a90d2585"
        },
        {
            "quantity": 2,
            "product" : "5fd293c7d3abe7295b1403c4"
        }
    ],
    "shippingAddress1" : "Flowers Street , 45",
    "shippingAddress2" : "1-B",
    "city": "Prague",
    "zip": "00000",
    "country": "Czech Republic",
    "phone": "+420702241333",
    "user": "5fd51bc7e39ba856244a3b44"
}

 */
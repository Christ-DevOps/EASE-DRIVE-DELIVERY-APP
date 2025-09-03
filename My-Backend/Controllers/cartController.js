const Cart = require('../Models/CartModel');
const Menu = require('../Models/MenuModel');

//get the current user's cart
exports.getCart = async (req, res) => {
    try{
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        if(!cart) return res.status(404).json({ items: [], totalPrice: 0 });
        const subTotal = cart.items.reduce((sum, item)=> sum + item.price * item.quantity, 0);
        cart.totalPrice = subTotal;
        return res.json(cart);
    }catch(err){
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
}

//add or update item in cart
exports.addToCart = async (req, res) => {
    try{
        const { productId, quantity } = req.body;
        if(!productId || !quantity || quantity < 1) {
            return res.status(400).json({ message: 'Invalid product or quantity' });
        }

        const product = await Menu.findById(productId);
        if(!product) return res.status(404).json({ message: 'Product not found' });

        let cart = await Cart.findOne({ user: req.user._id });
        if(!cart){
            //create new cart
            cart = new Cart({
                user: req.user._id,
                items: [{ 
                    product: product._id, 
                    quantity, 
                    price: product.price,
                    image: product.image,
                    name: product.title
                }],
                totalPrice: product.price * quantity
            });
        }else{
            //update existing cart
            const itemIndex = cart.items.findIndex(item => item.product.equals(product._id));
            if(itemIndex > -1){
                //item exists, update quantity
                cart.items[itemIndex].quantity = quantity;
                cart.items[itemIndex].price = product.price; //update to current price
            }else{
                //add new item
                cart.items.push({
                    product: product._id,
                    quantity,
                    price: product.price,
                    image: product.image,
                    name: product.title
                });
            }
            //recalculate total price
            cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        }

        await cart.save();
        return res.json(cart);
    }catch(err){
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
}

//remove item from cart
exports.removeFromCart = async (req, res) => {
    try{
        const { productID } = req.body;
        if(!productID) return res.status(400).json({ message: 'Product ID required' });

        const cart = await Cart.findOne({ user: req.user._id });
        if(!cart) return res.status(404).json({ message: 'Cart not found' });

        const itemIndex = cart.items.findIndex(item => item.product.equals(productID));
        if(itemIndex > -1){
            cart.items.splice(itemIndex, 1);
            //recalculate total price
            cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
            cart.updatedAt = Date.now();
            await cart.save();
            return res.json(cart);
        }else{
            return res.status(404).json({ message: 'Product not in cart' });
        }
    }catch(err){
        return res.status(500).json({ message: 'Server error', error: err.message });
    }

}

//clear cart 

exports.clearCart = async (req, res) => {
    try{
        const cart = await Cart.findOne({ user: req.user._id });
        if(!cart) return res.status(404).json({ message: 'Cart not found' });

        cart.items = [];
        cart.totalPrice = 0;
        cart.updatedAt = Date.now();
        await cart.save();
        return res.json(cart);
    }catch(err){
        console.error('Clear Cart', err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
}
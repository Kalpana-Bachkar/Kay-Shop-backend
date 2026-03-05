
import Product from '../Models/products.js';



export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        if (products && products.length > 0) {
            res.status(200).json(products);
        } else {
            res.status(404).json({ message: 'No products found' });
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};


export const getProductById = async (req, res) => {
    const productId = req.params.id
    try {
        // Find by id field, not _id
        const product = await Product.findById(productId);
        if (product) {

            res.status(200).json({ product });
        } else {
            res.status(404).json({ message: 'Please provide valid id' });
        }
    } catch (error) {
        console.error('Error fetching product by id:', error);
        res.status(500).json({ message: 'Error fetching product by id', error: error.message });
    }
};


export const getProductByName = async (req, res) => {
    const productName = req.params;
    try {
        const products = await Product.find({ name: productName });
        if (products.length > 0) {
            res.status(200).json({ productName: products });
        } else {
            res.status(404).json({ message: 'please provide valid name' });
        }
    } catch (error) {
        console.error('Error fetching product by name:', error);
        res.status(500).json({ message: 'Error fetching product by name', error: error.message });
    }
};




export const getProductByCategory = async (req, res) => {
    const productCategory = req.params.category;
    try {
        // Normalize category to lowercase for both query and DB field
        const products = await Product.find({
            $expr: {
                $eq: [
                    { $toLower: "$category" },
                    productCategory.toLowerCase()
                ]
            }
        });
        if (products.length > 0) {
            res.status(200).json({ products });
        } else {
            res.status(404).json({ message: 'please provide valid category' });
        }
    } catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(500).json({ message: 'Error fetching products by category', error: error.message });
    }
};

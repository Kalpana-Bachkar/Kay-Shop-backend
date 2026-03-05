import mongoose from 'mongoose';

const specificationSchema = new mongoose.Schema({}, { strict: false });

const reviewSchema = new mongoose.Schema({
    username: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true }
});

const productSchema = new mongoose.Schema({

    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    specifications: { type: specificationSchema, required: true },
    reviews: [reviewSchema]
});

export default mongoose.model('Product', productSchema);

// seed.js

const mongoose = require("mongoose");
const mongooseSequence = require("mongoose-sequence")(mongoose);
const Schema = mongoose.Schema;
const client = require("../config/elasticsearch");

const categoryValues = ["phone", "laptop", "tablet", "headphone"];

const productSchema = new Schema({
	name: { type: String, maxLength: 255, required: true, trim: true },
	price: { type: Number, required: true },
	description: { type: String, maxLength: 600 },
	category: {
		type: String,
		enum: categoryValues,
		required: true,
	},
	productId: { type: Number, unique: true },
	stock: { type: Number, required: true },

	sold: { type: Number, default: 0 },

	variants: [
		{
			name: String,
			stock: Number,
			price: Number,
			image: String,
		},
	],

	ratings: [
		{
			userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
			rating: Number,
		},
	],

	comments: [
		{
			username: { type: String, required: true },
			comment: String,
			createAt: { type: Date, default: Date.now },
		},
	],

	image: { type: String, required: true },
	images: [{ type: String }],

	createAt: { type: Date, default: Date.now, immutable: true },
	updateAt: { type: Date, default: Date.now },
});

productSchema.pre("save", function (next) {
	this.updateAt = Date.now();
	next();
});

productSchema.plugin(mongooseSequence, {
	inc_field: "productId",
	start_seq: 1,
});

const Product = mongoose.model("Product", productSchema);


const addProductToIndex = async (product) =>{
    try {
        await client.index({
            index: "products",
            id: product._id.toString(),
            document: {
                name: product.name,
                description: product.description,
                category: product.category,
                price: product.price,
                stock: product.stock,
                sold: product.sold,
                variants: product.variants,
                image: product.image,
                ratings: product.ratings.map((rating) => ({
                    userId: rating.userId,
                    rating: rating.rating,
                })),
                comments: product.comments.map((comment) => ({
                    username: comment.username,
                    comment: comment.comment,
                    createAt: comment.createAt,
                })),
                createAt: product.createAt,
                updateAt: product.updateAt,
            },
        });
        console.log("Product indexed in Elasticsearch");
    } catch (error) {
        console.error("Error indexing product:", error);
    }
}

const seedProducts = async () => {
	await mongoose.connect("mongodb://localhost:27017/CellPhoneStore");
	await Product.deleteMany({}); // Clear existing data

	const products = [
		{
			name: "ipad air 6 M2",
			description: "Description for ipad air 6 M2",
			price: 18000000,
			stock: 100,
			category: "tablet",
			image: "ipadair6m2.jpg",
		},
		{
			name: "galaxy tab s6",
			description: "Description for galaxy tab s6",
			price: 15599000,
			stock: 50,
			category: "tablet",
			image: "tabletgalaxytabS6.jpg",
		},

		{
			name: "airpods 3",
			description: "Description for airpods 3",
			price: 5999000,
			stock: 40,
			category: "headphone",
			image: "airpods3.jpg",
		},
		{
			name: "WH-CH720N",
			description: "Description for WH-CH720N",
			price: 1200000,
			stock: 30,
			category: "headphone",
			image: "WH-CH720N.jpg",
		},
		{
			name: "galaxy A25",
			description: "Description for galaxy A25",
			price: 4999000,
			stock: 30,
			category: "phone",
			image: "galaxyA25.jpg",
		},

		{
			name: "galaxy A53",
			description: "Description for galaxy A53",
			price: 4999000,
			stock: 30,
			category: "phone",
			image: "galaxyA53.jpg",
		},

		{
			name: "galaxy S24",
			description: "Description for galaxy S24",
			price: 4999000,
			stock: 10,
			category: "phone",
			image: "galaxyS24.jpg",
		},

		{
			name: "macbook air 2020 m1",
			description: "Description for macbook air 2020 m1",
			price: 19999000,
			stock: 4,
			category: "laptop",
			image: "macbookair2020m1.jpg",
		},

		{
			name: "macbook pro 13",
			description: "Description for macbook pro 13",
			price: 29999000,
			stock: 18,
			category: "laptop",
			image: "macbookpro13.jpg",
		},

		{
			name: "laptop Idea pag Slim 3",
			description: "Description for laptop Idea pag Slim 3",
			price: 16999000,
			stock: 0,
			category: "laptop",
			image: "laptopIdeapagSlim3.jpg",
		},

		{
			name: "iphone 15",
			description: "Description for iphone 15",
			price: 20999000,
			stock: 20,
			category: "phone",
			image: "iphone15.jpg",
		},

		{
			name: "iphone Xs",
			description: "Description for iphoneXs",
			price: 11999000,
			stock: 10,
			category: "phone",
			image: "iphoneX.jpg",
		},
	];

	for (const product of products) {
		const newProduct = await Product.create(product);

        
        await addProductToIndex(newProduct);

		console.log(
			"Saved product:",
			newProduct.name,
			"with productId:",
			newProduct.productId,
		);


        
	}

	console.log("Products seeded!");
	mongoose.connection.close();
};

seedProducts();

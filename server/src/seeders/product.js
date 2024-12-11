// // seed.js

const mongoose = require("mongoose");
const client = require("../config/elasticsearch");
// const mongooseSequence = require("mongoose-sequence")(mongoose);
// const Schema = mongoose.Schema;

// const categoryValues = ["phone", "laptop", "tablet", "headphone"];

// const productSchema = new Schema({
// 	name: { type: String, maxLength: 255, required: true, trim: true },
// 	price: { type: Number, required: true },
// 	description: { type: String, maxLength: 600 },
// 	category: {
// 		type: String,
// 		enum: categoryValues,
// 		required: true,
// 	},
// 	productId: { type: Number, unique: true },
// 	stock: { type: Number, required: true },

// 	sold: { type: Number, default: 0 },

// 	variants: [
// 		{
// 			name: String,
// 			stock: Number,
// 			price: Number,
// 			image: String,
// 		},
// 	],

// 	ratings: [
// 		{
// 			userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
// 			rating: Number,
// 		},
// 	],

// 	comments: [
// 		{
// 			username: { type: String, required: true },
// 			comment: String,
// 			createAt: { type: Date, default: Date.now },
// 		},
// 	],

// 	image: { type: String, required: true },
// 	images: [{ type: String }],

// 	createAt: { type: Date, default: Date.now, immutable: true },
// 	updateAt: { type: Date, default: Date.now },
// });

// productSchema.pre("save", function (next) {
// 	this.updateAt = Date.now();
// 	next();
// });

// productSchema.plugin(mongooseSequence, {
// 	inc_field: "productId",
// 	start_seq: 1,
// });

// const Product = mongoose.model("Product", productSchema);

const Product = require("../api/v1/models/Product");

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
				productId: product.productId,
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
	await mongoose.connect("mongodb://mongo:27017/CellPhoneStore");
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

        {
			name: "Laptop Lenovo ThinkPad P16s Gen 2 21HK004VVA",
			description: "Description for Laptop Lenovo ThinkPad P16s Gen 2 21HK004VVA",
			price: 12999000,
			stock: 2,
			category: "laptop",
			image: "Laptop Lenovo ThinkPad P16s Gen 2 21HK004VVA.jpg",
		},

        {
			name: "Lenovo Thinkpad T14 Gen 1 Core i5 1135G7",
			description: "Description for Lenovo Thinkpad T14 Gen 1 Core i5 1135G7",
			price: 13999000,
			stock: 1,
			category: "laptop",
			image: "Lenovo Thinkpad T14 Gen 1 Core i5.jpg",
		},


        {
			name: "Laptop HUAWEI KLVD-WDH9 MATEBOOK 14",
			description: "Description for Laptop HUAWEI KLVD-WDH9 MATEBOOK 14",
			price: 17999000,
			stock: 10,
			category: "laptop",
			image: "Laptop HUAWEI KLVD-WDH9 MATEBOOK 14.jpg",
		},


        {
			name: "Huawei MateBook D14 BE i3 1215U",
			description: "Description for Huawei MateBook D14 BE i3 1215U",
			price: 16999000,
			stock: 5,
			category: "laptop",
			image: "Huawei MateBook D14 BE i3 1215U.jpg",
		},

        {
			name: "Laptop Dell Latitude 3420",
			description: "Description for Laptop Dell Latitude 3420",
			price: 15599000,
			stock: 8,
			category: "laptop",
			image: "Laptop Dell Latitude 3420.jpg",
		},

        {
			name: "Laptop Dell Latitude 7410 Carbon",
			description: "Description for Laptop Dell Latitude 7410 Carbon",
			price: 17599000,
			stock: 2,
			category: "laptop",
			image: "Laptop Dell Latitude 7410 Carbon.jpg",
		},

        
        {
			name: "Laptop Asus ROG Zephyrus G16 GU605MV",
			description: "Description for Laptop Asus ROG Zephyrus G16 GU605MV",
			price: 24599000,
			stock: 7,
			category: "laptop",
			image: "Laptop Asus ROG Zephyrus G16 GU605MV.jpg",
		},

        {
			name: "Laptop Asus Vivobook 16 X1605VA-MB105W",
			description: "Description for Laptop Asus Vivobook 16 X1605VA-MB105W",
			price: 27599000,
			stock: 7,
			category: "laptop",
			image: "Laptop Asus Vivobook 16 X1605VA-MB105W.jpg",
		},


        {
			name: "Lenovo Tab M8 3",
			description: "Description for Lenovo Tab M8 3",
			price: 11599000,
			stock: 14,
			category: "tablet",
			image: "Lenovo Tab M8 3.jpg",
		},

        {
			name: "Lenovo Tab M9",
			description: "Description for Lenovo Tab M9",
			price: 10599000,
			stock: 7,
			category: "tablet",
			image: "Lenovo Tab M9.jpg",
		},

        {
			name: "Original Xiaomi Mi Pad 5 Pro 5 Gam Tablet PC 11",
			description: "Description for Original Xiaomi Mi Pad 5 Pro 5 Gam Tablet PC 11",
			price: 13599000,
			stock: 2,
			category: "tablet",
			image: "Original Xiaomi Mi Pad 5 Pro 5 Gam Tablet PC 11.jpg",
		},


        {
			name: "Xiaomi Pad 6 Max 4G",
			description: "Description for Xiaomi Pad 6 Max 4G",
			price: 8999000,
			stock: 9,
			category: "tablet",
			image: "Xiaomi Pad 6 Max 4G.jpg",
		},

        {
			name: "Xiaomi Redmi Pad Pro",
			description: "Description for Xiaomi Redmi Pad Pro",
			price: 10999000,
			stock: 20,
			category: "tablet",
			image: "Xiaomi Redmi Pad Pro.jpg",
		},
        
        {
			name: "Samsung Galaxy Tab A7",
			description: "Description for Samsung Galaxy Tab A7",
			price: 11999000,
			stock: 10,
			category: "tablet",
			image: "Samsung Galaxy Tab A7.jpg",
		},

        {
			name: "Samsung Galaxy Tab S9 FE",
			description: "Description for Samsung Galaxy Tab S9 FE",
			price: 10999000,
			stock: 18,
			category: "tablet",
			image: "Samsung Galaxy Tab S9 FE.jpg",
		},

        {
			name: "SamsungGalaxyTabS6 ite202",
			description: "Description for SamsungGalaxyTabS6 ite202",
			price: 7999000,
			stock: 10,
			category: "tablet",
			image: "SamsungGalaxyTabS6 ite202.jpg",
		},


        {
			name: "iphone 13",
			description: "Description for iphone 13",
			price: 11999000,
			stock: 10,
			category: "phone",
			image: "iphone13hong.jpg",
            variants: [
                {
                    name: "hồng",
                    stock: 5,
                    price: 11999000,
                    image: "iphone13hong.jpg",
                },
                {
                    name: "xanh",
                    stock: 2,
                    price: 12555000,
                    image: "iphone13xanh.jpg",
                },
                {
                    name: "đen",
                    stock: 3,
                    price: 12399000,
                    image: "iphone13den.jpg",
                },
            ],
		},

        {
			name: "sam sung galaxy s22 ultra",
			description: "Description for sam sung galaxy s22 ultra",
			price: 12999000,
			stock: 19,
			category: "phone",
			image: "samsunggalaxyS22ultratrang.jpg",
            variants: [
                {
                    name: "trắng",
                    stock: 12,
                    price: 12999000,
                    image: "samsunggalaxyS22ultratrang.jpg",
                },
                {
                    name: "đen",
                    stock: 7,
                    price: 13200000,
                    image: "samsungS22ultra.jpg",
                }
            ],
		},
        

        {
			name: "iphone 12 pro max",
			description: "Description for iphone 12 pro max",
			price: 10999000,
			stock: 15,
			category: "phone",
			image: "iphone12prothanchi.jpg",
            variants: [
                {
                    name: "than chì",
                    stock: 5,
                    price: 10999000,
                    image: "iphone12prothanchi.jpg",
                },
                {
                    name: "vàng",
                    stock: 7,
                    price: 10990000,
                    image: "iphone12promaxvangf.jpg",
                },
                {
                    name: "xanh",
                    stock: 3,
                    price: 10999000,
                    image: "iphone12proxanh.jpg",
                }
            ],
		},


        {
			name: "iphone 11 (cũ)",
			description: "Description for iphone 11",
			price: 8999000,
			stock: 18,
			category: "phone",
			image: "iphone11white.jpg",
            variants: [
                {
                    name: "đen",
                    stock: 5,
                    price: 8999000,
                    image: "iphone11black.jpg",
                },
                {
                    name: "trắng",
                    stock: 8,
                    price: 8990000,
                    image: "iphone11white.jpg",
                },
                {
                    name: "xanh dương",
                    stock: 5,
                    price: 7799000,
                    image: "iphone11blue.jpg",
                }
            ],
		},


        {
			name: "iphone 8 (cũ)",
			description: "Description for iphone 8",
			price: 2399000,
			stock: 12,
			category: "phone",
			image: "iphone8.jpg",
		},

        {
			name: "iphone 8 plus (cũ)",
			description: "Description for iphone 8 plus",
			price: 3999000,
			stock: 10,
			category: "phone",
			image: "iphone8plus.jpg",
		},

		{
			name: "Điện Thoại OPPO A18 128GB Xanh",
			description: "Description for Điện Thoại OPPO A18 128GB Xanh",
			price: 5999000,
			stock: 10,
			category: "phone",
			image: "Điện Thoại OPPO A18 128GB Xanh.jpg",
		},

		{
			name: "Điện Thoại OPPO A57 64GB Đen",
			description: "Description for Điện Thoại OPPO A57 64GB Đen",
			price: 4999000,
			stock: 20,
			category: "phone",
			image: "Điện Thoại OPPO A57 64GB Đen.jpg",
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

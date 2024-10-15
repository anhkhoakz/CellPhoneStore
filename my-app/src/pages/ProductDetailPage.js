import React from 'react';
import ProductNotFound from '../components/ProductNotFound';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
  const product = {
    id: 1,
    name: "iPhone 13",
    price: 999,
    description: "The iPhone 13 is one of Apple's standout smartphones, launched in September 2021. With its sleek design, the iPhone 13 features an aluminum frame and a glass back, available in a variety of colors including Black, White, Product Red, Blue, Green, and Pink.",
    image: "https://cdn.tgdd.vn/Products/Images/42/223602/iphone-13-xanh-la-thumb-new-600x600.jpg"
  };

  const { id } = useParams();

  // Kiểm tra xem ID trong URL có khớp với ID của sản phẩm không
  if (parseInt(id) !== product.id) {
    return <ProductNotFound />;
  }

  return (
    <div className="product-detail" style={{ display: 'flex', height: '90vh', padding: '20px', backgroundColor: '#f4f4f4' }}>
      <div className="product-image" style={{ flex: '1', marginRight: '20px' }}>
        <h1>{product.name}</h1>
        <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: '10px' }} />
        <p className='product-des' style={{ marginTop: '10px' }}>{product.description}</p> {/* Mô tả nằm dưới hình ảnh */}
      </div>
      <div className="product-info" style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <p>Price: ${product.price}</p>
        <div className="color-options" style={{ display: 'flex', alignItems: 'center', marginTop: '10px', marginBottom: '20px', }}>
          <h4 style={{ marginRight: '10px' }}>Select Color:</h4>
          <label style={{ marginRight: '15px' }}>
            <input type="radio" name="color" value="Black" defaultChecked  /> Black
          </label>
          <label style={{ marginRight: '15px' }}>
            <input type="radio" name="color" value="White" /> White
          </label>
          <label style={{ marginRight: '15px' }}>
            <input type="radio" name="color" value="Blue" /> Blue
          </label>
        </div>
        <div className="product-actions" style={{ marginTop: '20px' }}>
          <button className="btn btn-success" style={{ padding: '10px 20px', marginRight: '10px' }}>Buy Now</button>
          <button className="btn btn-primary" style={{ padding: '10px 20px' }}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

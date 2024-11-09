import { useState } from 'react';
import axios from 'axios';

const Admin = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [imgSrc, setImgSrc] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/add-product', {
        title,
        price: parseInt(price, 10),
        imgSrc,
      });
      alert('Product added successfully!');
      setTitle('');
      setPrice('');
      setImgSrc('');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product.');
    }
  };

  return (
    <div className="add-product-form">
      <div className="add-product-main-container">
      <h1 className="add-new-product-text">Add New Product</h1>
      <div className="bothContainer">
      <div className="firstContainer">
          <label className="admin-label">Title:</label>
          <label className="admin-label">Price:</label>
          <label className="admin-label">Image URL:</label>
      </div>
     <div className="secondContainer">
      <form onSubmit={handleSubmit}>
        <div className="add-block">
          
          <input
            type="text"
            className="admin-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="add-block">
          
          <input
            type="number"
            className="admin-input"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="add-block">
          
          <input
            type="text"
            className="admin-input"
            value={imgSrc}
            onChange={(e) => setImgSrc(e.target.value)}
          />
        </div>
        <button className="addProductBtn" type="submit">Add Product</button>
      </form>
      </div>
      
      </div>
      </div>
    </div>
  );
};

export default Admin;

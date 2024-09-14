import React, { useState } from 'react';

const Home = () => {
  const [itemDescription, setItemDescription] = useState('');
  const [priceRangeMin, setPriceRangeMin] = useState('');
  const [priceRangeMax, setPriceRangeMax] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Item Description:', itemDescription);
    console.log('Price Range:', `${priceRangeMin} - ${priceRangeMax}`);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>Get Started</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Item Description:
          </label>
          <input
            type="text"
            value={itemDescription}
            onChange={(e) => setItemDescription(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Item Price Range:
          </label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              value={priceRangeMin}
              onChange={(e) => setPriceRangeMin(e.target.value)}
              placeholder="Min"
              style={{ width: '45%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc', marginRight: '10px' }}
            />
            <span style={{ margin: '0 5px' }}>-</span>
            <input
              type="text"
              value={priceRangeMax}
              onChange={(e) => setPriceRangeMax(e.target.value)}
              placeholder="Max"
              style={{ width: '45%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc', marginLeft: '10px' }}
            />
          </div>
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Start!
        </button>
      </form>
    </div>
  );
};

export default Home;
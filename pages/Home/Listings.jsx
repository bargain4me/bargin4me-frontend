import React, { useEffect, useState } from 'react';
import {fetchItemData} from '../apis';

const Listings = ({ onViewListing }) => {
  const dummyData = [
    {
      id: 1,
      image: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Item+1',
      listedPrice: '$150',
      estimatePrice: '$100',
      summary: 'This is a summary of item 1.',
      message: 'Contact seller for more details.',
      url: 'https://www.facebook.com/marketplace'
    },
    {
      id: 2,
      image: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=Item+2',
      listedPrice: '$250',
      estimatePrice: '$175',
      summary: 'This is a summary of item 2.',
      message: 'Contact seller for more details.',
      url: 'https://www.facebook.com/marketplace/item/2'
    },
    {
      id: 3,
      image: 'https://via.placeholder.com/150/00FF00/000000?text=Item+3',
      listedPrice: '$350',
      estimatePrice: '$250',
      summary: 'This is a summary of item 3.',
      message: 'Contact seller for more details.',
      url: 'https://www.facebook.com/marketplace/item/3'
    },
  ];

  // State to store the fetched data
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Fetch item data when the component mounts
    fetchItemData()
      .then(data => {
        if (data) {
          // Assume 'data' is an array of items or has a specific structure you can access
          setItems(data); // Update the state with the fetched data
        }
      })
      .catch(error => console.error('Error fetching items:', error));
  }, []);

  return (
    <div style={{ height: '100vh', overflowY: 'scroll', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {dummyData.map((item) => (
        <div
          key={item.id}
          style={{
            marginBottom: '20px',
            padding: '20px',
            backgroundColor: '#f0f0f0',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
          }}
        >
          <img
            src={item.image}
            alt={`Item ${item.id}`}
            style={{ width: '100%', borderRadius: '8px' }}
          />
          <h2>Listed Price: {item.listedPrice}</h2>
          <h3>Estimate Price: {item.estimatePrice}</h3>
          <p>{item.summary}</p>
          <p>{item.message}</p>
          <button
            onClick={() => onViewListing(item)}
            style={{ color: '#4CAF50', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            View Listing
          </button>
          <button
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "none",
            border: "none",
            color: "#4CAF50",
            textDecoration: "underline",
            cursor: "pointer",
            padding: 0,
            fontSize: "14px",
            fontFamily: "inherit"
          }}>
          Logout
        </button>
        </div>
      ))}
    </div>
  );
};

export default Listings;

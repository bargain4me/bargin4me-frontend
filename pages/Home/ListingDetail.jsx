import React from 'react';
import { useLocation } from 'react-router-dom';

const ListingDetail = () => {
  const location = useLocation();
  const { summary, message } = location.state;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Listing Detail</h1>
      <p><strong>Summary:</strong> {summary}</p>
      <p><strong>Initial Message:</strong> {message}</p>
      <button
        style={{
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
        onClick={() => alert('Let\'s Bargain!')}
      >
        Let's Bargain
      </button>
    </div>
  );
};

export default ListingDetail;
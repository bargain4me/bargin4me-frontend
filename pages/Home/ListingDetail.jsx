import React from 'react';

const ListingDetail = ({ onBack, summary, message, listedPrice, estimatePrice, image }) => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', position: 'relative' }}>
      <button
        onClick={onBack}
        style={{
          position: 'absolute',  // Positioned absolutely within the container
          top: '10px',  // 10px from the top
          right: '10px',  // 10px from the right
          background: 'none',
          border: 'none',
          color: '#4CAF50',
          textDecoration: 'underline',
          cursor: 'pointer',
          padding: 0,
          fontSize: '14px',
          fontFamily: 'inherit'
        }}
      >
        Back to Listings
      </button>
      <div style={{ textAlign: 'center', marginTop: '40px' }}> {/* Added marginTop to prevent content overlap */}
        <p><strong>Summary:</strong> {summary}</p>
        <p><strong>Message:</strong> {message}</p>
      </div>
      <button
        onClick={() => alert('Bargain for me!')}
        style={{
          display: 'block',
          margin: '20px auto',
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          fontFamily: 'inherit'
        }}
      >
        Bargain for me!
      </button>
    </div>
  );
};

export default ListingDetail;

import React from 'react';

const Listings = () => {
  const sections = Array.from({ length: 10 }, (_, index) => `Section ${index + 1}`);

  return (
    <div style={{ height: '100vh', overflowY: 'scroll', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {sections.map((section, index) => (
        <div key={index} style={{ marginBottom: '20px', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
          {section}
        </div>
      ))}
    </div>
  );
};

export default Listings;
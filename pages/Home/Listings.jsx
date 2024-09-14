import React from 'react';

const Listings = () => {
    const dummyData = [
        {
            id: 1,
            // image: 'https://scontent-sjc3-1.xx.fbcdn.net/v/t45.5328-4/459713185_1418734972128785_1503901016539134208_n.jpg?stp=dst-jpg_s960x960&_nc_cat=106&ccb=1-7&_nc_sid=247b10&_nc_ohc=UfgphFeFFAYQ7kNvgFhnvCm&_nc_ht=scontent-sjc3-1.xx&_nc_gid=ArZYK6Jrf8w21FTCFPGlcks&oh=00_AYAuGeb1khmd2rl5zjkmMlqQMxo0oIUtM2zQfMnTbjl5EA&oe=66EBD61E',
            image: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Item+1',
            listedPrice: '$150',
            estimatePrice: '$100',
            summary: 'This is a summary of item 1.',
            message: 'Contact seller for more details.',
            // url: 'https://www.facebook.com/marketplace/item/439538051840317/?ref=search&referral_code=null&referral_story_type=post'
            urL: 'https://www.facebook.com/marketplace'
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
            estimatePrice: '250',
            summary: 'This is a summary of item 3.',
            message: 'Contact seller for more details.',
            url: 'https://www.facebook.com/marketplace/item/3'
        },
    ];

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
                    <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#4CAF50', textDecoration: 'none' }}
                    >
                        View Listing
                    </a>
                </div>
            ))}
        </div>
    );
};

export default Listings;import React from 'react';

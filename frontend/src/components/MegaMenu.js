import React from 'react';
import './MegaMenu.css';

const MegaMenu = ({ category }) => {
  const menuData = {
    entire: {
      sections: [
        {
          title: 'Shop By Category',
          items: ['Women', 'Men', 'Kids', 'Home & Living', 'Beauty', 'Accessories']
        },
        {
          title: 'Trending',
          items: ['New Arrivals', 'Best Sellers', 'Sale', 'Featured Brands', 'Gift Cards']
        },
        {
          title: 'Occasions',
          items: ['Party Wear', 'Casual', 'Formal', 'Ethnic', 'Sports & Active']
        }
      ]
    },
    women: {
      sections: [
        {
          title: 'Westernwear',
          items: ['Tops', 'Dresses', 'Jeans', 'Trousers', 'Skirts', 'Shorts', 'Jackets', 'Shrugs']
        },
        {
          title: 'Ethnicwear',
          items: ['Kurtas & Kurtis', 'Sarees', 'Dress Materials', 'Lehenga Choli', 'Salwar Suits', 'Dupattas', 'Ethnic Bottomwear']
        },
        {
          title: 'Sports & Activewear',
          items: ['Sports Shoes', 'Track Pants', 'Sports T-shirts', 'Jackets', 'Yoga Wear']
        },
        {
          title: 'Sleepwear & Loungewear',
          items: ['Night Suits', 'Nighties', 'Robes', 'Lounge Tees', 'Lounge Pants']
        },
        {
          title: 'Bags & Accessories',
          items: ['Handbags', 'Wallets', 'Belts', 'Sunglasses', 'Jewellery', 'Watches', 'Caps']
        },
        {
          title: 'Footwear',
          items: ['Flats', 'Heels', 'Sandals', 'Sneakers', 'Sports Shoes', 'Slippers']
        },
        {
          title: 'Fragrances',
          items: ['Perfumes', 'Deodorants', 'Body Mists']
        },
        {
          title: 'Shop By Occasion',
          items: ['Casual', 'Party', 'Festive', 'Formal', 'Wedding']
        }
      ]
    },
    men: {
      sections: [
        {
          title: 'Topwear',
          items: ['T-Shirts', 'Casual Shirts', 'Formal Shirts', 'Polos', 'Sweatshirts', 'Jackets', 'Sweaters']
        },
        {
          title: 'Bottomwear',
          items: ['Jeans', 'Casual Trousers', 'Formal Trousers', 'Shorts', 'Track Pants', 'Joggers']
        },
        {
          title: 'Ethnicwear',
          items: ['Kurtas', 'Sherwanis', 'Ethnic Jackets', 'Nehru Jackets']
        },
        {
          title: 'Sports & Activewear',
          items: ['Sports T-shirts', 'Track Pants', 'Jackets', 'Sports Shoes', 'Gym Wear']
        },
        {
          title: 'Sleepwear',
          items: ['Night Suits', 'Lounge Pants', 'Robes', 'Track Suits']
        },
        {
          title: 'Footwear',
          items: ['Casual Shoes', 'Formal Shoes', 'Sneakers', 'Sports Shoes', 'Sandals', 'Slippers']
        },
        {
          title: 'Accessories',
          items: ['Watches', 'Belts', 'Wallets', 'Sunglasses', 'Caps', 'Bags', 'Ties']
        },
        {
          title: 'Fragrances',
          items: ['Perfumes', 'Deodorants', 'Body Sprays']
        }
      ]
    },
    kids: {
      sections: [
        {
          title: 'Boys',
          items: ['T-Shirts', 'Shirts', 'Jeans', 'Trousers', 'Shorts', 'Ethnic Wear', 'Party Wear']
        },
        {
          title: 'Girls',
          items: ['Dresses', 'Tops', 'Jeans', 'Skirts', 'Leggings', 'Ethnic Wear', 'Party Wear']
        },
        {
          title: 'Infants',
          items: ['Bodysuits', 'Rompers', 'Sets', 'Sleepwear']
        },
        {
          title: 'Footwear',
          items: ['Boys Shoes', 'Girls Shoes', 'Sandals', 'Sneakers', 'School Shoes']
        },
        {
          title: 'Accessories',
          items: ['Bags', 'Caps', 'Belts', 'Sunglasses', 'Hair Accessories']
        },
        {
          title: 'Shop By Age',
          items: ['0-2 Years', '2-5 Years', '5-8 Years', '8-12 Years', '12+ Years']
        }
      ]
    },
    home: {
      sections: [
        {
          title: 'Bed Linen',
          items: ['Bed Sheets', 'Bed Covers', 'Blankets', 'Quilts', 'Pillows', 'Cushions']
        },
        {
          title: 'Bath',
          items: ['Bath Towels', 'Hand Towels', 'Bath Mats', 'Bath Robes']
        },
        {
          title: 'Kitchen & Dining',
          items: ['Table Covers', 'Napkins', 'Aprons', 'Kitchen Towels']
        },
        {
          title: 'Home Décor',
          items: ['Curtains', 'Cushion Covers', 'Wall Art', 'Showpieces', 'Indoor Plants']
        },
        {
          title: 'Storage',
          items: ['Storage Boxes', 'Organizers', 'Laundry Bags']
        }
      ]
    },
    brands: {
      sections: [
        {
          title: 'Premium Brands',
          items: ['Allen Solly', 'Van Heusen', 'Peter England', 'Louis Philippe', 'Colorplus']
        },
        {
          title: 'Women Brands',
          items: ['W', 'Aurelia', 'Akkriti', 'Honey', 'Annabelle']
        },
        {
          title: 'Men Brands',
          items: ['Scullers', 'Indigo Nation', 'SF Jeans', 'SELECTED HOMME']
        },
        {
          title: 'Kids Brands',
          items: ['Chirpie Pie', 'Gini & Jony', 'Palm Tree', 'Ajile']
        },
        {
          title: 'International',
          items: ['ONLY', 'VERO MODA', 'JACK & JONES', 'Superdry']
        }
      ]
    },
    sale: {
      sections: [
        {
          title: 'Women Sale',
          items: ['Tops', 'Dresses', 'Jeans', 'Ethnic Wear', 'Footwear', 'Accessories']
        },
        {
          title: 'Men Sale',
          items: ['Shirts', 'T-Shirts', 'Jeans', 'Formal Wear', 'Footwear', 'Accessories']
        },
        {
          title: 'Kids Sale',
          items: ['Boys Wear', 'Girls Wear', 'Infants', 'Footwear']
        },
        {
          title: 'Discount Range',
          items: ['Under ₹499', '₹500-₹999', '₹1000-₹1999', 'Above ₹2000']
        },
        {
          title: 'Clearance',
          items: ['End of Season', 'Last Pieces', 'Limited Stock']
        }
      ]
    }
  };

  const data = menuData[category] || menuData.entire;

  return (
    <div className="mega-menu">
      <div className="mega-menu-container">
        <div className="mega-menu-content">
          {data.sections.map((section, index) => (
            <div key={index} className="mega-menu-column">
              <h4 className="mega-menu-title">{section.title}</h4>
              <ul className="mega-menu-list">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <a href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Featured Banner */}
        <div className="mega-menu-banner">
          <div className="banner-image">
            <div className="banner-placeholder">
              <span>{category.toUpperCase()}</span>
              <span className="collection-text">COLLECTION</span>
            </div>
            <div className="banner-overlay">
              <h3>NEW COLLECTION</h3>
              <button className="shop-now-btn">SHOP NOW</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;

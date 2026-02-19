/**
 * ClassMora — Full Product & Category Seeder
 * Run: node seedProducts.js
 */
const mongoose = require('mongoose');
const dotenv   = require('dotenv');
const User     = require('./models/User');
const Category = require('./models/Category');
const Product  = require('./models/Product');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => { console.error('❌ MongoDB Error:', err.message); process.exit(1); });

// ── Category Data ─────────────────────────────────────────
const categoryData = [
  { name: 'Women',    description: "Women's clothing and accessories", image: 'https://picsum.photos/seed/women/400/300'    },
  { name: 'Men',      description: "Men's clothing and accessories",   image: 'https://picsum.photos/seed/men/400/300'      },
  { name: 'Kids',     description: "Kids' clothing and toys",          image: 'https://picsum.photos/seed/kids/400/300'     },
  { name: 'Beauty',   description: 'Beauty and skincare products',     image: 'https://picsum.photos/seed/beauty/400/300'   },
  { name: 'Home',     description: 'Home and living essentials',       image: 'https://picsum.photos/seed/home/400/300'     },
  { name: 'Footwear', description: 'Shoes, sandals and more',          image: 'https://picsum.photos/seed/shoes/400/300'    },
];

// ── Product Data ─────────────────────────────────────────
const makeProducts = (cats, sellerId) => [
  // ── Women ────────────────────────────────────────────
  {
    title: 'Floral Wrap Dress',
    description: 'A beautiful floral wrap dress perfect for all occasions. Made from lightweight fabric for maximum comfort.',
    price: 1299,  comparePrice: 2499,  brand: 'FashionNova',
    category: cats['Women']._id, seller: sellerId, isFeatured: true, isActive: true,
    images: [{ url: 'https://picsum.photos/seed/dress1/400/500', public_id: 'dress1' }],
    tags: ['women', 'dress', 'floral', 'summer'],
  },
  {
    title: 'High-Rise Skinny Jeans',
    description: 'Classic high-rise skinny jeans that flatter every figure. Stretchable and comfortable for all-day wear.',
    price: 1799, comparePrice: 3299, brand: 'Levis',
    category: cats['Women']._id, seller: sellerId, isFeatured: true, isActive: true,
    images: [{ url: 'https://picsum.photos/seed/jeans1/400/500', public_id: 'jeans1' }],
    tags: ['women', 'jeans', 'denim'],
  },
  {
    title: 'Cotton Kurti Set',
    description: 'Elegant cotton kurti with matching palazzo. Perfect for festive occasions and casual wear.',
    price: 999, comparePrice: 1999, brand: 'W for Woman',
    category: cats['Women']._id, seller: sellerId, isFeatured: false, isActive: true,
    images: [{ url: 'https://picsum.photos/seed/kurti1/400/500', public_id: 'kurti1' }],
    tags: ['women', 'kurti', 'ethnic'],
  },
  {
    title: 'Satin Slip Dress',
    description: 'Luxurious satin slip dress ideal for evening events. Available in multiple colors.',
    price: 2199, comparePrice: 3999, brand: 'Zara',
    category: cats['Women']._id, seller: sellerId, isFeatured: true, isActive: true,
    images: [{ url: 'https://picsum.photos/seed/satin1/400/500', public_id: 'satin1' }],
    tags: ['women', 'dress', 'evening', 'party'],
  },
  // ── Men ──────────────────────────────────────────────
  {
    title: 'Slim Fit Formal Shirt',
    description: 'A premium slim-fit formal shirt for office and business meetings. Wrinkle resistant fabric.',
    price: 899, comparePrice: 1699, brand: 'Van Heusen',
    category: cats['Men']._id, seller: sellerId, isFeatured: true, isActive: true,
    images: [{ url: 'https://picsum.photos/seed/shirt1/400/500', public_id: 'shirt1' }],
    tags: ['men', 'shirt', 'formal'],
  },
  {
    title: 'Slim Stretch Chinos',
    description: 'Modern slim-fit chinos with stretch fabric. From office to weekend — wear them everywhere.',
    price: 1499, comparePrice: 2799, brand: 'H&M',
    category: cats['Men']._id, seller: sellerId, isFeatured: true, isActive: true,
    images: [{ url: 'https://picsum.photos/seed/chinos1/400/500', public_id: 'chinos1' }],
    tags: ['men', 'pants', 'casual'],
  },
  {
    title: 'Oversized Graphic Tee',
    description: 'Trendy oversized graphic t-shirt made of 100% combed cotton. Perfect for casual streetwear.',
    price: 599, comparePrice: 999, brand: 'HRX',
    category: cats['Men']._id, seller: sellerId, isFeatured: false, isActive: true,
    images: [{ url: 'https://picsum.photos/seed/tshirt1/400/500', public_id: 'tshirt1' }],
    tags: ['men', 'tshirt', 'casual', 'streetwear'],
  },
  {
    title: 'Wool Blend Blazer',
    description: 'Premium wool-blend blazer for a sophisticated look. Ideal for formal events and business meetings.',
    price: 4999, comparePrice: 8999, brand: 'Raymond',
    category: cats['Men']._id, seller: sellerId, isFeatured: true, isActive: true,
    images: [{ url: 'https://picsum.photos/seed/blazer1/400/500', public_id: 'blazer1' }],
    tags: ['men', 'blazer', 'formal', 'premium'],
  },
  // ── Kids ─────────────────────────────────────────────
  {
    title: 'Cartoon Print T-Shirt',
    description: 'Fun cartoon print t-shirt for kids. Made from soft and breathable cotton fabric.',
    price: 349, comparePrice: 699, brand: 'Cherokee',
    category: cats['Kids']._id, seller: sellerId, isFeatured: false, isActive: true,
    images: [{ url: 'https://picsum.photos/seed/kidstee1/400/500', public_id: 'kidstee1' }],
    tags: ['kids', 'tshirt', 'cartoon'],
  },
  {
    title: 'Frilly Party Dress',
    description: 'Adorable frilly party dress for little girls. Perfect for birthdays and special occasions.',
    price: 799, comparePrice: 1499, brand: 'Lilliput',
    category: cats['Kids']._id, seller: sellerId, isFeatured: true, isActive: true,
    images: [{ url: 'https://picsum.photos/seed/kidsdress1/400/500', public_id: 'kidsdress1' }],
    tags: ['kids', 'dress', 'party', 'girls'],
  },
  // ── Beauty ───────────────────────────────────────────
  {
    title: 'Matte Lipstick Set (6 Shades)',
    description: 'Set of 6 long-lasting matte lipsticks in trending shades. Cruelty-free formula.',
    price: 699, comparePrice: 1299, brand: 'Maybelline',
    category: cats['Beauty']._id, seller: sellerId, isFeatured: true, isActive: true,
    images: [{ url: 'https://picsum.photos/seed/lipstick1/400/500', public_id: 'lipstick1' }],
    tags: ['beauty', 'makeup', 'lipstick'],
  },
  {
    title: 'Vitamin C Glow Serum',
    description: 'Advanced Vitamin C brightening serum for radiant and even-toned skin. Dermatologically tested.',
    price: 1199, comparePrice: 1999, brand: 'Plum',
    category: cats['Beauty']._id, seller: sellerId, isFeatured: false, isActive: true,
    images: [{ url: 'https://picsum.photos/seed/serum1/400/500', public_id: 'serum1' }],
    tags: ['beauty', 'skincare', 'serum'],
  },
  // ── Home ─────────────────────────────────────────────
  {
    title: 'Boho Macrame Wall Hanging',
    description: 'Handcrafted macrame wall hanging that adds a bohemian touch to any room.',
    price: 899, comparePrice: 1499, brand: 'Artisana',
    category: cats['Home']._id, seller: sellerId, isFeatured: false, isActive: true,
    images: [{ url: 'https://picsum.photos/seed/macrame1/400/500', public_id: 'macrame1' }],
    tags: ['home', 'decor', 'boho'],
  },
  {
    title: 'Ceramic Planter Set (3 Pcs)',
    description: 'Set of 3 minimalist ceramic planters in pastel colors. Perfect for succulents and small plants.',
    price: 1299, comparePrice: 2199, brand: 'Nestasia',
    category: cats['Home']._id, seller: sellerId, isFeatured: true, isActive: true,
    images: [{ url: 'https://picsum.photos/seed/planter1/400/500', public_id: 'planter1' }],
    tags: ['home', 'decor', 'plants', 'ceramic'],
  },
  // ── Footwear ─────────────────────────────────────────
  {
    title: 'White Chunky Sneakers',
    description: 'Trendy chunky-sole sneakers in classic white. Lightweight and comfortable for daily wear.',
    price: 1999, comparePrice: 3499, brand: 'Puma',
    category: cats['Footwear']._id, seller: sellerId, isFeatured: true, isActive: true,
    images: [{ url: 'https://picsum.photos/seed/sneaker1/400/500', public_id: 'sneaker1' }],
    tags: ['footwear', 'sneakers', 'casual'],
  },
  {
    title: 'Block Heel Sandals',
    description: 'Elegant block-heel sandals that pair perfectly with both casual and formal outfits.',
    price: 1499, comparePrice: 2799, brand: 'Steve Madden',
    category: cats['Footwear']._id, seller: sellerId, isFeatured: true, isActive: true,
    images: [{ url: 'https://picsum.photos/seed/sandal1/400/500', public_id: 'sandal1' }],
    tags: ['footwear', 'heels', 'sandals', 'women'],
  },
];

// ── Run Seeder ────────────────────────────────────────────
async function seed() {
  try {
    // ─ 1. Create or find a seller user ─────────────────
    let seller = await User.findOne({ email: 'seller@classmora.com' });
    if (!seller) {
      seller = await User.create({
        name: 'ClassMora Store',
        email: 'seller@classmora.com',
        password: 'seller123',
        role: 'seller',
        storeName: 'ClassMora Official',
        storeDescription: 'Your go-to store for premium fashion',
        sellerApproved: true,
      });
      console.log('✅ Seller created:', seller.email);
    } else {
      console.log('ℹ️  Seller already exists:', seller.email);
    }

    // ─ 2. Upsert categories ─────────────────────────────
    const cats = {};
    for (const catData of categoryData) {
      let cat = await Category.findOne({ name: catData.name });
      if (!cat) {
        cat = await Category.create(catData);
        console.log('✅ Category created:', cat.name);
      } else {
        console.log('ℹ️  Category exists:', cat.name);
      }
      cats[cat.name] = cat;
    }

    // ─ 3. Clear old products and re-seed ────────────────
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    const products = makeProducts(cats, seller._id);
    const created = [];
    for (const pData of products) {
      const product = new Product(pData);
      await product.save();   // triggers pre-save slug generation
      created.push(product);
    }
    console.log(`\n✅ Seeded ${created.length} products:\n`);
    created.forEach(p => console.log(`   - [${p.price}] ${p.title}`));

    console.log('\n🚀 Seed complete! Start the server and open the frontend.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();

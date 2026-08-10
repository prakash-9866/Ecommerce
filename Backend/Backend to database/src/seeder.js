const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/productModel');
const User = require('./models/userModel');
const connectDB = require('./config/db');

dotenv.config({ path: __dirname + '/../.env' });

const products = [
  { name: 'Classic Denim Jacket', category: 'Fashion', price: 1469, imageUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=300&h=300&fit=crop', description: 'A classic denim jacket for any occasion.', stock: 50 },
  { name: 'Summer Floral Dress', category: 'Fashion', price: 1149, imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=300&h=300&fit=crop', description: 'Beautiful floral dress for summer vibes.', stock: 40 },
  { name: 'Premium Cotton T-Shirt', category: 'Fashion', price: 489, imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop', description: 'Soft and premium cotton t-shirt.', stock: 100 },
  { name: 'Shops', category: 'Fashion', price: 809, imageUrl: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=300&h=300&fit=crop', description: 'Stylish slim fit jeans.', stock: 60 },
  { name: 'Gold Plated Necklace', category: 'Jewelry', price: 12449, imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=300&fit=crop', description: 'Elegant gold plated necklace.', stock: 20 },
  { name: 'Diamond Stud Earrings', category: 'Jewelry', price: 24899, imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&h=300&fit=crop', description: 'Shiny diamond stud earrings.', stock: 15 },
  { name: 'Silver Bracelet', category: 'Jewelry', price: 6639, imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300&h=300&fit=crop', description: 'Simple and elegant silver bracelet.', stock: 35 },
  { name: 'Pearl Ring', category: 'Jewelry', price: 16599, imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&h=300&fit=crop', description: 'Classic pearl ring.', stock: 25 },
  { name: 'The Great Gatsby', category: 'Books', price: 1244, imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=300&fit=crop', description: 'A classic novel by F. Scott Fitzgerald.', stock: 100 },
  { name: '1984 - George Orwell', category: 'Books', price: 1078, imageUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=300&fit=crop', description: 'Dystopian masterpiece by George Orwell.', stock: 90 },
  { name: 'Atomic Habits', category: 'Books', price: 2074, imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=300&h=300&fit=crop', description: 'Change your habits with this best-seller.', stock: 120 },
  { name: 'The Alchemist', category: 'Books', price: 1410, imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=300&fit=crop', description: 'A journey of self-discovery.', stock: 80 },
  { name: 'Yoga Mat Pro', category: 'Fitness', price: 3319, imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=300&h=300&fit=crop', description: 'Professional grade yoga mat.', stock: 45 },
  { name: 'Adjustable Dumbbells', category: 'Fitness', price: 12449, imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=300&fit=crop', description: 'Perfect for home workouts.', stock: 10 },
  { name: 'Resistance Bands Set', category: 'Fitness', price: 2074, imageUrl: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=300&h=300&fit=crop', description: 'Complete set of resistance bands.', stock: 70 },
  { name: 'Fitness Tracker Watch', category: 'Fitness', price: 6639, imageUrl: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=300&h=300&fit=crop', description: 'Track your health and fitness.', stock: 30 },
  { name: 'Professional Soccer Ball', category: 'Sports', price: 2904, imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=300&h=300&fit=crop', description: 'High-quality soccer ball.', stock: 55 },
  { name: 'Tennis Racket Pro', category: 'Sports', price: 10789, imageUrl: 'https://www.google.com/imgres?q=Tennis%20Racket%20Pro&imgurl=https%3A%2F%2Fi5.walmartimages.com%2Fseo%2FHEAD-Tour-Pro-S30-Tennis-Racquet-110-sq-in-Head-Size-9-9-Ounce-Weight-Black-Yellow_51713d44-ea9e-4399-ac2e-dc82f21727fc_1.07dc0e5c6433617d8bcf11aadc097da0.jpeg&imgrefurl=https%3A%2F%2Fwww.ubuy.co.in%2Fproduct%2F3TVQ2M2ZK-head-tour-pro-s30-tennis-racquet%3Fsrsltid%3DAfmBOooIkzrFByW9jkXISEUjXzZCDWj8KJnoqmOyZJ4lBh-OkF5QY9cl&docid=XK-lkiDWxVQdvM&tbnid=NXNLu9AL22N0oM&vet=12ahUKEwik9szXt5eUAxVURWwGHfVfL-cQnPAOegQIGBAB..i&w=3200&h=3200&hcb=2&itg=1&ved=2ahUKEwik9szXt5eUAxVURWwGHfVfL-cQnPAOegQIGBAB', description: 'Pro-level tennis racket.', stock: 20 },
  { name: 'Basketball Indoor', category: 'Sports', price: 2489, imageUrl: 'https://www.google.com/imgres?q=Basketball%20Indoor&imgurl=https%3A%2F%2Fstatic.homeguide.com%2Fassets%2Fimages%2Fcontent%2Fhomeguide-indoor-basketball-court.jpg&imgrefurl=https%3A%2F%2Fhomeguide.com%2Fcosts%2Findoor-basketball-court-cost&docid=jWpZJ_MMlJSy1M&tbnid=ta7BuseDKOaacM&vet=12ahUKEwib75n3t5eUAxW9SGwGHVfjLa0QnPAOegQIFxAB..i&w=1800&h=1200&hcb=2&ved=2ahUKEwib75n3t5eUAxW9SGwGHVfjLa0QnPAOegQIFxAB', description: 'Official size indoor basketball.', stock: 40 },
  { name: 'Golf Club Set', category: 'Sports', price: 33199, imageUrl: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=300&h=300&fit=crop', description: 'Complete golf club set for beginners and pros.', stock: 5 },
];

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    isAdmin: true,
    isVerified: true
  },
];

const seedData = async () => {
  try {
    await connectDB();
    
  
    await Product.deleteMany();
    await User.deleteMany();
    
    
    await Product.insertMany(products);
    
  
    for (const u of users) {
      await User.create(u);
    }
    
    console.log('User and Product Data Imported! ✅');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message} ❌`);
    process.exit(1);
  }
};

seedData();

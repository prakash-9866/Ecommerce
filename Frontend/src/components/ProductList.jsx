import ProductCard from './ProductCard'

const ProductList = ({ products, onAddToCart, onAddToWishlist, selectedCategory, searchTerm, cart, wishlist }) => {
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
    (selectedCategory === 'All' || p.category === selectedCategory)
  )

  return (
    <div className="products-grid">
      {filteredProducts.map(product => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onAddToCart={onAddToCart}
          onAddToWishlist={onAddToWishlist}
          cart={cart}
          wishlist={wishlist}
        />
      ))}
    </div>
  )
}

export default ProductList


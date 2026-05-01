import { Link } from 'react-router-dom'

const ProductCard = ({ product, onAddToCart, onAddToWishlist, cart, wishlist }) => {
  const isInWishlist = wishlist.some(item => item.id === product.id)

  return (
    <Link to={`/product/${product.id}`} className="product-card-link">
      <div className="product-card">
        <div className="product-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-price">₹{product.price.toLocaleString('en-IN')}</p>
          <div style={{display: 'flex', gap: '0.5rem'}}>
            <button 
              className="add-to-cart-btn" 
              onClick={(e) => { e.preventDefault(); onAddToCart(product); }}
            >
              Add to Cart
            </button>
            <button 
              className="add-to-wishlist-btn"
              onClick={(e) => { e.preventDefault(); onAddToWishlist(product); }}
              style={{
                background: isInWishlist ? '#f43f5e' : 'transparent',
                color: isInWishlist ? 'white' : '#64748b',
                border: '2px solid #e2e8f0',
                padding: '0.75rem',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              {isInWishlist ? '❤️' : '♡'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard


import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

const ProductDetail = ({ products, onAddToCart, onAddToWishlist, cart, wishlist }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = products.find(p => String(p.id) === String(id))
  const [quantity, setQuantity] = useState(1)

  // Scroll to top and reset quantity whenever product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setQuantity(1)
  }, [id])

  const isInCart = cart.some(item => item.id === product?.id)
  const isInWishlist = wishlist.some(item => item.id === product?.id)

  if (!product) {
    return (
      <div className="product-detail">
        <div className="detail-header">
          <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
        </div>
        <div style={{textAlign: 'center', padding: '4rem'}}>
          <h2>Product not found</h2>
          <Link to="/">Go to Home</Link>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    const productWithQty = {...product, quantity}
    onAddToCart(productWithQty)
  }

  // All other products (excluding the current one)
  const relatedProducts = products.filter(p => p.id !== product.id)

  return (
    <div className="product-detail">
      <div className="detail-header">
        <button onClick={() => navigate(-1)} className="back-btn">← Back to Products</button>
      </div>

      {/* Main Product Info */}
      <div className="detail-content">
        <div className="detail-image">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="detail-info">
          <h1 className="detail-name">{product.name}</h1>
          <span className="detail-category">{product.category}</span>
          <div className="detail-price">₹{product.price.toLocaleString('en-IN')}</div>

          <div className="detail-description">
            <h3>About this product:</h3>
            <p>High-quality {product.category.toLowerCase()} item perfect for everyday use. Premium materials ensure long-lasting durability and comfort.</p>
          </div>

          <div className="detail-actions">
            <div className="quantity-selector">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            <div className="action-buttons">
              <button
                className={`add-to-cart-detail ${isInCart ? 'in-cart' : ''}`}
                onClick={handleAddToCart}
              >
                {isInCart ? '✓ In Cart' : 'Add to Cart'}
              </button>
              <button
                className={`add-to-wishlist-detail ${isInWishlist ? 'active' : ''}`}
                onClick={() => onAddToWishlist(product)}
              >
                {isInWishlist ? '❤️' : '♡'} Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related / Remaining Products Section */}
      <div className="related-products-section">
        <h2 className="related-products-title">You May Also Like</h2>
        <div className="related-products-grid">
          {relatedProducts.map(p => {
            const pInCart = cart.some(item => item.id === p.id)
            const pInWishlist = wishlist.some(item => item.id === p.id)
            return (
              <Link to={`/product/${p.id}`} key={p.id} className="related-card-link">
                <div className="related-card">
                  <div className="related-card-image">
                    <img src={p.image} alt={p.name} />
                    <span className="related-card-category">{p.category}</span>
                  </div>
                  <div className="related-card-info">
                    <h4 className="related-card-name">{p.name}</h4>
                    <p className="related-card-price">₹{p.price.toLocaleString('en-IN')}</p>
                    <div className="related-card-actions">
                      <button
                        className={`related-add-cart-btn ${pInCart ? 'in-cart' : ''}`}
                        onClick={(e) => { e.preventDefault(); onAddToCart(p) }}
                      >
                        {pInCart ? '✓ In Cart' : 'Add to Cart'}
                      </button>
                      <button
                        className={`related-wishlist-btn ${pInWishlist ? 'active' : ''}`}
                        onClick={(e) => { e.preventDefault(); onAddToWishlist(p) }}
                      >
                        {pInWishlist ? '❤️' : '♡'}
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail

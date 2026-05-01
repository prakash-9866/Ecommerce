# Cart Button Update TODO

## Status: Completed

**Changes Made:**
- Cart.jsx: Fixed remove to call parent onRemoveFromCart, key=item.id, no reload/console.
- ProductCard.jsx: 'In Cart' → 'Go to Cart', removed disabled (clickable).

1. [ ] Fix Cart.jsx: Use onRemoveFromCart prop properly, remove reload hack, fix key prop.
2. [ ] Update ProductCard.jsx: Change 'In Cart' to 'View Cart' (Link to /cart), keep enabled.
3. [ ] Test: Add item (button -> View Cart), go to cart (shows item), remove (works).
4. [ ] Mark complete.

**Why:** Button currently disables and shows 'In Cart', but user wants updated behavior (e.g. navigate or qty).

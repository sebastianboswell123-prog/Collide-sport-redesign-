import { createContext, useContext, useEffect, useReducer, useState, useCallback } from 'react'

const CartContext = createContext(null)

const CART_KEY = 'collide_cart'
const RECENT_KEY = 'collide_recent'

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* quota exceeded */
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const addQty = action.qty > 0 ? action.qty : 1
      const index = state.findIndex(item => item.id === action.product.id)
      if (index > -1) {
        return state.map((item, j) =>
          j === index ? { ...item, qty: item.qty + addQty } : item
        )
      }
      return [...state, { ...action.product, qty: addQty }]
    }
    case 'REMOVE':
      return state.filter(item => item.id !== action.id)
    case 'UPDATE_QTY':
      if (action.qty <= 0) {
        return state.filter(item => item.id !== action.id)
      }
      return state.map(item =>
        item.id === action.id ? { ...item, qty: action.qty } : item
      )
    case 'CLEAR':
      return []
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, [], () => loadFromStorage(CART_KEY, []))
  const [open, setOpen] = useState(false)
  const [recentlyViewed, setRecentlyViewed] = useState(() => loadFromStorage(RECENT_KEY, []))

  useEffect(() => {
    saveToStorage(CART_KEY, items)
  }, [items])

  useEffect(() => {
    saveToStorage(RECENT_KEY, recentlyViewed)
  }, [recentlyViewed])

  const addToCart = useCallback((product, qty = 1) => {
    dispatch({ type: 'ADD', product, qty })
    setOpen(true)
  }, [])

  const removeFromCart = useCallback((id) => {
    dispatch({ type: 'REMOVE', id })
  }, [])

  const updateQty = useCallback((id, qty) => {
    dispatch({ type: 'UPDATE_QTY', id, qty })
  }, [])

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR' })
  }, [])

  const isInCart = useCallback((id) => {
    return items.some(item => item.id === id)
  }, [items])

  const addRecentlyViewed = useCallback((product) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id)
      return [product, ...filtered].slice(0, 10)
    })
  }, [])

  const getRecentlyViewed = useCallback(() => {
    return recentlyViewed
  }, [recentlyViewed])

  const totalItems = items.reduce((sum, item) => sum + item.qty, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.qty, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        open,
        setOpen,
        totalItems,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        isInCart,
        addRecentlyViewed,
        getRecentlyViewed,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)

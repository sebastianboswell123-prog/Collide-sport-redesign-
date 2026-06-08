import { createContext, useContext, useReducer, useState } from 'react'

const CartContext = createContext(null)

function reducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const index = state.findIndex(item => item.id === action.product.id)
      if (index > -1) {
        return state.map((item, j) => j === index ? { ...item, qty: item.qty + 1 } : item)
      }
      return [...state, { ...action.product, qty: 1 }]
    }
    case 'REMOVE':
      return state.filter(item => item.id !== action.id)
    case 'CLEAR':
      return []
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, [])
  const [open, setOpen] = useState(false)

  const addToCart = (product) => {
    dispatch({ type: 'ADD', product })
    setOpen(true)
  }

  const removeFromCart = (id) => dispatch({ type: 'REMOVE', id })
  const clearCart = () => dispatch({ type: 'CLEAR' })
  const totalItems = items.reduce((sum, item) => sum + item.qty, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.qty, 0)

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, totalItems, totalPrice, open, setOpen }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)

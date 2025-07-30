import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { Artwork } from '@/lib/types'

interface CartItem {
  artwork: Artwork
  quantity: number
}

interface CartState {
  items: CartItem[]
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: { artwork: Artwork; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: { artworkId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { artworkId: string; quantity: number } }
  | { type: 'CLEAR_CART' }

const initialState: CartState = {
  items: [],
}

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(
        (item) => item.artwork.id === action.payload.artwork.id
      )

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.artwork.id === action.payload.artwork.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        }
      }

      return {
        ...state,
        items: [...state.items, action.payload],
      }
    }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter((item) => item.artwork.id !== action.payload.artworkId),
      }

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map((item) =>
          item.artwork.id === action.payload.artworkId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      }

    case 'CLEAR_CART':
      return initialState

    default:
      return state
  }
}

interface CartContextType {
  state: CartState
  addToCart: (artwork: Artwork, quantity: number) => void
  removeFromCart: (artworkId: string) => void
  updateQuantity: (artworkId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState, () => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        return JSON.parse(savedCart)
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error)
        return initialState
      }
    }
    return initialState
  })

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state))
  }, [state])

  const addToCart = (artwork: Artwork, quantity: number) => {
    dispatch({ type: 'ADD_TO_CART', payload: { artwork, quantity } })
  }

  const removeFromCart = (artworkId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { artworkId } })
  }

  const updateQuantity = (artworkId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { artworkId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return state.items.reduce(
      (total, item) => total + item.artwork.price * item.quantity,
      0
    )
  }

  return (
    <CartContext.Provider
      value={{
        state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
} 
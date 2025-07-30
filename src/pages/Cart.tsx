import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/lib/api-client'
import { API_ENDPOINTS } from '@/config/api'
import { useMutation } from '@tanstack/react-query'

interface CheckoutResponse {
  message: string;
  transactions: any[];
  checkoutUrl: string;
}

export default function Cart() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { state, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart()
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  })

  const handleQuantityChange = (artworkId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(artworkId)
      toast.success('Item removed from cart')
    } else {
      updateQuantity(artworkId, newQuantity)
    }
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const isAddressValid = () => {
    return Object.values(shippingAddress).every(value => value.trim() !== '')
  }

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error('Please sign in to checkout')
      }

      if (!isAddressValid()) {
        throw new Error('Please fill in all shipping address fields')
      }

      // Send all cart items to the checkout endpoint
      const response = await api.post<CheckoutResponse>(API_ENDPOINTS.checkout, {
        items: state.items.map(item => ({
          artworkId: item.artwork.id,
          quantity: item.quantity,
          price: Number(item.artwork.price)
        })),
        buyerId: user.id,
        shippingAddress
      })

      return response.data as CheckoutResponse
    },
    onSuccess: (data) => {
      toast.success('Checkout initiated! Redirecting to payment...')
      // Open checkout URL in a new tab
      window.open(data.checkoutUrl, '_blank')
      // Clear cart and redirect to profile
      clearCart()
      navigate('/profile')
    },
    onError: (error: Error) => {
      toast.error(`Checkout failed: ${error.message}`)
    }
  })

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please sign in to checkout')
      navigate('/signin')
      return
    }

    if (!isAddressValid()) {
      toast.error('Please fill in all shipping address fields')
      return
    }

    checkoutMutation.mutate()
  }

  if (state.items.length === 0) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Add some artworks to your cart to see them here.
            </p>
            <Button onClick={() => navigate('/')}>Continue Shopping</Button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
      <div className="container py-8">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {state.items.map((item) => (
              <Card key={item.artwork.id}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.artwork.imageUrl}
                      alt={item.artwork.title}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.artwork.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        by {item.artwork.artistName}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.artwork.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.artwork.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            removeFromCart(item.artwork.id)
                            toast.success('Item removed from cart')
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="mt-2 font-semibold">
                        ${Number(item.artwork.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  name="fullName"
                  placeholder="Full Name"
                  value={shippingAddress.fullName}
                  onChange={handleAddressChange}
                />
                <Input
                  name="streetAddress"
                  placeholder="Street Address"
                  value={shippingAddress.streetAddress}
                  onChange={handleAddressChange}
                />
                <Input
                  name="city"
                  placeholder="City"
                  value={shippingAddress.city}
                  onChange={handleAddressChange}
                />
                <Input
                  name="state"
                  placeholder="State"
                  value={shippingAddress.state}
                  onChange={handleAddressChange}
                />
                <Input
                  name="zipCode"
                  placeholder="ZIP Code"
                  value={shippingAddress.zipCode}
                  onChange={handleAddressChange}
                />
                <Input
                  name="country"
                  placeholder="Country"
                  value={shippingAddress.country}
                  onChange={handleAddressChange}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${Number(getTotalPrice()).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${Number(getTotalPrice()).toFixed(2)}</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={handleCheckout}
                    disabled={checkoutMutation.isPending || !isAddressValid()}
                  >
                    {checkoutMutation.isPending ? 'Processing...' : 'Proceed to Checkout'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  )
} 
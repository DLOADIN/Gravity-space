import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { Button } from '../ui/button'
import { ShoppingCart } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Avatar, AvatarFallback } from '../ui/avatar'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Browse', href: '/browse' },
  { name: 'Events', href: '/events' },
  { name: 'About', href: '/about' }
]

export function Header() {
  const { user, signout } = useAuth()
  const { getTotalItems } = useCart()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signout()
    navigate('/signin')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <nav className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="text-xl font-bold">
          ARTSPACE
        </Link>

        <div className="flex items-center space-x-6">
          <Link to="/browse" className="text-sm hover:text-primary">
            Browse
          </Link>
          <Link to="/explore" className="text-sm hover:text-primary">
            Explore
          </Link>
          <Link to="/about" className="text-sm hover:text-primary">
            About
          </Link>
          <Link to="/signin" className="text-sm hover:text-primary">
            Login
          </Link>
          {/* {user?.role === 'artist' && (
            <Link to="/manage-artworks" className="text-sm hover:text-primary">
              My Artworks
            </Link>
          )} */}
          <Link to="/cart" className="relative">
            <ShoppingCart className="h-6 w-6" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{user.email[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.email}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.role}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}

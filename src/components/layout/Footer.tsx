
import { Link } from 'react-router-dom'
import { Instagram, Twitter, Facebook } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Footer() {
  return (
    <footer className="bg-secondary py-16 mt-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="inline-block mb-5">
              <span className="font-bold text-xl tracking-tight">Artistry</span>
            </Link>
            <p className="text-muted-foreground text-sm mt-4 mb-6 max-w-xs">
              Curating exceptional artwork from emerging and established artists around the globe.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="https://instagram.com" icon={<Instagram size={18} />} />
              <SocialLink href="https://twitter.com" icon={<Twitter size={18} />} />
              <SocialLink href="https://facebook.com" icon={<Facebook size={18} />} />
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-4 text-sm">Explore</h4>
            <FooterLinkGroup>
              <FooterLink to="/browse">Browse Artwork</FooterLink>
              <FooterLink to="/artists">Artists</FooterLink>
              <FooterLink to="/categories">Categories</FooterLink>
              <FooterLink to="/exhibitions">Exhibitions</FooterLink>
            </FooterLinkGroup>
          </div>
          
          <div>
            <h4 className="font-medium mb-4 text-sm">Information</h4>
            <FooterLinkGroup>
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/contact">Contact</FooterLink>
              <FooterLink to="/faq">FAQ</FooterLink>
              <FooterLink to="/shipping">Shipping & Returns</FooterLink>
            </FooterLinkGroup>
          </div>
          
          <div>
            <h4 className="font-medium mb-4 text-sm">Account</h4>
            <FooterLinkGroup>
              <FooterLink to="/login">Sign In</FooterLink>
              <FooterLink to="/register">Create Account</FooterLink>
              <FooterLink to="/account/profile">My Profile</FooterLink>
              <FooterLink to="/account/orders">Order History</FooterLink>
            </FooterLinkGroup>
          </div>
        </div>
        
        <div className="border-t border-muted mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Artistry. All rights reserved.
          </p>
          
          <div className="flex space-x-6 mt-4 md:mt-0">
            <FooterSmallLink to="/terms">Terms</FooterSmallLink>
            <FooterSmallLink to="/privacy">Privacy</FooterSmallLink>
            <FooterSmallLink to="/cookies">Cookies</FooterSmallLink>
          </div>
        </div>
      </div>
    </footer>
  )
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="h-9 w-9 rounded-full bg-background flex items-center justify-center transition-transform hover:-translate-y-1"
    >
      {icon}
    </a>
  )
}

function FooterLinkGroup({ children }: { children: React.ReactNode }) {
  return (
    <ul className="space-y-3">
      {children}
    </ul>
  )
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <li>
      <Link 
        to={to} 
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        {children}
      </Link>
    </li>
  )
}

function FooterSmallLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link 
      to={to}
      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
    >
      {children}
    </Link>
  )
}

import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { Layout } from '@/components/layout/Layout'
import Index from '@/pages/Index'
import Browse from '@/pages/Browse'
import Artists from '@/pages/Artists'
import About from '@/pages/About'
import Explore from '@/pages/Explore'
import Activity from '@/pages/Activity'
import ManageArtworks from '@/pages/ManageArtworks'
import UploadArtwork from '@/pages/UploadArtwork'
import Profile from '@/pages/Profile'
import Cart from '@/pages/Cart'
import ArtworkDetails from '@/pages/ArtworkDetails'
import { CartProvider } from '@/contexts/CartContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { SignIn } from '@/pages/auth/SignIn'
import { SignUp } from '@/pages/auth/SignUp'
import { useAuth } from '@/contexts/AuthContext'
import CategoryPieces from './pages/CategoryPieces'
import CollectionPage from '@/pages/CollectionPage'
import EventPage from '@/pages/EventPage'
import ArtistDashboard from '@/pages/ArtistDashboard';
import CollectorDashboard from '@/pages/CollectorDashboard';
import CollectorCategories from '@/pages/CollectorCategories';
import CollectorArtists from '@/pages/CollectorArtists';
import CollectorArtworks from '@/pages/CollectorArtworks';

const queryClient = new QueryClient()

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  return user ? <>{children}</> : <Navigate to="/signin" />
}

function ArtistRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user || user.role !== 'artist') {
    return <Navigate to="/sign-in" replace />
  }

  return <>{children}</>
}

// Layout wrapper component that includes the Outlet
function LayoutWrapper() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Router>
          <AuthProvider>
            <Routes>
              {/* Auth routes */}
              <Route path="/signin" element={<SignIn />} />
              <Route path="/login" element={<Navigate to="/signin" />} />
              <Route path="/signup" element={<SignUp />} />

              {/* Main layout routes */}
              <Route element={<LayoutWrapper />}>
                <Route path="/" element={<Index />} />
                <Route path="/browse" element={<Browse />} />
                <Route path="/explore" element={<Explore />} />
                <Route
                  path="/activity"
                  element={
                    <PrivateRoute>
                      <Activity />
                    </PrivateRoute>
                  }
                />
                <Route path="/artists" element={<Artists />} />
                <Route path="/about" element={<About />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/artwork/:id/:slug" element={<ArtworkDetails />} />

                <Route path="/categories/pieces" element={<CategoryPieces />} />
                <Route path="/categories/pieces/:slug" element={<CategoryPieces />} />
                <Route path="/collections/:categorySlug/:collectionId" element={<CollectionPage />} />
                <Route path="/events/:eventId" element={<EventPage />} />
                
                {/* Protected routes */}
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />
                
                {/* Artist routes */}
                <Route
                  path="/manage-artworks"
                  element={
                    <ArtistRoute>
                      <ManageArtworks />
                    </ArtistRoute>
                  }
                />
                <Route
                  path="/upload-artwork"
                  element={
                    <ArtistRoute>
                      <UploadArtwork />
                    </ArtistRoute>
                  }
                />
                <Route
                  path="/edit-artwork/:id"
                  element={
                    <ArtistRoute>
                      <div>Edit Artwork Page (TODO)</div>
                    </ArtistRoute>
                  }
                />
                <Route
                  path="/artist-dashboard"
                  element={
                    <PrivateRoute>
                      <ArtistDashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/collector-dashboard"
                  element={
                    <PrivateRoute>
                      <CollectorDashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/collector-categories"
                  element={
                    <PrivateRoute>
                      <CollectorCategories />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/collector-artists"
                  element={
                    <PrivateRoute>
                      <CollectorArtists />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/collector-artworks"
                  element={
                    <PrivateRoute>
                      <CollectorArtworks />
                    </PrivateRoute>
                  }
                />
              </Route>

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            <Toaster />
          </AuthProvider>
        </Router>
      </CartProvider>
    </QueryClientProvider>
  )
}

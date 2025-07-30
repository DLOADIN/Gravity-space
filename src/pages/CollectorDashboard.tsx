import React from 'react';
import { CollectorSidebar } from '../components/CollectorSidebar';

export default function CollectorDashboard() {
  return (
    <div className="flex">
      <CollectorSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-4">Collector Dashboard</h1>
        <p className="text-gray-600 mb-8">Welcome, collector! Here you can view your collection and explore new artworks.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-2">Categories</h3>
            <p className="text-gray-600">Manage artwork categories</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-2">Artists</h3>
            <p className="text-gray-600">Manage artist information</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-2">Artworks</h3>
            <p className="text-gray-600">Manage your artwork collection</p>
          </div>
        </div>
      </div>
    </div>
  );
} 
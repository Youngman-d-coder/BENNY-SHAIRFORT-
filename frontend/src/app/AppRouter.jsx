
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import StorefrontLayout from '../components/layout/StorefrontLayout'
import AdminLayout from '../components/layout/AdminLayout'

import HomePage from '../features/catalogue/pages/HomePage'
import CataloguePage from '../features/catalogue/pages/CataloguePage'
import ProductDetailPage from '../features/catalogue/pages/ProductDetailPage'
import AdminDashboardPage from '../features/admin/pages/AdminDashboardPage'
import AdminSettingsPage from '../features/admin/pages/AdminSettingsPage'
import AdminEnquiriesPage from '../features/admin/pages/AdminEnquiriesPage'
import AdminProductsPage from '../features/admin/pages/AdminProductsPage'


function PlaceholderPage({ title }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <h1 className="font-display text-3xl">{title}</h1>
      <p className="mt-3 text-white/60">This page is under development.</p>
    </section>
  )
}

function NotFoundPage() {
  return (
    <section className="px-6 py-24 text-center">
      <h1 className="font-display text-5xl">404</h1>
      <p className="mt-4 text-white/60">This page could not be found.</p>
    </section>
  )
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<StorefrontLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogue" element={<CataloguePage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/about" element={<PlaceholderPage title="About Us" />} />
          <Route path="/contact" element={<PlaceholderPage title="Contact" />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="categories" element={<PlaceholderPage title="Categories" />} />
          <Route path="enquiries" element={<AdminEnquiriesPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

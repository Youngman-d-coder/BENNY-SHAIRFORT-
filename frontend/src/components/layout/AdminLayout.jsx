
import { Link, Outlet } from 'react-router-dom'

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-midnight text-champagne">
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-5">
        <span className="font-display text-xl text-gold">
          Benny'shairfort
        </span>

        <span className="text-sm text-white/60">Administration</span>
      </header>

      <div className="flex min-h-[calc(100vh-73px)]">
        <aside className="w-60 shrink-0 border-r border-white/10 p-5">
          <nav className="flex flex-col gap-4 text-sm">
            <Link to="/admin" className="hover:text-gold">Dashboard</Link>
            <Link to="/admin/products" className="hover:text-gold">Products</Link>
            <Link to="/admin/categories" className="hover:text-gold">Categories</Link>
            <Link to="/admin/enquiries" className="hover:text-gold">Enquiries</Link>
            <Link to="/admin/settings" className="hover:text-gold">Settings</Link>
          </nav>
        </aside>

        <main className="min-w-0 flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import ProductCard from './components/ProductCard'
import CartDrawer from './components/CartDrawer'

function App() {
  const [products, setProducts] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const fetchProducts = async (q = '', cat = '') => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (cat) params.set('category', cat)
    const url = `${baseUrl}/products${params.toString() ? `?${params.toString()}` : ''}`
    const res = await fetch(url)
    const data = await res.json()
    setProducts(Array.isArray(data) ? data : [])
  }

  useEffect(() => {
    fetchProducts().catch(() => setProducts([]))
  }, [baseUrl])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchProducts(query, category)
  }

  const addToCart = (product, size) => {
    setCart((prev) => {
      const keyMatch = (p) => p.id === product.id && String(p.size || '') === String(size || '')
      const exist = prev.find(keyMatch)
      if (exist) return prev.map(p => keyMatch(p) ? { ...p, quantity: p.quantity + 1 } : p)
      return [...prev, { id: product.id, title: product.title, price: product.price, image: product.image, quantity: 1, size }]
    })
    setCartOpen(true)
  }

  const changeQty = (id, qty, size) => {
    setCart((prev) => prev.map(p => (p.id === id && String(p.size||'')===String(size||'')) ? { ...p, quantity: qty } : p))
  }

  const removeItem = (id, size) => setCart((prev) => prev.filter(p => !(p.id === id && String(p.size||'')===String(size||''))))

  const total = useMemo(() => cart.reduce((a, c) => a + c.price * c.quantity, 0), [cart])

  const [orderResult, setOrderResult] = useState(null)

  const checkout = async (paymentMethod) => {
    setLoading(true)
    try {
      const payload = {
        items: cart.map(c => ({ product_id: c.id, quantity: c.quantity, size: c.size })),
        customer: {
          name: 'Pelanggan Sepatuku',
          email: 'pelanggan@example.com',
          phone: '08123456789',
          address: 'Jl. Mawar No. 1',
          city: 'Jakarta',
          postal_code: '12345',
        },
        payment_method: paymentMethod,
      }
      const res = await fetch(`${baseUrl}/checkout`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Checkout gagal')
      setOrderResult(data)
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-sky-50">
      <Header cartCount={cart.length} onCartClick={() => setCartOpen(true)} />

      <main className="max-w-6xl mx-auto px-4">
        <section className="mt-10 rounded-3xl bg-white border border-sky-100 p-8 overflow-hidden relative">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-sky-100 rounded-full blur-3xl opacity-70" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-sky-50 rounded-full blur-3xl opacity-70" />
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900">Sepatuku</h1>
              <p className="mt-3 text-gray-600">Toko sepatu modern dengan pilihan terbaik untuk gaya harian maupun olahraga. Warna putih bersih dengan aksen biru langit yang segar.</p>
              <form onSubmit={handleSearch} className="mt-6 grid sm:grid-cols-[1fr,160px,auto] gap-3">
                <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Cari produk, kategori, brand..." className="px-4 py-3 rounded-xl border border-sky-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-300" />
                <select value={category} onChange={(e)=>setCategory(e.target.value)} className="px-4 py-3 rounded-xl border border-sky-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-300">
                  <option value="">Semua Kategori</option>
                  <option>Running</option>
                  <option>Casual</option>
                  <option>Sneakers</option>
                  <option>Outdoor</option>
                  <option>Lifestyle</option>
                </select>
                <button type="submit" className="px-5 py-3 rounded-xl bg-sky-500 text-white font-bold shadow hover:bg-sky-600">Cari</button>
              </form>
            </div>
            <div className="md:justify-self-end">
              <div className="relative">
                <img className="w-full max-w-md rounded-3xl shadow-lg border border-sky-100" src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&q=80&auto=format&fit=crop" alt="Hero Sepatu" />
                <div className="absolute -z-10 -inset-6 bg-sky-100/60 rounded-[2rem] blur-2xl" />
              </div>
            </div>
          </div>
        </section>

        <section id="produk" className="py-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Pilihan Terbaik</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map(p => (
              <ProductCard key={p.id} product={p} onAdd={addToCart} />
            ))}
          </div>
        </section>
      </main>

      <CartDrawer
        open={cartOpen}
        items={cart}
        onClose={() => setCartOpen(false)}
        onChangeQty={changeQty}
        onRemove={removeItem}
        onCheckout={checkout}
        loading={loading}
      />

      {orderResult && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-sky-100">
            <h3 className="text-xl font-bold text-gray-900">Pesanan Dibuat</h3>
            <p className="text-gray-900 font-bold mt-2">Total: Rp {orderResult.total?.toLocaleString('id-ID')}</p>
            {orderResult.qris_qr_url && (
              <div className="mt-4">
                <img src={orderResult.qris_qr_url} alt="QRIS" className="mx-auto rounded-lg border" />
                <p className="text-center text-sm text-gray-500 mt-2">Scan QRIS di atas untuk membayar</p>
              </div>
            )}
            <p className="mt-3 text-gray-700">{orderResult.instructions}</p>
            <button onClick={() => setOrderResult(null)} className="mt-6 w-full py-2.5 rounded-xl bg-sky-500 text-white font-semibold hover:bg-sky-600">Tutup</button>
          </div>
        </div>
      )}

      <footer className="mt-20 border-t border-sky-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-gray-500 flex items-center justify-between">
          <p>© {new Date().getFullYear()} Sepatuku. All rights reserved.</p>
          <p className="font-medium text-sky-600">Dibuat dengan cinta.</p>
        </div>
      </footer>
    </div>
  )
}

export default App

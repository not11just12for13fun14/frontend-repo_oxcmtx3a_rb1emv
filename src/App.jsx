import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import ProductCard from './components/ProductCard'
import CartDrawer from './components/CartDrawer'

function App() {
  const [products, setProducts] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(false)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    fetch(`${baseUrl}/products`).then(r => r.json()).then(setProducts).catch(() => setProducts([]))
  }, [baseUrl])

  const addToCart = (product) => {
    setCart((prev) => {
      const exist = prev.find(p => p.id === product.id)
      if (exist) return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p)
      return [...prev, { id: product.id, title: product.title, price: product.price, image: product.image, quantity: 1 }]
    })
    setCartOpen(true)
  }

  const changeQty = (id, qty) => {
    setCart((prev) => prev.map(p => p.id === id ? { ...p, quantity: qty } : p))
  }

  const removeItem = (id) => setCart((prev) => prev.filter(p => p.id !== id))

  const total = useMemo(() => cart.reduce((a, c) => a + c.price * c.quantity, 0), [cart])

  const checkout = async () => {
    setLoading(true)
    try {
      const payload = {
        items: cart.map(c => ({ product_id: c.id, quantity: c.quantity })),
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

  const [paymentMethod, setPaymentMethod] = useState('COD')
  const [orderResult, setOrderResult] = useState(null)

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
              <div className="mt-6 inline-flex items-center gap-3">
                <a href="#produk" className="px-5 py-3 rounded-xl bg-sky-500 text-white font-bold shadow hover:bg-sky-600">Belanja Sekarang</a>
                <a href="/test" className="px-5 py-3 rounded-xl border border-sky-200 text-sky-600 font-bold bg-white hover:bg-sky-50">Cek Koneksi</a>
              </div>
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

        <section className="mb-20 rounded-3xl bg-white border border-sky-100 p-6">
          <h3 className="text-lg font-bold text-gray-900">Metode Pembayaran</h3>
          <div className="mt-3 grid sm:grid-cols-2 gap-4">
            <label className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer ${paymentMethod==='COD' ? 'border-sky-400 bg-sky-50' : 'border-sky-100'}`}>
              <input type="radio" name="pm" className="accent-sky-500" checked={paymentMethod==='COD'} onChange={() => setPaymentMethod('COD')} />
              <div>
                <p className="font-semibold text-gray-900">Bayar di Tempat (COD)</p>
                <p className="text-sm text-gray-500">Bayar tunai saat pesanan diterima</p>
              </div>
            </label>
            <label className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer ${paymentMethod==='QRIS' ? 'border-sky-400 bg-sky-50' : 'border-sky-100'}`}>
              <input type="radio" name="pm" className="accent-sky-500" checked={paymentMethod==='QRIS'} onChange={() => setPaymentMethod('QRIS')} />
              <div>
                <p className="font-semibold text-gray-900">QRIS</p>
                <p className="text-sm text-gray-500">Bayar cepat via QRIS</p>
              </div>
            </label>
          </div>
          <div className="mt-4 text-sm text-gray-600">Total saat ini: <span className="font-bold text-sky-600">Rp {total.toLocaleString('id-ID')}</span></div>
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
            <p className="text-gray-600 mt-1">Metode: <span className="font-semibold">{orderResult.payment_method}</span></p>
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

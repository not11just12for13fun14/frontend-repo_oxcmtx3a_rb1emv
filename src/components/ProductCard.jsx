import { useState, useEffect } from 'react'

export default function ProductCard({ product, onAdd }) {
  const [size, setSize] = useState('')

  useEffect(() => {
    if (product?.sizes?.length && !size) {
      setSize(String(product.sizes[0].size))
    }
  }, [product, size])

  const handleAdd = () => {
    if (product?.sizes?.length && !size) return
    onAdd(product, size)
  }

  return (
    <div className="group rounded-2xl border border-sky-100 bg-white overflow-hidden shadow-sm hover:shadow-md transition">
      <div className="relative aspect-square overflow-hidden bg-sky-50">
        <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-1">{product.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mt-1">{product.description}</p>
        {product.sizes && product.sizes.length > 0 && (
          <div className="mt-3">
            <label className="text-xs text-gray-600">Pilih ukuran</label>
            <select value={size} onChange={(e) => setSize(e.target.value)} className="mt-1 w-full rounded-lg border border-sky-200 bg-white text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300">
              {product.sizes.map((s) => (
                <option key={s.size} value={s.size} disabled={s.stock <= 0}>
                  {s.size} {s.stock <= 0 ? '(habis)' : `(stok ${s.stock})`}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sky-600 font-bold">Rp {product.price.toLocaleString('id-ID')}</span>
          <button onClick={handleAdd} className="px-3 py-1.5 rounded-full bg-sky-500 text-white text-sm font-semibold hover:bg-sky-600 transition">Tambah</button>
        </div>
      </div>
    </div>
  )
}

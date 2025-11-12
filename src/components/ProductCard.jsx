export default function ProductCard({ product, onAdd }) {
  return (
    <div className="group rounded-2xl border border-sky-100 bg-white overflow-hidden shadow-sm hover:shadow-md transition">
      <div className="relative aspect-square overflow-hidden bg-sky-50">
        <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-1">{product.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mt-1">{product.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sky-600 font-bold">Rp {product.price.toLocaleString('id-ID')}</span>
          <button onClick={() => onAdd(product)} className="px-3 py-1.5 rounded-full bg-sky-500 text-white text-sm font-semibold hover:bg-sky-600 transition">Tambah</button>
        </div>
      </div>
    </div>
  )
}

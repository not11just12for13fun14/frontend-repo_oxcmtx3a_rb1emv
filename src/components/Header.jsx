import { ShoppingCart } from "lucide-react"

export default function Header({ cartCount, onCartClick }) {
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-sky-100">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-200 grid place-items-center">
            <span className="text-sky-500 font-black">S</span>
          </div>
          <div>
            <p className="text-xl font-extrabold tracking-tight text-gray-900">Sepatuku</p>
            <p className="text-xs text-sky-600 font-medium">E-commerce Sepatu</p>
          </div>
        </div>
        <button onClick={onCartClick} className="relative inline-flex items-center gap-2 rounded-full bg-sky-500 text-white px-4 py-2 shadow hover:bg-sky-600 transition">
          <ShoppingCart size={18} />
          <span className="text-sm font-semibold">Keranjang</span>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 text-[10px] bg-white text-sky-600 border border-sky-200 rounded-full w-6 h-6 grid place-items-center font-bold">{cartCount}</span>
          )}
        </button>
      </div>
    </header>
  )
}

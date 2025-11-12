import { X, Trash2 } from "lucide-react"
import { useState } from "react"

export default function CartDrawer({ open, items, onClose, onChangeQty, onRemove, onCheckout, loading }) {
  const total = items.reduce((acc, it) => acc + it.price * it.quantity, 0)
  const [paymentMethod, setPaymentMethod] = useState('COD')

  const handleCheckout = () => {
    onCheckout(paymentMethod)
  }

  return (
    <div className={`fixed inset-0 z-30 ${open ? '' : 'pointer-events-none'}`}>
      <div
        className={`absolute inset-0 bg-black/30 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      <aside className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col
        transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 border-b border-sky-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Keranjang</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-sky-50 text-gray-600"><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-auto divide-y divide-sky-100">
          {items.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Keranjang kosong</div>
          ) : (
            items.map((it) => (
              <div key={`${it.id}-${it.size || 'ns'}`} className="p-4 flex gap-3">
                <img src={it.image} alt={it.title} className="w-16 h-16 rounded-lg object-cover bg-sky-50" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{it.title}</p>
                  {it.size && <p className="text-xs text-gray-500">Ukuran: {String(it.size)}</p>}
                  <p className="text-sky-600 font-bold text-sm">Rp {it.price.toLocaleString('id-ID')}</p>
                  <div className="mt-2 inline-flex items-center rounded-full border border-sky-200">
                    <button onClick={() => onChangeQty(it.id, Math.max(1, it.quantity - 1), it.size)} className="px-3 py-1 text-sky-600">-</button>
                    <span className="px-3 py-1 text-gray-700">{it.quantity}</span>
                    <button onClick={() => onChangeQty(it.id, it.quantity + 1, it.size)} className="px-3 py-1 text-sky-600">+</button>
                  </div>
                </div>
                <button onClick={() => onRemove(it.id, it.size)} className="p-2 h-8 w-8 grid place-items-center rounded-full bg-red-50 text-red-500 hover:bg-red-100"><Trash2 size={14} /></button>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-sky-100 space-y-4">
          <div className="flex items-center justify-between text-gray-700">
            <span>Total</span>
            <span className="text-lg font-extrabold text-sky-600">Rp {total.toLocaleString('id-ID')}</span>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900 mb-2">Metode Pembayaran</p>
            <div className="grid grid-cols-2 gap-2">
              <label className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer ${paymentMethod==='COD' ? 'border-sky-400 bg-sky-50' : 'border-sky-100'}`}>
                <input type="radio" name="pm" className="accent-sky-500" checked={paymentMethod==='COD'} onChange={() => setPaymentMethod('COD')} />
                <span className="text-sm">COD</span>
              </label>
              <label className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer ${paymentMethod==='QRIS' ? 'border-sky-400 bg-sky-50' : 'border-sky-100'}`}>
                <input type="radio" name="pm" className="accent-sky-500" checked={paymentMethod==='QRIS'} onChange={() => setPaymentMethod('QRIS')} />
                <span className="text-sm">QRIS</span>
              </label>
            </div>
          </div>

          <button disabled={items.length === 0 || loading} onClick={handleCheckout} className="w-full py-3 rounded-xl bg-sky-500 text-white font-bold shadow hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Memproses...' : 'Checkout'}
          </button>
        </div>
      </aside>
    </div>
  )
}

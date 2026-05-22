'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiShoppingBag, HiTrash, HiMinus, HiPlus } from 'react-icons/hi';
import { useSelector, useDispatch } from 'react-redux';
import { setCartOpen, removeItem, updateQuantity, clearCart } from '@/store/cartSlice';
import { selectCartTotal, selectCartCount } from '@/store/cartSlice';
import Link from 'next/link';

export default function CartDrawer() {
  const dispatch = useDispatch();
  const isOpen = useSelector(s => s.cart.isOpen);
  const items = useSelector(s => s.cart.items);
  const total = useSelector(selectCartTotal);
  const count = useSelector(selectCartCount);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => dispatch(setCartOpen(false))}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-luxury-dark border-l border-white/10 z-50 shadow-2xl"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <HiShoppingBag size={24} className="text-blue-400" />
                  <h2 className="text-xl font-bold">Cart ({count})</h2>
                </div>
                <button onClick={() => dispatch(setCartOpen(false))}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <HiX size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <HiShoppingBag size={64} className="mb-4 opacity-30" />
                    <p className="text-lg">Your cart is empty</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <motion.div key={item.key} layout
                      className="flex gap-4 p-4 bg-white/5 rounded-2xl"
                    >
                      <div className="w-20 h-20 rounded-xl bg-white/10 overflow-hidden flex-shrink-0">
                        {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium truncate">{item.name}</h4>
                        <p className="text-sm text-blue-400 font-semibold mt-1">₹{item.price?.toLocaleString()}</p>
                        {item.size && <p className="text-xs text-gray-500">Size: {item.size}</p>}
                        {item.color && <p className="text-xs text-gray-500">Color: {item.color}</p>}
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex items-center border border-white/20 rounded-full">
                            <button onClick={() => { if (item.quantity > 1) dispatch(updateQuantity({ key: item.key, quantity: item.quantity - 1 })); }}
                              className="p-1.5 hover:bg-white/10 rounded-l-full transition-colors"
                            ><HiMinus size={14} /></button>
                            <span className="px-3 text-sm font-medium">{item.quantity}</span>
                            <button onClick={() => dispatch(updateQuantity({ key: item.key, quantity: item.quantity + 1 }))}
                              className="p-1.5 hover:bg-white/10 rounded-r-full transition-colors"
                            ><HiPlus size={14} /></button>
                          </div>
                          <button onClick={() => dispatch(removeItem(item.key))}
                            className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
                          ><HiTrash size={16} /></button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {items.length > 0 && (
                <div className="p-6 border-t border-white/10 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="font-semibold">₹{total?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Shipping</span>
                    <span className="font-semibold text-green-400">Free</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-white/10 pt-4">
                    <span>Total</span>
                    <span className="text-gradient">₹{total?.toLocaleString()}</span>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => { dispatch(clearCart()); }}
                      className="flex-1 py-3 text-sm border border-white/20 rounded-full hover:bg-white/10 transition-colors"
                    >Clear</button>
                    <Link href="/checkout" onClick={() => dispatch(setCartOpen(false))} className="flex-[2]">
                      <button className="w-full py-3 text-sm font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full hover:shadow-lg hover:shadow-blue-500/30 transition-all">
                        Checkout
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

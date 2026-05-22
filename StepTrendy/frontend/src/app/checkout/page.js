'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiLockClosed, HiCreditCard, HiQrcode, HiCash, HiCheck, HiX } from 'react-icons/hi';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartTotal, selectCartCount, clearCart } from '@/store/cartSlice';
import { orderAPI, paymentAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';

const paymentMethods = [
  { id: 'razorpay', name: 'Razorpay', icon: HiCreditCard, desc: 'Credit/Debit Cards' },
  { id: 'upi', name: 'UPI Payment', icon: HiQrcode, desc: 'Google Pay, PhonePe, Paytm' },
  { id: 'qr', name: 'QR Code', icon: HiQrcode, desc: 'Scan & Pay' },
  { id: 'cod', name: 'Cash on Delivery', icon: HiCash, desc: 'Pay when delivered' },
];

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [showQR, setShowQR] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [form, setForm] = useState({
    fullName: '', phone: '', street: '', city: '', state: '', zip: '',
  });
  const items = useSelector(s => s.cart.items);
  const total = useSelector(selectCartTotal);
  const count = useSelector(selectCartCount);
  const dispatch = useDispatch();
  const router = useRouter();

  const handlePlaceOrder = async () => {
    setProcessing(true);
    try {
      const orderData = {
        items: items.map(i => ({ productId: i.product, quantity: i.quantity, size: i.size, color: i.color })),
        shippingAddress: form,
        paymentMethod,
      };
      const { data: order } = await orderAPI.create(orderData);

      if (paymentMethod === 'cod') {
        setOrderSuccess(order);
        dispatch(clearCart());
        toast.success('Order placed successfully!');
        setStep(4);
      } else if (paymentMethod === 'upi' || paymentMethod === 'qr') {
        const { data: payment } = await paymentAPI.create({ orderId: order._id, method: paymentMethod });
        setOrderSuccess(order);
        dispatch(clearCart());
        setShowQR(true);
        setStep(4);
      } else {
        setOrderSuccess(order);
        dispatch(clearCart());
        toast.success('Order placed!');
        setStep(4);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-luxury-black pt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-500'}`}>
                {s}
              </div>
              <span className={`text-sm hidden sm:block ${step >= s ? 'text-white' : 'text-gray-500'}`}>
                {s === 1 ? 'Shipping' : s === 2 ? 'Payment' : 'Review'}
              </span>
              {s < 3 && <div className={`w-8 h-0.5 ${step > s ? 'bg-blue-600' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-6 rounded-2xl">
                <h2 className="text-xl font-bold mb-6">Shipping Address</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[{ name: 'fullName', label: 'Full Name', type: 'text' }, { name: 'phone', label: 'Phone', type: 'tel' }, { name: 'street', label: 'Street Address', type: 'text', full: true }, { name: 'city', label: 'City', type: 'text' }, { name: 'state', label: 'State', type: 'text' }, { name: 'zip', label: 'ZIP Code', type: 'text' }].map((field) => (
                    <div key={field.name} className={field.full ? 'sm:col-span-2' : ''}>
                      <input type={field.type} placeholder={field.label}
                        value={form[field.name]} onChange={e => setForm({ ...form, [field.name]: e.target.value })}
                        className="input-field"
                      />
                    </div>
                  ))}
                </div>
                <button onClick={() => setStep(2)} className="btn-primary mt-6 w-full sm:w-auto">Continue to Payment</button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-6 rounded-2xl">
                <h2 className="text-xl font-bold mb-6">Payment Method</h2>
                <div className="space-y-3">
                  {paymentMethods.map((pm) => (
                    <button key={pm.id} onClick={() => setPaymentMethod(pm.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${paymentMethod === pm.id ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:border-white/20'}`}
                    >
                      <pm.icon size={24} className={paymentMethod === pm.id ? 'text-blue-400' : 'text-gray-400'} />
                      <div className="text-left">
                        <p className="font-medium text-sm">{pm.name}</p>
                        <p className="text-xs text-gray-500">{pm.desc}</p>
                      </div>
                      {paymentMethod === pm.id && <HiCheck className="ml-auto text-blue-400" size={20} />}
                    </button>
                  ))}
                </div>
                <div className="flex gap-4 mt-6">
                  <button onClick={() => setStep(1)} className="px-6 py-3 border border-white/20 rounded-full hover:bg-white/5">Back</button>
                  <button onClick={() => setStep(3)} className="btn-primary flex-1">Continue to Review</button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-6 rounded-2xl">
                <h2 className="text-xl font-bold mb-6">Review Order</h2>
                <div className="space-y-4 mb-6">
                  {items.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/10">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity} × ₹{item.price?.toLocaleString()}</p>
                      </div>
                      <p className="font-semibold">₹{(item.price * item.quantity)?.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setStep(2)} className="px-6 py-3 border border-white/20 rounded-full hover:bg-white/5">Back</button>
                  <button onClick={handlePlaceOrder} disabled={processing}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    {processing ? 'Processing...' : (
                      <>
                        <HiLockClosed size={18} />
                        Place Order - ₹{total?.toLocaleString()}
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && orderSuccess && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass p-8 rounded-2xl text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
                  <HiCheck className="text-green-400" size={40} />
                </div>
                <h2 className="text-2xl font-bold mb-2">Order Placed!</h2>
                <p className="text-gray-400 mb-2">Order #{orderSuccess.orderNumber}</p>
                <p className="text-sm text-gray-500 mb-6">We&apos;ll send you a confirmation email shortly.</p>

                {showQR && (paymentMethod === 'upi' || paymentMethod === 'qr') && (
                  <div className="mb-6 p-6 bg-white rounded-2xl inline-block">
                    <QRCodeSVG value={`upi://pay?pa=steptrendy@upi&pn=StepTrendy&am=${total}`} size={200} />
                    <p className="text-black mt-3 text-sm font-medium">Scan to Pay ₹{total?.toLocaleString()}</p>
                  </div>
                )}

                <div className="flex gap-4 justify-center">
                  <button onClick={() => router.push('/account/orders')} className="px-6 py-3 border border-white/20 rounded-full hover:bg-white/5">View Orders</button>
                  <button onClick={() => router.push('/')} className="btn-primary">Continue Shopping</button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass p-6 rounded-2xl sticky top-24">
              <h3 className="font-bold mb-6">Order Summary</h3>
              <div className="space-y-3 mb-6">
                {items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
                      <img src={item.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">×{item.quantity}</p>
                    </div>
                    <p className="text-xs font-medium">₹{(item.price * item.quantity)?.toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2 text-sm border-t border-white/10 pt-4">
                <div className="flex justify-between"><span className="text-gray-400">Subtotal</span><span>₹{total?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Shipping</span><span className="text-green-400">Free</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Tax</span><span>₹{Math.round(total * 0.05)?.toLocaleString()}</span></div>
                <div className="flex justify-between text-lg font-bold border-t border-white/10 pt-4">
                  <span>Total</span>
                  <span className="text-gradient">₹{(total + Math.round(total * 0.05))?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { HiMail, HiPhone, HiLocationMarker, HiHeart } from 'react-icons/hi';
import { FaInstagram, FaFacebook, FaTwitter, FaYoutube, FaPinterest, FaTiktok } from 'react-icons/fa';

const footerSections = [
  {
    title: 'Shop',
    links: ['Men\'s Fashion', 'Women\'s Fashion', 'Sneakers', 'Watches', 'Accessories', 'Streetwear', 'Sale'],
  },
  {
    title: 'Support',
    links: ['Contact Us', 'FAQ', 'Shipping Info', 'Returns', 'Size Guide', 'Track Order', 'Privacy Policy'],
  },
  {
    title: 'Company',
    links: ['About Us', 'Careers', 'Press', 'Affiliates', 'Influencers', 'Blog', 'Sustainability'],
  },
];

export default function Footer() {
  return (
    <footer className="relative bg-luxury-black text-white overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-[128px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <span className="text-3xl font-bold font-display">
                <span className="text-gradient">STEP</span>
                <span className="text-white">TRENDY</span>
              </span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
              Discover the future of fashion at StepTrendy. Premium quality products with AI-powered recommendations tailored just for you.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400">
                <HiLocationMarker className="text-blue-400 flex-shrink-0" />
                <span className="text-sm">Mumbai, Maharashtra, India</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <HiMail className="text-blue-400 flex-shrink-0" />
                <span className="text-sm">support@steptrendy.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <HiPhone className="text-blue-400 flex-shrink-0" />
                <span className="text-sm">+91 1800-STEPTRENDY</span>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              {[FaInstagram, FaFacebook, FaTwitter, FaYoutube, FaPinterest, FaTiktok].map((Icon, i) => (
                <motion.a key={i} href="#" whileHover={{ scale: 1.2, y: -3 }}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-600/30 transition-colors"
                >
                  <Icon className="text-gray-400 hover:text-white transition-colors" />
                </motion.a>
              ))}
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-6">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-sm text-gray-500 hover:text-blue-400 transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 flex items-center gap-1">
            Made with <HiHeart className="text-red-500" /> by StepTrendy &copy; {new Date().getFullYear()}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Cookie Policy</span>
          </div>
          <div className="flex gap-2">
            {['Visa', 'Mastercard', 'UPI', 'Razorpay', 'PayPal'].map((p) => (
              <span key={p} className="px-3 py-1 text-xs bg-white/5 rounded-full text-gray-400">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

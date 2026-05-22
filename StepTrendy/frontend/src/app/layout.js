import { Providers } from './providers';
import '../styles/globals.css';

export const metadata = {
  title: 'StepTrendy - Premium AI-Powered Fashion Marketplace',
  description: 'Discover the future of fashion at StepTrendy. Premium quality products with AI-powered recommendations. Shop sneakers, watches, streetwear, and more.',
  keywords: 'fashion, ecommerce, sneakers, streetwear, luxury, ai fashion, online shopping',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0a0a0a" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap" />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

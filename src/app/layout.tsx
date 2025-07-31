import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Exo_2 } from 'next/font/google';

export const metadata: Metadata = {
  title: 'CityFit',
  description: 'The best city-wear, styled for you.',
};

const exo2 = Exo_2({
  subsets: ['latin'],
  variable: '--font-exo2',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
       <body className={`${exo2.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}


export type Product = {
  id: string;
  name: string;
  brand: string;
  images: string[];
  description: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice?: number;
  sizes: string[];
  colors: { name: string; hex: string }[];
  hint?: string;
  category: string;
};

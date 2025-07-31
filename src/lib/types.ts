export type Product = {
  id: string;
  name: string;
  brand: string;
  images: { src: string; alt: string, hint: string }[];
  description: string;
  rating: number;
  reviews: number;
  price: number;
  sizes: string[];
  colors: { name: string; hex: string }[];
};

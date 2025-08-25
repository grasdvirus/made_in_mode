
export type Color = {
  name: string;
  hex: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  images: string[];
  sizes: string[];
  colors: Color[];
  hint?: string;
};

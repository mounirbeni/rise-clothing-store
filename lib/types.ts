export type CartProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  color: string;
};

export type CartLine = CartProduct & {
  size: string;
  quantity: number;
};

export type WishlistProduct = CartProduct & {
  compareAt?: number | null;
};

export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  category: string;
  collection: string;
  color: string;
  price: number;
  compareAt: number | null;
  images: { url: string; alt: string }[];
  variants: { size: string; stock: number }[];
  avgRating: number;
  reviewCount: number;
};

export type ProductGalleryImage = { url: string; alt: string };


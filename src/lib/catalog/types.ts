export type Category = {
  id: string;
  name: string;
};

export type Product = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  priceCents: number;
  compareAtCents?: number;
  image: string;
};

export type CategoryWithProducts = Category & { products: Product[] };

export type ServiceType = "delivery" | "pickup" | "dineIn";

export type StoreInfo = {
  name: string;
  tagline: string;
  whatsapp: string;
  address: string;
  mapsUrl: string;
  socials: { instagram: string; facebook: string; tiktok: string };
  services: {
    delivery: { enabled: boolean; minimumOrderCents: number; feeCents: number };
    pickup: { enabled: boolean };
    dineIn: { enabled: boolean };
  };
};

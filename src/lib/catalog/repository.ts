import catalog from "@/data/catalog.json";
import store from "@/data/store.json";
import type { Category, CategoryWithProducts, Product, StoreInfo } from "./types";

const categories: Category[] = catalog.categories;
const products: Product[] = catalog.products;

export function getStoreInfo(): StoreInfo {
  return store;
}

export function getProducts(): Product[] {
  return products;
}

export function getCatalog(): CategoryWithProducts[] {
  return categories
    .map((category) => ({
      ...category,
      products: products.filter((product) => product.categoryId === category.id),
    }))
    .filter((category) => category.products.length > 0);
}

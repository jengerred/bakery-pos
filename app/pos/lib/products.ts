export type Product = {
  id: number;
  name: string;
  price: number;
};

export const products: Product[] = [
  { id: 1, name: "Chocolate Chip Cookies", price: 2.5 },
  { id: 2, name: "Brownies", price: 3.0 },
  { id: 3, name: "Peanut Butter Cookies", price: 2.75 },
];

/* -------------------------------------------------------
   🧾 Product Type
   Represents a single sellable item in the POS.
------------------------------------------------------- */
export type Product = {
  id: number;     // Unique identifier for the product
  name: string;   // Display name shown in the UI
  price: number;  // Unit price in dollars
  taxable: boolean; // Michigan tax status (Exempt vs. Taxable)
};

/* -------------------------------------------------------
   🧺 Available Products
   Static catalog representing the 6 distinct items 
   available for sale (Singles and Dozens).

   TAXATION LOGIC (Grand Rapids, MI):
   - Bakery items are 0% tax (taxable: false).
   - Prepared drinks would be 6% tax (taxable: true).
------------------------------------------------------- */
export const products: Product[] = [
  // --- Chocolate Chip Cookies ---
  { 
    id: 101, 
    name: "Chocolate Chip Cookies - Single", 
    price: 2.00, 
    taxable: false 
  },
  { 
    id: 102, 
    name: "Chocolate Chip Cookies - Dozen", 
    price: 20.00, 
    taxable: false 
  },

  // --- Brownies ---
  { 
    id: 201, 
    name: "Brownies - Single", 
    price: 3.00, 
    taxable: false 
  },
  { 
    id: 202, 
    name: "Brownies - Dozen", 
    price: 30.00, 
    taxable: false 
  },

  // --- Peanut Butter Cookies ---
  { 
    id: 301, 
    name: "Peanut Butter Cookies - Single", 
    price: 2.00, 
    taxable: false 
  },
  { 
    id: 302, 
    name: "Peanut Butter Cookies - Dozen", 
    price: 20.00, 
    taxable: false 
  },
];
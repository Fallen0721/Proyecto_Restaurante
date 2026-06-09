export interface Dish {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  price: number;
  category: 'entrada' | 'principal' | 'postre' | 'bebida';
  image: string;
  isSignature?: boolean;
}

export interface MenuCategory {
  id: string;
  label: string;
  value: Dish['category'];
}

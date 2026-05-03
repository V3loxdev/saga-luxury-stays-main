export interface SnackDrink {
  id: string;
  name: string;
  type: 'Snack' | 'Drink';
  price: number;
  desc: string;
  image: string;
  available: boolean;
}

export const snacksDrinks: SnackDrink[] = [
  {
    id: 'chips-spicy',
    name: 'Spicy Corn Chips',
    type: 'Snack',
    price: 50,
    desc: 'Crispy corn chips with fiery chili flavor',
    image: '/foods and drinks/Spicy Corn Chips.jpg',
    available: true
  },
  {
    id: 'chips-bbq',
    name: 'BBQ Potato Chips',
    type: 'Snack',
    price: 60,
    desc: 'Classic potato chips with smoky BBQ taste',
    image: '/foods and drinks/BBQ Potato Chips.jpg',
    available: true
  },
  {
    id: 'choco',
    name: 'Chocolate Bar',
    type: 'Snack',
    price: 45,
    desc: 'Creamy milk chocolate treat',
    image: '/foods and drinks/Chocolate Bar.jpg',
    available: true
  },
  {
    id: 'biscuit',
    name: 'Cream Biscuits',
    type: 'Snack',
    price: 40,
    desc: 'Buttery biscuits filled with sweet cream',
    image: '/foods and drinks/Cream Biscuits.jpg',
    available: true
  },
  {
    id: 'cola',
    name: 'Cola (355ml)',
    type: 'Drink',
    price: 40,
    desc: 'Refreshing classic cola',
    image: '/foods and drinks/Cola (355ml).jpg',
    available: true
  },
  {
    id: 'orange',
    name: 'Orange Juice',
    type: 'Drink',
    price: 55,
    desc: 'Freshly squeezed orange juice',
    image: '/foods and drinks/Orange Juice.jpg',
    available: true
  },
  {
    id: 'iced-tea',
    name: 'Iced Tea',
    type: 'Drink',
    price: 45,
    desc: 'Chilled lemon iced tea',
    image: '/foods and drinks/Iced Tea.jpg',
    available: true
  },
  {
    id: 'water',
    name: 'Mineral Water (500ml)',
    type: 'Drink',
    price: 30,
    desc: 'Pure mineral water',
    image: '/foods and drinks/Mineral Water (500ml).jpg',
    available: true
  }
];


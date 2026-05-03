export interface Room {
  name: string;
  type: 'Regular' | 'Premium';
  status: 'Available' | 'Occupied';
  floor: string;
  occupiedAt?: number;
  durationMs?: number;
}

export const rooms: Room[] = [
  { name: "Regular Room 101", type: "Regular", status: "Available", floor: "1st" },
  { name: "Regular Room 102", type: "Regular", status: "Available", floor: "1st" },
  { name: "Regular Room 103", type: "Regular", status: "Available", floor: "1st" },
  { name: "Regular Room 201", type: "Regular", status: "Available", floor: "2nd" },
  { name: "Regular Room 202", type: "Regular", status: "Available", floor: "2nd" },
  { name: "Premium Suite 301", type: "Premium", status: "Available", floor: "3rd" },
  { name: "Premium Suite 302", type: "Premium", status: "Available", floor: "3rd" },
  { name: "Premium Suite 303", type: "Premium", status: "Available", floor: "3rd" },
  { name: "Premium Suite 304", type: "Premium", status: "Available", floor: "3rd" },
  { name: "Premium Suite 305", type: "Premium", status: "Available", floor: "3rd" },
];



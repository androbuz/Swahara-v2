export interface User {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  initials: string;
}

export interface Agreement {
  id: string;
  title: string;
  description: string;
  otherPartyId: string;
  createdDate: string;
  status: "active" | "pending";
  amount?: string;
  dueDate?: string;
  createdBy: string;
}

export const currentUser: User = {
  id: "user-1",
  name: "Mukasa James",
  phone: "+256 772 345678",
  avatar: "https://images.unsplash.com/photo-1622626426572-c268eb006092?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHBvcnRyYWl0JTIwbWFufGVufDF8fHx8MTc2MTU5Njk2M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  initials: "MJ"
};

export const users: User[] = [
  {
    id: "user-2",
    name: "Nakato Grace",
    phone: "+256 704 123456",
    avatar: "https://images.unsplash.com/photo-1652471949169-9c587e8898cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHdvbWFufGVufDF8fHx8MTc2MTUwMDAwOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    initials: "NG"
  },
  {
    id: "user-3",
    name: "Okello Patrick",
    phone: "+256 782 987654",
    avatar: "https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMG1hbnxlbnwxfHx8fDE3NjE1NDYyMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    initials: "OP"
  },
  {
    id: "user-4",
    name: "Nambi Catherine",
    phone: "+256 701 456789",
    avatar: "https://images.unsplash.com/photo-1689635665521-264268212250?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHBvcnRyYWl0JTIwd29tYW58ZW58MXx8fHwxNzYxNDg1NTU4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    initials: "NC"
  },
  {
    id: "user-5",
    name: "Wasswa David",
    phone: "+256 777 234567",
    avatar: "https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjE1MjMzNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    initials: "WD"
  },
  {
    id: "user-6",
    name: "Auma Rose",
    phone: "+256 703 876543",
    avatar: "https://images.unsplash.com/photo-1581065178047-8ee15951ede6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MTU4Njk3Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    initials: "AR"
  }
];

export const initialAgreements: Agreement[] = [
  {
    id: "agr-1",
    title: "Boda Boda Purchase",
    description: "Agreement to purchase a Bajaj Boxer motorcycle in excellent condition. Payment to be made in three installments through Mobile Money.",
    otherPartyId: "user-2",
    createdDate: "2025-10-15",
    status: "active",
    amount: "UGX 3,500,000",
    dueDate: "2025-11-15",
    createdBy: "user-1"
  },
  {
    id: "agr-2",
    title: "Shop Rental Agreement",
    description: "Renting shop space in Nakawa Market for 6 months. Includes security and monthly cleaning of common areas.",
    otherPartyId: "user-3",
    createdDate: "2025-10-10",
    status: "active",
    amount: "UGX 500,000/month",
    dueDate: "2026-01-10",
    createdBy: "user-1"
  },
  {
    id: "agr-3",
    title: "Website Design Services",
    description: "Create a complete website for retail business including mobile design, payment integration, and 3 months support.",
    otherPartyId: "user-4",
    createdDate: "2025-10-20",
    status: "active",
    amount: "UGX 2,000,000",
    dueDate: "2025-11-30",
    createdBy: "user-1"
  },
  {
    id: "agr-4",
    title: "Matooke Supply Agreement",
    description: "Weekly supply of fresh matooke from Masaka. Delivery every Monday morning to Kabalagala. Minimum 5 bunches per delivery.",
    otherPartyId: "user-5",
    createdDate: "2025-10-22",
    status: "pending",
    amount: "UGX 150,000/week",
    createdBy: "user-5"
  },
  {
    id: "agr-5",
    title: "Event Photography",
    description: "Professional photography for wedding introduction ceremony. Includes full day coverage, 200 edited photos, and photo album.",
    otherPartyId: "user-6",
    createdDate: "2025-10-24",
    status: "pending",
    amount: "UGX 800,000",
    createdBy: "user-6"
  },
  {
    id: "agr-6",
    title: "Posho Mill Equipment Sale",
    description: "Selling posho mill grinding machine. 2 years old, good working condition. Includes maintenance manual. Buyer arranges transport.",
    otherPartyId: "user-2",
    createdDate: "2025-10-25",
    status: "pending",
    amount: "UGX 1,200,000",
    createdBy: "user-2"
  }
];

export function getUserById(id: string): User | undefined {
  if (id === currentUser.id) return currentUser;
  return users.find(user => user.id === id);
}

export function getAgreementsByUserId(userId: string, agreements: Agreement[]): Agreement[] {
  return agreements.filter(agr => agr.otherPartyId === userId);
}

export function getMyActiveAgreements(agreements: Agreement[]): Agreement[] {
  return agreements.filter(agr => agr.status === "active" && agr.createdBy === currentUser.id);
}

export function getPendingAgreements(agreements: Agreement[]): Agreement[] {
  return agreements.filter(agr => agr.status === "pending" && agr.createdBy !== currentUser.id);
}

export type Title = {
  id: string;
  name: string;
  minBalance: number;
  color: string; // Tailwind color class for badge
};

export const TITLES: Title[] = [
  { id: 't1', name: '🌱 Penabung Pemula', minBalance: 0, color: 'bg-joy-green text-white' },
  { id: 't2', name: '🐝 Penabung Rajin', minBalance: 100000, color: 'bg-joy-blue text-white' },
  { id: 't3', name: '🚀 Penabung Cerdas', minBalance: 500000, color: 'bg-joy-purple text-white' },
  { id: 't4', name: '👑 Sultan Cilik', minBalance: 1000000, color: 'bg-joy-yellow text-white' },
];

export type User = {
  id: string;
  name: string;
  level: number;
  balance: number; // in IDR
  stars: number; // Current XP/Progress to next level
  maxStars: number; // XP needed for next level
  puzzlePieces: number; // Currency for store
  avatarId: string;
  unlockedAvatars: string[];
};

// INITIAL DUMMY USER
export const MOCK_USER: User = {
  id: 'u1',
  name: 'Jojo',
  level: 2,
  balance: 850000,
  stars: 3,
  maxStars: 5,
  puzzlePieces: 12,
  avatarId: 'cat_warrior',
  unlockedAvatars: ['cat_warrior', 'dog_detective'],
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const getCurrentTitle = (balance: number) => {
  // Find the highest title where balance >= minBalance
  const sortedTitles = [...TITLES].sort((a, b) => b.minBalance - a.minBalance);
  return sortedTitles.find(t => balance >= t.minBalance) || TITLES[TITLES.length-1];
};

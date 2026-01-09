export interface User {
  id?: number;           // ID dari Database
  cardUid?: string;      // UID Kartu RFID
  name: string;
  balance: number;
  xp: number; 
  level: number; 
  puzzlePieces: number;
  avatarId: string;      // Legacy (bisa dihapus nanti klo currentAvatar stabil)
  currentAvatar?: string; // Avatar aktif dari DB
  unlockedAvatars: string[];
}

export const MOCK_USER: User = {
  name: "Jojo",
  balance: 75000, 
  xp: 150, 
  level: 1, // Will be calculated dynamically usually
  puzzlePieces: 5,
  avatarId: "cat",
  unlockedAvatars: ["cat", "dog"],
};

// Evolution Config
export const EVOLUTION_STAGES = [
    { name: 'Baby', minBalance: 0, suffix: '_baby' },
    { name: 'Teen', minBalance: 100000, suffix: '_teen' },
    { name: 'King', minBalance: 300000, suffix: '_king' }
];

// Helper to get current evolution stage seed for DiceBear
export const getAvatarSeed = (avatarId: string, balance: number) => {
    // Stage logic: Reverse check to find largest qualifier
    const stage = [...EVOLUTION_STAGES].reverse().find(s => balance >= s.minBalance) || EVOLUTION_STAGES[0];
    
    // DiceBear Adventurer seeds are text-based. 
    // We combine avatarId + suffix to create unique "Evolved" look.
    // e.g. "cat" -> "cat_baby", "cat_teen"
    return `${avatarId}${stage.suffix}`; 
};

export const getEvolutionName = (balance: number) => {
    const stage = [...EVOLUTION_STAGES].reverse().find(s => balance >= s.minBalance) || EVOLUTION_STAGES[0];
    return stage.name;
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export const TITLES = [
  { name: 'Pemula', minBalance: 0 },
  { name: 'Penabung Cilik', minBalance: 50000 },
  { name: 'Juragan Muda', minBalance: 200000 },
  { name: 'Sultan', minBalance: 1000000 },
];

export const getCurrentTitle = (balance: number) => {
    return [...TITLES].reverse().find(t => balance >= t.minBalance) || TITLES[0];
};

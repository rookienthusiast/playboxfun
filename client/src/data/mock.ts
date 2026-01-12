
export interface User {
  id: number;
  name: string;
  balance: number;
  xp: number;
  puzzlePieces: number;
  equippedBase: string;
  equippedHair: string;
  equippedHairColor?: string;
  equippedClothing: string;
  equippedAccessory: string;
  inventory: string[]; 
  claimedBoxes?: string;
  avatarId?: string;
  currentAvatar?: string;
  unlockedAvatars?: string[];
  level?: number;
  cardUid?: string;
}

export const MOCK_USER: User = {
  id: 1,
  name: "Jojo",
  balance: 0,
  xp: 0,
  puzzlePieces: 0,
  equippedBase: "base",
  equippedHair: "shortHair",
  equippedClothing: "shirtCrewNeck",
  equippedAccessory: "none",
  inventory: []
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export const getCustomAvatarUrl = (user: User) => {
    let url = "https://api.dicebear.com/7.x/avataaars/svg";
    
    const seed = user.equippedBase || user.name || 'base';
    url += `?seed=${encodeURIComponent(seed)}`;

    const top = user.equippedHair && user.equippedHair !== 'none' ? user.equippedHair : 'shortFlat'; 
    url += `&top=${top}`;
    url += `&topProbability=100`;

    const hairColor = user.equippedHairColor || '2c1b18';
    url += `&hairColor=${hairColor}`;

    const cloth = user.equippedClothing && user.equippedClothing !== 'none' ? user.equippedClothing : 'shirtCrewNeck';
    url += `&clothing=${cloth}`;

    const acc = user.equippedAccessory;
    if (acc && acc !== 'none') {
        url += `&accessories=${acc}`;
        url += `&accessoriesProbability=100`;
        url += `&accessoriesColor=262e33`; 
    } else {
        url += `&accessoriesProbability=0`;
    }

    url += `&clothesColor=3c4f5c`;
    url += `&clothingGraphic=skullOutline`;

    url += `&eyebrows=defaultNatural`;
    url += `&eyes=default`;
    url += `&mouth=smile`;

    url += `&facialHairProbability=0`;

    url += `&skinColor=edb98a`;

    url += `&backgroundColor=b6e3f4`;
    
    url += `&t=${Date.now()}`;

    return url;
};

export const EVOLUTION_STAGES = [
    { name: 'Baby', minBalance: 0, suffix: '_baby' },
    { name: 'Teen', minBalance: 100000, suffix: '_teen' },
    { name: 'King', minBalance: 300000, suffix: '_king' }
];

export const getEvolutionName = (balance: number) => {
    const stage = [...EVOLUTION_STAGES].reverse().find(s => balance >= s.minBalance) || EVOLUTION_STAGES[0];
    return stage.name;
}

export const TITLES = [
  { name: 'Pemula', minBalance: 0 },
  { name: 'Penabung Cilik', minBalance: 50000 },
  { name: 'Juragan Muda', minBalance: 200000 },
  { name: 'Sultan', minBalance: 1000000 },
];

export const getCurrentTitle = (balance: number) => {
    return [...TITLES].reverse().find(t => balance >= t.minBalance) || TITLES[0];
};

export const getAvatarSeed = (avatarId: string | undefined, balance: number) => {
    return `${avatarId || 'cat'}_legacy`; 
};

export const calculateLevel = (xp: number) => {
    return Math.floor(xp / 100) + 1;
};

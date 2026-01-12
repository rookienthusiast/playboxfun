
export interface User {
  id: number;
  name: string;
  balance: number;
  // Gamification
  xp: number;
  puzzlePieces: number;
  
  // Custom Avatar Fields
  equippedBase: string;
  equippedHair: string;
  equippedHairColor?: string; // Hex code
  equippedClothing: string;
  equippedAccessory: string;
  
  inventory: string[]; 
  claimedBoxes?: string;
  
  // Legacy (Optional)
  avatarId?: string;
  currentAvatar?: string;
  unlockedAvatars?: string[];
  level?: number;
  cardUid?: string; // Add cardUid for sync logic
}

export const MOCK_USER: User = {
  id: 1,
  name: "Jojo",
  balance: 0,
  xp: 0,
  puzzlePieces: 0,
  equippedBase: "base",
  equippedHair: "shortHair", // Ganti short01 jadi shortHair
  equippedClothing: "shirtCrewNeck", // Ganti shirt01 jadi shirtCrewNeck
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

// NEW: Generates URL based on equipped items (FINAL WORKING VERSION)
// NEW: Generates URL based on equipped items (FIXED FORMAT MATCHING USER SUCCESS)
// User Proven URL: ...&top=bigHair (NO BRACKETS)
export const getCustomAvatarUrl = (user: User) => {
    let url = "https://api.dicebear.com/7.x/avataaars/svg";
    
    // 1. Seed
    const seed = user.equippedBase || user.name || 'base';
    url += `?seed=${encodeURIComponent(seed)}`;

    // 2. Top (Hair/Hat)
    const top = user.equippedHair && user.equippedHair !== 'none' ? user.equippedHair : 'shortFlat'; 
    url += `&top=${top}`;
    url += `&topProbability=100`;

    // 2.1 Hair Color (NEW)
    const hairColor = user.equippedHairColor || '2c1b18'; // Default Hitam
    url += `&hairColor=${hairColor}`; // Wajib 100 biar rambut/topi selalu muncul

    // 3. Clothing
    const cloth = user.equippedClothing && user.equippedClothing !== 'none' ? user.equippedClothing : 'shirtCrewNeck';
    url += `&clothing=${cloth}`;

    // 4. Accessories
    const acc = user.equippedAccessory;
    if (acc && acc !== 'none') {
        url += `&accessories=${acc}`;
        url += `&accessoriesProbability=100`;
        url += `&accessoriesColor=262e33`; 
    } else {
        url += `&accessoriesProbability=0`;
    }

    // 5. Clothes Attributes
    url += `&clothesColor=3c4f5c`; // Navy Blue
    url += `&clothingGraphic=skullOutline`;

    // 6. Facial Features
    url += `&eyebrows=defaultNatural`;
    url += `&eyes=default`;
    url += `&mouth=smile`; // Pilihan: smile, twinkle, serious, tongue

    // 7. Facial Hair (Jenggot) - Default 0 (Bersih)
    url += `&facialHairProbability=0`;

    // 8. Skin Color (Hex Valid dari Screenshot)
    url += `&skinColor=edb98a`;

    // 9. Background
    url += `&backgroundColor=b6e3f4`;
    
    // 10. Cache Buster
    url += `&t=${Date.now()}`;

    return url;
};

// --- RESTORED HELPERS ---

// Evolution Config
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

// Legacy support (biar gak error kalo ada yg manggil)
export const getAvatarSeed = (avatarId: string | undefined, balance: number) => {
    return `${avatarId || 'cat'}_legacy`; 
};

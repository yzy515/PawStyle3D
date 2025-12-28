export enum Step {
  PET_INFO = 1,
  STYLE_FABRIC = 2,
  PATTERN_UPLOAD = 3,
  MAIN_PREVIEW = 4,
  SHOWCASE = 5,
  ACCESSORY_DESIGN = 6,
  PAYMENT = 7
}

export interface PetData {
  breed: string;
  weight: string;
  chestSize: string;
  neckSize: string;
  length: string;
  petName?: string;
}

export interface ClothingConfig {
  style: string;
  fabric: string;
  color: string;
}

export interface ShowcaseImages {
  main?: string;
  side?: string;
  back?: string;
  detail?: string;
  accessory?: string;
}

export interface CustomizationState {
  step: Step;
  petData: PetData;
  clothingConfig: ClothingConfig;
  patternBase64?: string;
  humanClothingBase64?: string;
  showcase: ShowcaseImages;
  isGenerating: boolean;
  isGeneratingAccessory?: boolean;
  error?: string;
}

export const FABRICS = [
  { id: 'cotton', name: 'Premium Cotton', desc: 'Breathable and soft', icon: '☁️' },
  { id: 'wool', name: 'Organic Wool', desc: 'Warm and cozy', icon: '🧶' },
  { id: 'silk', name: 'Luxe Silk', desc: 'Smooth and elegant', icon: '✨' },
  { id: 'polyester', name: 'Durable Poly', desc: 'Athletic and tough', icon: '🛡️' },
  { id: 'raincoat', name: 'Raincoat', desc: 'Waterproof & light', icon: '☂️' }
];

export const STYLES = [
  { id: 'hoodie', name: 'Urban Hoodie', prompt: 'a stylish streetwear hoodie' },
  { id: 'tshirt', name: 'Classic Tee', prompt: 'a simple snug-fit t-shirt' },
  { id: 'sweater', name: 'Knitted Sweater', prompt: 'a chunky hand-knitted sweater' },
  { id: 'pajamas', name: 'Sleepy Jams', prompt: 'full-body cozy pajamas' }
];

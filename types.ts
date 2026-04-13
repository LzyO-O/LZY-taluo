export enum ArcanaType {
  MAJOR = 'Major',
  MINOR = 'Minor'
}

export interface TarotCard {
  id: string;
  name: string;
  image: string; // URL
  meaningUpright: string;
  meaningReversed: string;
  arcana: ArcanaType;
  suit?: string;
  number?: number;
}

export interface SpreadPosition {
  id: number;
  name: string;
  description: string;
  x: number; // Relative coordinate for layout (0-100)
  y: number; // Relative coordinate for layout (0-100)
  rotation?: number;
}

export interface Spread {
  id: string;
  name: string;
  description: string;
  positions: SpreadPosition[];
  category?: string[]; // Tag for filtering
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  allowedSpreadIds: string[]; // Explicitly map which spreads are available
}

export interface DrawnCard {
  card: TarotCard;
  isReversed: boolean;
  positionId: number;
}

export enum AppPhase {
  INTRO = 'INTRO',
  SELECT_TOPIC = 'SELECT_TOPIC',
  SELECT_SPREAD = 'SELECT_SPREAD',
  SHUFFLE = 'SHUFFLE',
  DRAW = 'DRAW',
  REVEAL = 'REVEAL',
  READING = 'READING'
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  aspectRatio: string;
  timestamp: number;
}

export interface AspectRatioOption {
  label: string;
  ratio: string; // Internal value for API "1:1", "16:9" etc
  displayRatio: string; // Display text "16:9"
  iconClass: string; // For CSS logic to draw the box
}

export interface StyleOption {
  id: string;
  name: string;
  image: string;
  description: string;
}

export enum AppTab {
  Feed = 'feed',
  Imagine = 'imagine',
  Profile = 'profile',
}

export interface ModelOption {
  id: string;
  name: string;
  version: string;
  image: string;
  description: string;
}

export interface PoseOption {
  id: string;
  label: string;
  prompt: string;
  icon: string; // Emoji or icon name
}

export interface CharacterAttributes {
  gender: string;
  skinTone: string; // Added
  hairColor: string;
  hairStyle: string;
  eyeColor: string;
  expression: string; // Added
  outfit: string;
  accessory: string;
}

export interface SavedCharacter {
  id: string;
  name: string;
  attributes: CharacterAttributes;
}

export interface StyleCoordinates {
  x: number; // -100 to 100 (Cute <-> Cool/Sharp)
  y: number; // -100 to 100 (Simple <-> Detailed)
}

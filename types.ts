
export interface LocationData {
  city: string;
  offices: Office[];
  hotels: Hotel[];
  restaurants: Restaurant[];
  transport: TransportInfo;
  airport: AirportInfo;
  weather: WeatherInfo;
  tips: string[];
  culture: CulturalInsights;
}

export interface CulturalInsights {
  etiquette: string;
  businessNorms: string;
  diningCustoms: string;
  usefulPhrase: {
    phrase: string;
    meaning: string;
    pronunciation: string;
  };
}

export interface Office {
  name: string;
  address: string;
  hours: string;
  contacts: string;
  mapLink: string;
}

export interface Hotel {
  name: string;
  rating: string;
  category: 'Budget' | 'Standard' | 'Premium';
  description: string;
  mapLink: string;
}

export interface Restaurant {
  name: string;
  cuisine: string;
  description: string;
  mapLink: string;
}

export interface TransportInfo {
  guidance: string;
  ticketInfo: string;
  apps: string[];
  keyLines: string[];
}

export interface AirportInfo {
  name: string;
  bestRoute: string;
  approxTime: string;
}

export interface WeatherInfo {
  currentTemp: number;
  condition: string;
  forecast: { day: string; temp: number; condition: string }[];
}

export enum AppTab {
  TODAY = 'today',
  TRAVEL = 'travel',
  EMERGENCY = 'emergency',
  INFO = 'info'
}

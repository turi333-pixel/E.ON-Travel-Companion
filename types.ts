
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

export interface FlightStatusData {
  flightNumber: string;
  status: 'On Time' | 'Delayed' | 'Boarding' | 'Departed' | 'Landed' | 'Cancelled' | 'Unknown';
  departure: {
    airport: string;
    scheduled: string;
    estimated?: string;
    actual?: string;
    terminal?: string;
    gate?: string;
  };
  arrival: {
    airport: string;
    scheduled: string;
    estimated?: string;
    actual?: string;
    terminal?: string;
    gate?: string;
  };
  lastUpdated: string;
  sources: { title: string; uri: string }[];
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

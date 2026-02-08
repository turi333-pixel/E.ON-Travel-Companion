
import { GoogleGenAI } from "@google/genai";
import { LocationData, FlightStatusData } from "../types";

export const fetchLocationInsights = async (
  location: string, 
  coords?: { latitude: number; longitude: number }
): Promise<LocationData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-2.5-flash';
  
  const prompt = `Analyze the business travel context for a location. 
    ${coords ? `The user is currently at coordinates: ${coords.latitude}, ${coords.longitude}.` : `The location is: ${location}.`}
    
    Provide information suitable for an E.ON business traveler. 
    Focus on helping the traveler navigate local culture and professional etiquette.
    
    JSON Structure:
    {
      "city": "string",
      "offices": [{"name": "string", "address": "string", "hours": "string", "contacts": "string", "mapLink": "string"}],
      "hotels": [{"name": "string", "rating": "string", "category": "string", "description": "string", "mapLink": "string"}],
      "restaurants": [{"name": "string", "cuisine": "string", "description": "string", "mapLink": "string"}],
      "transport": {"guidance": "string", "ticketInfo": "string", "apps": ["string"], "keyLines": ["string"]},
      "airport": {"name": "string", "bestRoute": "string", "approxTime": "string"},
      "weather": {"currentTemp": number, "condition": "string", "forecast": [{"day": "string", "temp": number, "condition": "string"}]},
      "culture": {"etiquette": "string", "businessNorms": "string", "diningCustoms": "string", "usefulPhrase": {"phrase": "string", "meaning": "string", "pronunciation": "string"}},
      "tips": ["string"]
    }`;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      tools: [{ googleMaps: {} }, { googleSearch: {} }],
      toolConfig: coords ? {
        retrievalConfig: {
          latLng: {
            latitude: coords.latitude,
            longitude: coords.longitude
          }
        }
      } : undefined,
    },
  });

  try {
    let rawText = response.text.trim();
    if (rawText.startsWith("```")) {
      rawText = rawText.replace(/^```json\n?/, "").replace(/\n?```$/, "");
    }
    const parsed = JSON.parse(rawText) as LocationData;
    return parsed;
  } catch (e) {
    throw new Error("Could not retrieve precise location data.");
  }
};

export const fetchFlightStatus = async (flightNumber: string, date: string): Promise<FlightStatusData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-flash-preview';

  const prompt = `Search for the live flight status of flight "${flightNumber}" on date "${date}". 
    Use queries such as "${flightNumber} flight status" and "${flightNumber} departure arrival status".
    
    Extract the following details and return as a raw JSON object:
    {
      "flightNumber": "${flightNumber}",
      "status": "On Time | Delayed | Boarding | Departed | Landed | Cancelled | Unknown",
      "departure": {
        "airport": "Name/Code",
        "scheduled": "HH:MM",
        "estimated": "HH:MM (optional)",
        "actual": "HH:MM (optional)",
        "terminal": "string (optional)",
        "gate": "string (optional)"
      },
      "arrival": {
        "airport": "Name/Code",
        "scheduled": "HH:MM",
        "estimated": "HH:MM (optional)",
        "actual": "HH:MM (optional)",
        "terminal": "string (optional)",
        "gate": "string (optional)"
      }
    }
    If the status is unclear, ask for a more specific flight number. Return ONLY the JSON object.`;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  try {
    let rawText = response.text.trim();
    if (rawText.startsWith("```")) {
      rawText = rawText.replace(/^```json\n?/, "").replace(/\n?```$/, "");
    }
    const parsed = JSON.parse(rawText);
    
    // Extract citations from grounding metadata
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = chunks
      .filter(chunk => chunk.web)
      .map(chunk => ({
        title: chunk.web.title || "Flight Status Source",
        uri: chunk.web.uri
      }));

    return {
      ...parsed,
      lastUpdated: new Date().toLocaleTimeString(),
      sources: sources
    } as FlightStatusData;
  } catch (e) {
    throw new Error("Could not find status for flight " + flightNumber + ". Please check the flight number and date.");
  }
};

export const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Translate the coordinates ${lat}, ${lon} into a city name and country. Return ONLY "City, Country".`,
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: {
            latitude: lat,
            longitude: lon
          }
        }
      }
    }
  });
  return response.text.trim();
};

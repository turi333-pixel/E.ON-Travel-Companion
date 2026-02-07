
import { GoogleGenAI } from "@google/genai";
import { LocationData } from "../types";

export const fetchLocationInsights = async (
  location: string, 
  coords?: { latitude: number; longitude: number }
): Promise<LocationData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Maps grounding is only supported in Gemini 2.5 series models.
  // When using googleMaps, we cannot use responseMimeType: "application/json".
  const model = 'gemini-2.5-flash';
  
  const prompt = `Analyze the business travel context for a location. 
    ${coords ? `The user is currently at coordinates: ${coords.latitude}, ${coords.longitude}.` : `The location is: ${location}.`}
    
    Provide information suitable for an E.ON business traveler. 
    Focus on helping the traveler navigate local culture and professional etiquette.
    
    Include:
    1. Nearest E.ON office address or main hub (be precise if GPS is provided).
    2. 3 Business-friendly hotels nearby.
    3. 3 Reliable business restaurants nearby.
    4. Local transport guidance.
    5. Nearest airport and routes.
    6. Weather summary.
    7. DEEP CULTURAL INSIGHTS: Social Etiquette, Business Norms, Dining & Tipping, and one useful local phrase.

    IMPORTANT: Return the response strictly as a single JSON object. Do not include markdown formatting like \`\`\`json.
    
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
    // Remove potential markdown code blocks if the model ignored the instruction
    if (rawText.startsWith("```")) {
      rawText = rawText.replace(/^```json\n?/, "").replace(/\n?```$/, "");
    }
    const parsed = JSON.parse(rawText) as LocationData;
    return parsed;
  } catch (e) {
    console.error("Failed to parse Gemini response", e, response.text);
    throw new Error("Could not retrieve precise location data. Please try searching by city name.");
  }
};

export const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Translate the coordinates ${lat}, ${lon} into a city name and country for business travel context. Return ONLY the city and country, e.g. "Essen, Germany".`,
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

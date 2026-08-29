export type Lang = 'mr' | 'en';

export type Confidence = 'high' | 'medium' | 'low';

export interface Decision {
  headline: string;
  reason: string;
  icon: string;
  urgency: 'now' | 'monitor' | 'safe';
  confidence: Confidence;
  updatedAt: string;
}

export interface ForecastDay {
  day: string;
  icon: string;
  temp: string;
  rain: string;
  action: string;
  urgency: 'now' | 'monitor' | 'safe';
}

export interface ProfitOutlook {
  status: 'positive' | 'neutral' | 'negative';
  estProfit: string;
  note: string;
}

export interface MarketPrice {
  crop: string;
  price: string;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: string;
}

export interface Scheme {
  id: string;
  name: string;
  summary: string;
  relevance: 'high' | 'medium' | 'low';
  detail: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  ts: number;
}

/** A single crop grown by the farmer */
export interface CropEntry {
  name: string;
  variety: string;
  sowingDate: string;
}

/** A candidate crop shown in the Crop Comparison panel */
export interface CropCandidate {
  id: string;
  emoji: string;
  nameMr: string;
  nameEn: string;
  profitRange: string;       // e.g. "₹60,000–₹95,000 / एकर"
  waterReq: string;          // e.g. "कमी (400–600 मिमी)"
  duration: string;          // e.g. "90–110 दिवस"
  priceTrend: 'up' | 'down' | 'stable';
  priceNote: string;         // e.g. "बाजार दर वाढतोय"
}

export interface ProfileData {
  name: string;
  mobile: string;
  village: string;
  district: string;
  state: string;
  crops: CropEntry[];         // replaces single crop/variety/sowingDate
  area: string;
  soil: string;
  irrigation: string;
  waterSource: string;
  needs: string[];
  completeness: number;
}

export interface WhatIfToggle {
  id: string;
  label: string;
  enabled: boolean;
  impact: string;
}

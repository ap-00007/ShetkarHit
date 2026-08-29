import { Droplet, Sun, CloudRain, Cloud, Bug, IndianRupee, Sprout } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const iconMap: Record<string, LucideIcon> = {
  droplet: Droplet,
  sun: Sun,
  'cloud-rain': CloudRain,
  cloud: Cloud,
  bug: Bug,
  rupee: IndianRupee,
  sprout: Sprout,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? Sprout;
}

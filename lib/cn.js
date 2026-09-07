import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// cn() ala shadcn/ui-layouts: gabung class kondisional + rapikan konflik Tailwind.
// Dipakai komponen port dari ui-layouts (EmblaCarousel, Spotlight, ...).
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

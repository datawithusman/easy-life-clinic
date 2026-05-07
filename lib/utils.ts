import { format } from "date-fns";

export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(date: Date | string): string {
  return format(new Date(date), "EEEE, d MMMM yyyy");
}

export function formatServiceType(type: string): string {
  const map: Record<string, string> = {
    SKIN: "Skin Care",
    HAIR: "Hair Care",
    BOTH: "Skin + Hair Care",
  };
  return map[type] || type;
}

export function formatConsultType(type: string): string {
  return type === "ONLINE" ? "Online Consultation" : "In-Person";
}

export function getServiceFee(
  type: string,
  settings: { skinFee: number; hairFee: number; bothFee: number }
): number {
  if (type === "SKIN") return settings.skinFee;
  if (type === "HAIR") return settings.hairFee;
  return settings.bothFee;
}

export function isClinicDay(date: Date, openDays: string): boolean {
  const days = openDays.split(",").map((d) => d.trim().toLowerCase());
  const dayName = format(date, "EEEE").toLowerCase();
  return days.includes(dayName);
}

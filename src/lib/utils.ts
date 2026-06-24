import {
  Cpu, Stethoscope, Briefcase, BookOpen, Atom, Scale, PenTool, GraduationCap,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Cpu, Stethoscope, Briefcase, BookOpen, Atom, Scale, PenTool,
};

export function getStreamIcon(icon: string | null): LucideIcon {
  if (icon && iconMap[icon]) return iconMap[icon];
  return GraduationCap;
}

export function formatINR(amount: number | null | undefined): string {
  if (amount == null) return 'N/A';
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatSalary(amount: number | null | undefined): string {
  if (amount == null) return 'N/A';
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr/yr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L/yr`;
  return `₹${amount.toLocaleString('en-IN')}/yr`;
}

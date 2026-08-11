import type { CategoryId } from '@/data/mockData';

export type Availability = 'now' | 'soon' | 'days';
export type HelperStatus = 'active' | 'inactive' | 'expired' | 'removed' | 'flagged';

/** Forma que llega desde helpers_public / las RPC (camelCase, sin token hash). */
export interface PublicHelper {
  id: string;
  name: string;
  whatsapp: string;
  city: string;
  department: string | null;
  neighborhood: string | null;
  mobilityRange: string | null;
  categories: CategoryId[];
  customHelp: string | null;
  availability: Availability;
  availabilitySchedule: string | null;
  description: string;
  status: HelperStatus;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}

export interface HelperFormInput {
  name: string;
  whatsapp: string;
  city: string;
  department?: string;
  neighborhood?: string;
  mobilityRange?: string;
  categories: CategoryId[];
  customHelp?: string;
  availability: Availability;
  availabilitySchedule?: string;
  description?: string;
}

/** Lo que ConfirmationPage necesita mostrar justo después de publicar. */
export interface JustPublished {
  token: string;
  manageUrl: string;
  expiresAt: string;
  preview: HelperFormInput;
}

/** Deriva el estado "visible" que usa la UI (incluye expiración calculada en cliente). */
export function deriveDisplayStatus(helper: Pick<PublicHelper, 'status' | 'expiresAt'>): HelperStatus {
  if (helper.status === 'removed') return 'removed';
  if (helper.status === 'active' && new Date(helper.expiresAt).getTime() <= Date.now()) {
    return 'expired';
  }
  return helper.status;
}
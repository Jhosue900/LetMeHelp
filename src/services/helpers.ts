import { supabase } from '@/lib/supabase';
import { generateManagementToken, hashToken } from '@/utils/crypto';
import type { CategoryId } from '@/data/mockData';
import type { Availability, HelperFormInput, HelperStatus, PublicHelper } from '@/types/helper';

interface HelperRow {
  id: string;
  name: string;
  whatsapp: string;
  city: string;
  department: string | null;
  neighborhood: string | null;
  mobility_range: string | null;
  help_categories: string[];
  custom_help: string | null;
  availability: Availability;
  availability_schedule: string | null;
  description: string | null;
  status: HelperStatus;
  created_at: string;
  updated_at: string;
  expires_at: string;
}

function mapRow(row: HelperRow): PublicHelper {
  return {
    id: row.id,
    name: row.name,
    whatsapp: row.whatsapp,
    city: row.city,
    department: row.department,
    neighborhood: row.neighborhood,
    mobilityRange: row.mobility_range,
    categories: (row.help_categories ?? []) as CategoryId[],
    customHelp: row.custom_help,
    availability: row.availability,
    availabilitySchedule: row.availability_schedule,
    description: row.description ?? '',
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    expiresAt: row.expires_at,
  };
}

export interface GetPublicHelpersFilters {
  search?: string;
  location?: string;
  categories?: CategoryId[];
  availabilities?: Availability[];
}

/** Lee directamente de la vista pública helpers_public (ya filtra activos + no expirados). */
export async function getPublicHelpers(filters: GetPublicHelpersFilters = {}): Promise<PublicHelper[]> {
  let query = supabase.from('helpers_public').select('*').order('updated_at', { ascending: false });

  if (filters.location && filters.location.trim()) {
    const loc = filters.location.trim();
    query = query.or(
      `city.ilike.%${loc}%,department.ilike.%${loc}%,neighborhood.ilike.%${loc}%`,
    );
  }

  if (filters.availabilities && filters.availabilities.length > 0) {
    query = query.in('availability', filters.availabilities);
  }

  if (filters.categories && filters.categories.length > 0) {
    query = query.overlaps('help_categories', filters.categories);
  }

  const { data, error } = await query;
  if (error) throw error;

  let rows = (data ?? []) as HelperRow[];

  if (filters.search && filters.search.trim()) {
    const q = filters.search.toLowerCase().trim();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q) ||
        (r.department ?? '').toLowerCase().includes(q) ||
        (r.neighborhood ?? '').toLowerCase().includes(q) ||
        (r.description ?? '').toLowerCase().includes(q) ||
        r.help_categories.some((c) => c.toLowerCase().includes(q)),
    );
  }

  return rows.map(mapRow);
}

export async function getPublicHelperById(id: string): Promise<PublicHelper | null> {
  const { data, error } = await supabase
    .from('helpers_public')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return mapRow(data as HelperRow);
}

export interface CreateHelperResult {
  id: string;
  expiresAt: string;
  token: string;
  manageUrl: string;
}

/**
 * Genera el token en el navegador, calcula su SHA-256 y solo envía el
 * hash a Supabase. El token original nunca se transmite ni se guarda.
 */
export async function createHelper(input: HelperFormInput): Promise<CreateHelperResult> {
  const token = generateManagementToken();
  const tokenHash = await hashToken(token);

  const { data, error } = await supabase.rpc('create_helper', {
    p_name: input.name,
    p_whatsapp: input.whatsapp,
    p_city: input.city,
    p_department: input.department ?? null,
    p_neighborhood: input.neighborhood ?? null,
    p_mobility_range: input.mobilityRange ?? null,
    p_help_categories: input.categories,
    p_custom_help: input.customHelp ?? null,
    p_availability: input.availability,
    p_availability_schedule: input.availabilitySchedule ?? null,
    p_description: input.description ?? '',
    p_token_hash: tokenHash,
  });

  if (error) throw error;

  const row = (Array.isArray(data) ? data[0] : data) as { id: string; expires_at: string };

  return {
    id: row.id,
    expiresAt: row.expires_at,
    token,
    manageUrl: `/administrar/${token}`,
  };
}

export async function getHelperByToken(token: string): Promise<PublicHelper | null> {
  const { data, error } = await supabase.rpc('get_helper_by_token', { p_token: token });
  if (error) {
    // TEMPORAL: log completo para depurar. El mensaje que ve el usuario final
    // sigue siendo genérico (ManagePage solo dice "no encontrada"), pero esto
    // nos deja ver en la consola si es un token inválido de verdad o un
    // problema distinto (función no existe, permisos, etc.).
    console.error('[getHelperByToken] Supabase RPC error:', error);
    return null;
  }
  const row = Array.isArray(data) ? data[0] : data;
  if (!row) return null;
  return mapRow(row as HelperRow);
}

export async function updateHelper(token: string, input: HelperFormInput): Promise<PublicHelper> {
  const { data, error } = await supabase.rpc('update_helper', {
    p_token: token,
    p_name: input.name,
    p_whatsapp: input.whatsapp,
    p_city: input.city,
    p_department: input.department ?? null,
    p_neighborhood: input.neighborhood ?? null,
    p_mobility_range: input.mobilityRange ?? null,
    p_help_categories: input.categories,
    p_custom_help: input.customHelp ?? null,
    p_availability: input.availability,
    p_availability_schedule: input.availabilitySchedule ?? null,
    p_description: input.description ?? '',
  });
  if (error) throw error;
  const row = Array.isArray(data) ? data[0] : data;
  return mapRow(row as HelperRow);
}

export async function activateHelper(token: string): Promise<void> {
  const { error } = await supabase.rpc('activate_helper', { p_token: token });
  if (error) throw error;
}

export async function deactivateHelper(token: string): Promise<void> {
  const { error } = await supabase.rpc('deactivate_helper', { p_token: token });
  if (error) throw error;
}

export async function renewHelper(token: string): Promise<void> {
  const { error } = await supabase.rpc('renew_helper', { p_token: token });
  if (error) throw error;
}

export async function deleteHelper(token: string): Promise<void> {
  const { error } = await supabase.rpc('delete_helper', { p_token: token });
  if (error) throw error;
}
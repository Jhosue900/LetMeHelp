import { supabase } from '@/lib/supabase';

export async function reportHelper(helperId: string, reason: string, description?: string): Promise<void> {
  const { error } = await supabase.rpc('report_helper', {
    p_helper_id: helperId,
    p_reason: reason,
    p_description: description ?? null,
  });
  if (error) throw error;
}
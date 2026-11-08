'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function getTrainingProgress() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { authenticated: false, progress: null };

  const { data, error } = await supabase
    .from('training_progress')
    .select('progress')
    .eq('user_id', user.id)
    .eq('training_slug', 'centro-treinos')
    .maybeSingle();

  if (error) return { authenticated: true, progress: null, error: 'Não foi possível carregar o progresso.' };
  return { authenticated: true, progress: data?.progress || null };
}

export async function saveTrainingProgress(trainingSlug, progress) {
  if (typeof trainingSlug !== 'string' || !/^[a-z0-9-]{1,80}$/.test(trainingSlug)) {
    return { error: 'Identificador de treino inválido.' };
  }

  if (!progress || typeof progress !== 'object' || Array.isArray(progress)) {
    return { error: 'Formato de progresso inválido.' };
  }

  let serialized;
  try {
    serialized = JSON.stringify(progress);
  } catch {
    return { error: 'Não foi possível guardar este progresso.' };
  }

  if (serialized.length > 64_000) return { error: 'O progresso excede o limite permitido.' };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Inicia sessão para guardar o progresso.' };

  const { error } = await supabase.from('training_progress').upsert({
    user_id: user.id,
    training_slug: trainingSlug,
    progress,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id,training_slug' });

  if (error) return { error: 'Não foi possível guardar o progresso.' };

  revalidatePath('/conta');
  return { success: true };
}

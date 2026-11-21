'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { agentName } from '@/lib/security.mjs';
import { validCompletion, trainingProgress } from '@/lib/training-validation.mjs';

export async function getTrainingProgress() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError && authError.name !== 'AuthSessionMissingError') return { error: 'Não foi possível verificar a sessão. Volta a tentar.' };
    if (!user) return { authenticated: false, progress: null, agentName: '' };
    const { data, error } = await supabase.from('training_results').select('game_id, best_seconds, last_seconds, completions').eq('user_id', user.id);
    if (error) return { authenticated: true, error: 'Não foi possível carregar o progresso. Nada foi alterado.' };
    const { data: legacy } = await supabase.from('training_progress').select('progress').eq('user_id', user.id).eq('training_slug', 'centro-treinos').maybeSingle();
    return { authenticated: true, progress: trainingProgress(data), agentName: agentName(user), legacyProgress: Boolean(legacy?.progress) };
  } catch {
    return { error: 'Não foi possível carregar o progresso. Volta a tentar.' };
  }
}

export async function completeTraining(id, attempt, seconds) {
  if (!validCompletion(id, attempt, seconds)) return { error: 'A solução não está correta. Confirma a tua resposta.' };
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError && authError.name !== 'AuthSessionMissingError') return { error: 'Não foi possível verificar a sessão. Tenta novamente.' };
    if (!user) return { success: true, saved: false };
    const { error } = await createAdminClient().rpc('record_training_result', { p_user_id: user.id, p_game_id: id, p_seconds: seconds });
    if (error) return { error: 'Não foi possível guardar o resultado. Mantém o desafio aberto e tenta novamente.' };
    revalidatePath('/conta');
    return { success: true, saved: true };
  } catch {
    return { error: 'Não foi possível guardar o resultado. Tenta novamente.' };
  }
}

export async function updateAgentName(rawName) {
  const name = typeof rawName === 'string' ? rawName.trim() : '';
  if (name.length < 2 || name.length > 40) {
    return { error: 'O nome de agente deve ter entre 2 e 40 caracteres.' };
  }

  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return { error: 'Inicia sessão para editar o perfil.' };

  const { error } = await supabase.auth.updateUser({
    data: { ...user.user_metadata, agent_name: name },
  });
  if (error) return { error: 'Não foi possível guardar as alterações.' };

  revalidatePath('/conta');
  revalidatePath('/', 'layout');
  return { success: true, name };
}

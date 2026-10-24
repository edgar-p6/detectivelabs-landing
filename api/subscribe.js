import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Apenas aceitamos pedidos POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const { email } = req.body;

  // Validação simples de email
  if (!email || !email.includes('@') || !email.includes('.')) {
    return res.status(400).json({ error: 'Email inválido.' });
  }

  try {
    // Inicializar o cliente Supabase com as chaves de ambiente
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Inserir email na base de dados
    const { data, error } = await supabase
      .from('subscribers')
      .insert([{ email: email.trim().toLowerCase() }]);

    if (error) {
      // Código PostgreSQL 23505 corresponde a violação de unicidade (email duplicado)
      if (error.code === '23505') {
        return res.status(200).json({ success: true, message: 'Este email já estava registado no cofre.' });
      }
      throw error;
    }

    return res.status(200).json({ success: true, message: 'Acesso antecipado concedido.' });

  } catch (err) {
    console.error('Erro no servidor:', err.message);
    return res.status(500).json({ error: 'Erro interno ao processar o registo.' });
  }
}
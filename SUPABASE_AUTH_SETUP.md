# Configuração de autenticação Supabase

## Variáveis locais e Vercel

Definir `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` com os valores do projeto Supabase atual. A chave pública pode ser usada pelo browser porque o acesso é limitado pelas políticas RLS. Nunca definir a chave `service_role` com o prefixo `NEXT_PUBLIC_`.

## Verificação de emails registados

Definir SUPABASE_SERVICE_ROLE_KEY apenas no servidor (ambiente local e variáveis da Vercel para a branch de testes). A rota de acesso usa esta chave exclusivamente no servidor para distinguir contas existentes de novos registos. Nunca usar um prefixo NEXT_PUBLIC_ nesta chave.
## URLs de autenticação

Em Supabase → Authentication → URL Configuration:

- Site URL de produção: `https://detectivelabs.pt`
- Redirect URLs: `http://localhost:3000/auth/callback`, o domínio de preview usado pela branch de testes e `https://detectivelabs.pt/auth/callback`

Adicionar também qualquer domínio `vercel.app` específico que seja usado no preview. Evitar uma regra wildcard ampla em produção.

## Base de dados

Executar a migration `supabase/migrations/20261108180000_training_progress.sql` no SQL Editor do projeto. Ela cria a tabela de progresso e as políticas que isolam os registos por utilizador.

## Email

O login envia um link por email através do Supabase Auth. O remetente padrão da Supabase serve apenas para testes limitados. Para utilizadores reais, configurar SMTP próprio em Authentication → SMTP Settings e verificar o domínio de envio.

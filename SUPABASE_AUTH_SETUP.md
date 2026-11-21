# Acesso por email e resultados dos treinos

## Variáveis locais e Vercel

Definir `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` e `SUPABASE_SERVICE_ROLE_KEY` no ambiente da branch de testes. A última chave é exclusivamente do servidor e nunca pode ter o prefixo `NEXT_PUBLIC_`.

A chave pública é usada pelo browser e respeita as políticas de acesso por utilizador. A chave do servidor é usada apenas depois de verificar a sessão para guardar resultados validados, e na rota limitada de subscrição. Não existe consulta pública de emails registados; a antiga rota responde 410.

## Registo e login

Ambos usam `signInWithOtp`, sem palavra-passe. O registo permite criar utilizadores e envia o nome de agente; o login usa `shouldCreateUser: false`. As mensagens públicas não confirmam se uma conta existe. O Supabase continua a impor os seus limites de envio.

O link é pessoal, de utilização única e deve ser aberto no mesmo browser e perfil onde foi pedido. Este fluxo usa PKCE; abrir noutro browser ou dispositivo não é suportado. O site explica essa condição no formulário e permite pedir outro link se a validação falhar.

## URLs autorizadas

Em Authentication → URL Configuration, manter o Site URL de produção em `https://detectivelabs.pt` e adicionar os callbacks exatos:

- `http://localhost:3000/auth/callback`
- O domínio exato da branch de preview, seguido de `/auth/callback`
- `https://detectivelabs.pt/auth/callback`

Não usar regras wildcard amplas para produção. Depois do login, só são aceites os destinos internos `/conta` e `/treinos`.

## Base de dados

Aplicar primeiro a migration original `20261108180000_training_progress.sql` se ainda não existir. Aplicar depois `202611210001_security_hardening.sql`.

A nova migration não apaga o histórico de testes. Os resultados verificados ficam em `training_results`; o browser só pode ler os próprios resultados. Apenas o servidor pode gravar, após validar a solução. Os pontos são calculados a partir dos desafios verificados, uma única vez por desafio. O servidor não aceita pontos enviados pelo browser.

A subscrição usa `subscribe_email`, apenas acessível à chave do servidor, com um limite persistente de cinco pedidos por origem de rede em dez minutos. A origem de rede é convertida num identificador por HMAC; não se guarda o IP original. Na Vercel só é aceite o cabeçalho de encaminhamento da própria plataforma. Em testes locais todos os pedidos partilham o mesmo limite.

Como a base de dados é partilhada, confirmar que a produção usa a chave do servidor na subscrição antes de aplicar a migration: a escrita direta com a chave pública deixa de ser permitida.

## Envio de email

Confirmar SMTP próprio, domínio de envio e limites de envio no Supabase antes da publicação pública. O remetente integrado serve para testes limitados. O teste de login com suporte@detectivelabs.pt confirma esse destinatário, mas não garante a entrega a todos os fornecedores de email.

Guardar uma subscrição não envia automaticamente um email de boas-vindas nem um cupão. As futuras campanhas devem incluir cancelamento de subscrição. O formulário disponibiliza o contacto de suporte para pedidos de remoção.

Ver `SECURITY_RELEASE_CHECKLIST.md` para os testes de publicação e limitações que ainda precisam de validação fora do ambiente local.

# Emails de autenticação

No Supabase, abre Authentication → Emails → Templates.

- **Confirm sign up**: assunto `Confirma o teu acesso à Detective Labs`; corpo de `confirm-signup.html`.
- **Magic link or OTP**: assunto `O teu link de acesso à Detective Labs`; corpo de `magic-link.html`.

Mantém `{{ .ConfirmationURL }}` nos links: o Supabase substitui este valor pelo endereço de verificação. Não o substituas pelo endereço da página de login. O fluxo atual exige o mesmo browser e perfil em que o acesso foi pedido.

Os modelos usam estilos inline e tabelas, sem imagens externas. Confirma o resultado num email real e nos clientes utilizados antes de publicar. O Supabase é partilhado com produção; guardar estes modelos altera os emails desse projeto inteiro.

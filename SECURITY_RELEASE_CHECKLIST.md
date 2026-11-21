# Preparação da branch de testes para produção

## Base de dados (obrigatório antes dos testes finais)

Aplicar `supabase/migrations/202611210001_security_hardening.sql` no SQL Editor do Supabase atual.
O script é transacional e pode ser executado novamente. Não elimina contas, subscritores nem o histórico em training_progress.
Cria training_results com leitura apenas do próprio utilizador, duas funções acessíveis apenas ao servidor e um contador persistente de pedidos de subscrição.
Revoga escrita pública direta em subscribers, impedindo contornar a limitação de pedidos.
Como o Supabase é partilhado, confirmar antes que a produção usa SUPABASE_SERVICE_ROLE_KEY na rota de subscrição; uma configuração que use apenas anon deixa de poder inserir diretamente.

Os pontos antigos enviados pelo browser não são convertidos em pontos verificados. O histórico mantém-se na tabela original e é sinalizado no perfil. Os valores de demonstração (150 pontos e um jogo resolvido) foram removidos.

## Configuração

- Definir NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY e SUPABASE_SERVICE_ROLE_KEY (apenas servidor) na Vercel.
- A subscrição aceita também SUPABASE_URL, mas já não depende dessa variável antiga.
- Não usar esta chave administrativa em variáveis NEXT_PUBLIC_.
- Manter localhost:3000/auth/callback e o domínio exato de preview na lista de URLs autorizadas do Supabase. Adicionar detectivelabs.pt/auth/callback apenas para a publicação definitiva.
- Confirmar SMTP próprio e domínio de envio no Supabase; o envio integrado não é adequado para uma lista pública de utilizadores.
- Não aumentar limites de emails nem desativar proteções do Supabase para testar. Ativar a proteção contra abuso disponível no serviço quando a utilização o exigir.

## Testes finais com suporte@detectivelabs.pt

- Criar conta pela interface, receber o email e abrir o link no mesmo browser/perfil. O PKCE atual exige esse browser.
- Confirmar que o nome de agente aparece e pode ser editado; testar terminar sessão e voltar a entrar.
- Confirmar um desafio, atualizar a página e verificar os mesmos pontos; repetir o desafio sem novos pontos.
- Confirmar dois desafios em separadores diferentes e verificar ambos após atualizar.
- Verificar com duas contas que uma não pode ler nem escrever os resultados da outra, nem chamar as funções administrativas.
- Testar subscrição nova, repetida e com maiúsculas/espaços, sem respostas que revelem se o endereço já existe.
- Confirmar que o sexto pedido de subscrição em 10 minutos é recusado e que não é possível inserir diretamente com a chave pública.
- Simular indisponibilidade da base de dados: mostrar erro, não substituir histórico, permitir voltar a tentar.
- Testar link expirado/reutilizado, acesso a /conta sem sessão e renovação da sessão.
- Confirmar que cada campanha futura de email tem mecanismo de cancelamento; o site disponibiliza entretanto o contacto de suporte para remoção. O registo na lista não envia automaticamente um email de boas-vindas nem um cupão.
- Rever o aviso de privacidade com os dados reais do responsável, prazos de conservação e fornecedores antes de recolher novos contactos publicamente. Não foi inventada uma política legal.

## Comandos de verificação

`npm test`, `npm run lint`, `npm run build`, `npm audit`.
Os testes automatizados validam entradas, soluções dos jogos, identidade no servidor, erros da base de dados, subscrição e redirecionamentos. Não substituem os testes de permissões reais após aplicar a migration.
Os tempos dos jogos são informativos e enviados pelo browser; não devem servir como prova para prémios ou classificações competitivas. Não há resgate de descontos implementado.

Nada nesta checklist autoriza merge, push ou publicação em produção.

## Verificado nesta sessão (21/11/2026)

- Migration executada pelo proprietário no Supabase, com mensagem de sucesso.
- Login por link com suporte@detectivelabs.pt concluído pelo proprietário no Brave.
- Oito testes automatizados de segurança passaram; lint e compilação passaram em Next.js 16.4.6.
- `npm audit` não identificou vulnerabilidades conhecidas após a atualização das dependências.
- Dezasseis verificações HTTP de páginas, validação de pedidos, redirecionamentos e cabeçalhos passaram.
- Dezassete ficheiros JavaScript de cliente inspecionados sem a chave administrativa nem o antigo campo de respostas.
- Isolamento entre duas contas, bloqueio de escrita direta, restrições das funções e conclusões concorrentes confirmados no Supabase real. As duas contas temporárias e os seus resultados foram removidos no fim.
- A rota real de subscrição aceitou cinco pedidos normalizados para suporte@detectivelabs.pt, manteve um único subscritor e recusou o sexto com HTTP 429. Esse endereço ficou inscrito para o teste; os contactos anteriores não foram alterados.
- Pedidos HTTP reais ao site confirmaram rejeição de pontos falsificados, gravação de conclusão válida, ausência de pontos adicionais ao repetir, recuperação do progresso num novo pedido, edição do nome e bloqueio de pedidos de outra origem. A conta temporária e os seus resultados foram removidos no fim.
- As correções e o cartaz foram enviados apenas para `feature/enigmas-gratuitos`. A Vercel compilou o commit `d1d59b6` e publicou-o em Preview. Não foi efetuado merge nem deploy de produção.


## Validação adicional e configuração (21/11/2026)

- Oito testes de segurança, lint e build passaram novamente após a inclusão do cartaz; `npm audit` reportou zero vulnerabilidades conhecidas.
- Dezasseis verificações HTTP locais passaram; dezoito ficheiros JavaScript de cliente foram inspecionados sem a chave administrativa.
- Renovação através do proxy confirmada com cookie local simulado como expirado e refresh token válido; o novo cookie chegou à resposta e identificou a mesma conta. Este teste não esperou pela expiração natural do token.
- Logout confirmado: o pedido seguinte sem sessão recebeu o redirecionamento para login e não incluiu os dados privados da conta.
- Tokens de magic link válidos foram aceites uma vez; reutilizados e inválidos foram recusados pelo Supabase. Não foi enviado email neste teste.
- Foram repetidos os testes HTTP reais de gravação, repetição, recuperação de progresso, edição de perfil, visitante e origem externa.
- Visitantes e utilizadores autenticados não conseguem consultar os subscritores nem os contadores de pedidos; a verificação usou apenas contagem, sem ler contactos existentes.
- Todas as contas temporárias destes testes foram removidas.
- O cartaz usa a fotografia original com ajuste `contain`, sem recortar pessoas. O espaço mediu exatamente o mesmo antes e depois: 290,24 × 579,69 px no viewport original e 310,40 × 260 px a 375 px de largura. As regras existentes de grelha e altura não foram alteradas.
- Modelos de criação de conta e magic link guardados no Supabase e em `supabase/email-templates/`, preservando `{{ .ConfirmationURL }}`. Como o projeto é partilhado, estes modelos também se aplicam aos emails de produção.
- SMTP próprio já estava ativo com Resend e remetente Detective Labs. Não foram alteradas credenciais nem limites. A configuração não prova por si só a entrega em todos os fornecedores de email.
- Foi acrescentado o callback exato do endereço estável da branch: `https://detectivelabs-landing-git-feature-enigmas-4083fb-detective-labs.vercel.app/auth/callback`. A lista anterior continha apenas um preview antigo, além de localhost e produção. O Site URL continua a ser `https://detectivelabs.pt`.
- Preview do commit `d1d59b6`: `https://detectivelabs-landing-7svmdxqb3-detective-labs.vercel.app/`; endereço estável para os testes de login: `https://detectivelabs-landing-git-feature-enigmas-4083fb-detective-labs.vercel.app/`.

## Ainda por fechar antes da produção

- O preview apresenta “This page couldn’t load” no browser integrado, também confirmado pelo proprietário. A compilação da Vercel terminou em Ready. Os avisos de build referem configuração cache-dir do npm e aprovação de postinstall de unrs-resolver, sem erro de compilação. É necessário distinguir a falha de acesso do browser/proteção da Vercel de uma falha da aplicação, e concluir os testes no preview atualizado.
- Confirmar na Vercel a subscrição com o IP encaminhado real, o limite de pedidos, os cookies e o percurso completo de login. Os testes locais não validam os cabeçalhos acrescentados pela plataforma.
- Confirmar a receção e apresentação dos novos modelos num email real e abrir o link no mesmo browser do pedido.
- Falta a identificação real do responsável e o prazo de conservação das subscrições inativas para concluir o aviso de privacidade. O contacto de remoção já existe; cada campanha futura precisa de cancelamento fácil. Não inventar dados legais.
- Os testes de segurança não constituem garantia de ausência de vulnerabilidades nem um teste de carga. O fluxo usa a API pública de autenticação do Supabase e as suas limitações contra abuso; respostas genéricas na interface não asseguram que todos os endpoints do fornecedor ocultem a existência de contas.
- Os tempos dos treinos continuam a ser informativos e não servem para atribuir prémios competitivos.


### Causa identificada da falha no preview

A consola do browser mostrou ausência de `NEXT_PUBLIC_SUPABASE_URL`. A Vercel tinha `SUPABASE_URL` (apenas servidor), chave pública e chave administrativa, mas faltava o endereço que o código de cliente precisa na compilação. Foi guardado `NEXT_PUBLIC_SUPABASE_URL` apenas em Preview. A próxima publicação usa essa configuração.

`next.config.mjs` passa a recusar compilações na Vercel sem endereço público, chave pública ou credencial do servidor, aceitando os aliases já suportados. Há um teste de regressão para este controlo. Não são mostrados valores das chaves nos erros.

**Antes de publicar esta branch em produção**, definir também `NEXT_PUBLIC_SUPABASE_URL` no ambiente Production: continua em falta aí. Esta configuração de produção não foi alterada. A versão de produção atual permanece em `201705d`.

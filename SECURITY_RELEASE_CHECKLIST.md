# Validação da branch de testes — 21/11/2026

Branch: `feature/enigmas-gratuitos`. Código funcional e visual verificado: `03a2bdc` (inclui as alterações anteriores de autenticação e segurança).

Preview estável: https://detectivelabs-landing-git-feature-enigmas-4083fb-detective-labs.vercel.app/

A Vercel publicou a versão com o aviso de privacidade e indicou Ready. A produção permanece na branch `main`, commit `201705d`. Não foi efetuado merge nem deploy de produção. Os modelos de email foram alterados no Supabase partilhado, pelo que também se aplicam aos emails do site atual.

## Correções e configuração concluídas

- Login/criação de conta por magic link, sem a antiga exigência indevida de password; respostas genéricas na interface e endpoint antigo de consulta de emails desativado com HTTP 410.
- Callback limitado a destinos internos autorizados; tokens inválidos têm um percurso de recuperação. O fluxo PKCE exige o mesmo browser e perfil em que o link foi pedido.
- Renovação de sessão no proxy reconhecido pelo Next; páginas de conta sem cache público.
- Subscrição com validação de tamanho/tipo/email/origem, normalização, resposta genérica para duplicados e limite persistente de cinco pedidos por dez minutos. A escrita pública direta na tabela foi bloqueada.
- Resultados dos treinos validados no servidor; pontos calculados pelos desafios conhecidos e atribuídos uma vez. Escrita administrativa e leitura apenas dos resultados do próprio utilizador.
- O histórico antigo mantém-se na tabela original e é sinalizado no perfil; não é convertido em pontos verificados. Pontos de demonstração removidos.
- Erros recuperáveis, feedback de operações, foco dos diálogos, Escape e bloqueio de scroll revistos.
- Next e configuração ESLint em 16.4.6; cabeçalhos de segurança acrescentados.
- Cartaz responsivo com enquadramentos vertical e panorâmico e ajuste `cover`, preservando a grelha e as alturas do contentor. A área foi verificada dos 320 aos 1440 px, sem faixas vazias ou transbordo horizontal. A fotografia vertical foi depois corrigida para as pernas e o calçado assentarem naturalmente no relvado; carregamento confirmado no preview.
- Dois modelos de email em português, nas cores do site, guardados em `supabase/email-templates/` e no Supabase, mantendo `{{ .ConfirmationURL }}`. SMTP próprio com Resend já estava ativo; não foram alteradas credenciais nem limites.
- O preview falhava por ausência de `NEXT_PUBLIC_SUPABASE_URL`, identificada na consola. A variável foi guardada **apenas em Preview**. A compilação na Vercel passou a recusar configuração incompleta, com teste de regressão e suporte aos aliases existentes.
- Callback exato do endereço estável da branch adicionado ao Supabase. O Site URL continua a ser `https://detectivelabs.pt`; não foi aberto um wildcard para previews.
- Aviso de privacidade publicado em `/privacidade`, ligado ao rodapé e aos formulários, com Edgar Pereira como responsável, contacto de suporte e conservação da lista por 12 meses desde o registo.

## Evidência dos testes

- Doze testes automatizados passaram após a expansão do labirinto; lint e build passaram também após os últimos ajustes da fotografia e do texto da subscrição. `npm audit` reportou zero vulnerabilidades conhecidas; as dependências não mudaram depois dessa verificação.
- Dezasseis verificações HTTP locais passaram; dezoito ficheiros JavaScript de cliente foram inspecionados sem a chave administrativa nem o antigo campo de respostas.
- A migration `supabase/migrations/202611210001_security_hardening.sql` foi executada pelo proprietário no Supabase, com sucesso. Também foi validada numa base PostgreSQL temporária, incluindo repetição da aplicação.
- Duas contas temporárias no Supabase confirmaram isolamento entre utilizadores, bloqueio de leitura anónima dos resultados e de escrita direta/funções privilegiadas. Conclusões concorrentes mantiveram uma única atribuição de pontos.
- Pedidos HTTP reais às ações do servidor confirmaram rejeição de pontos falsificados, gravação de solução válida, repetição sem novos pontos, recuperação num novo pedido, edição do nome, visitante sem persistência e rejeição de escrita de outra origem. Falhas da base são também cobertas pelos testes automatizados.
- Um cookie local simulado como expirado, com refresh token válido, foi recuperado pelo proxy; o novo cookie chegou à resposta e identificou a mesma conta. Este teste não esperou pela expiração natural do token.
- Após logout, o pedido sem sessão recebeu o redirecionamento para login e não incluiu dados privados da conta. Tokens de magic link válidos foram aceites uma vez; reutilizados e inválidos foram recusados pelo Supabase, sem envio de email nesse teste.
- Visitantes e utilizadores autenticados não conseguiram consultar subscritores nem contadores de pedidos; as verificações usaram contagem, sem ler contactos existentes.
- No preview real da Vercel, cinco submissões para `suporte@detectivelabs.pt`, incluindo variações com maiúsculas, foram aceites e a sexta bloqueada com o aviso de limite. A base confirmou um único registo desse email após os testes. O endereço mantém-se subscrito para teste.
- O proprietário confirmou que recebeu o novo email e entrou corretamente na área do detetive através do preview no Brave.
- Os sete desafios disponíveis foram concluídos pela interface do preview como visitante, incluindo o labirinto completo e as 81 células do nonogram. O total chegou a 850/850 pontos. Uma resposta errada foi recusada; o filtro de resolvidos funcionou; atualizar a página repôs os resultados de visitante a zero, conforme o aviso.
- Loja, fotografia e aviso de privacidade verificados no preview; o aviso foi verificado a 375 px sem corte horizontal. Todas as contas temporárias dos testes foram removidas; nenhum contacto existente foi eliminado.
- A tabela de subscritores tem `created_at`; a contagem atual de contactos com mais de 12 meses foi zero.

## Últimos ajustes confirmados no preview

- Labirinto partilhado entre cliente e servidor: 21 × 21, 13 becos sem saída, três postos obrigatórios e percurso mínimo completo de 224 movimentos. Validação estrita das direções, paredes, saída antecipada e movimentos após terminar.
- Travessia completa por teclado confirmada localmente e no preview; repetição local atribuiu zero pontos adicionais. Botões, WASD, setas, reinício e percurso opcional verificados; grelha verificada a 320 px. Os resultados anteriores são preservados, mas os tempos pertencem ao mapa anterior.
- Desafio de resposta escrita e nonogram concluídos novamente após a integração do novo labirinto.
- Texto informativo da subscrição reduzido a consentimento, possibilidade de cancelamento e ligação ao aviso de privacidade; ligação aberta e verificada no preview. O aviso completo mantém responsável, contacto e prazo de conservação.
- Estas alterações visuais finais não alteraram autenticação, subscrição no servidor ou políticas de acesso; os testes reais de login/email não foram repetidos após esses ajustes.

## Estado para publicação — decisões de 21/11/2026

- **Preparação técnica:** apto para uma publicação controlada, com as limitações conhecidas abaixo. Não foi executado merge nem deploy de produção.
- **Configuração de produção resolvida pelo proprietário:** Edgar confirmou que `NEXT_PUBLIC_SUPABASE_URL` foi também incluída no ambiente Production da Vercel. Esta alteração foi comunicada pelo proprietário, não reinspecionada nesta revisão. A chave pública e a chave administrativa já constavam desse ambiente. O controlo de compilação continua a recusar configuração incompleta; a compilação de produção será a confirmação efetiva durante a publicação.
- **Risco de privacidade do login aceite temporariamente pelo proprietário:** manter o comportamento atual do Supabase e corrigir mais tarde. A tarefa permanece aberta na lista abaixo; aceitar o risco não o elimina.
- **Conservação manual aceite pelo proprietário:** manter a revisão mensal e o tratamento de cancelamentos segundo `SUBSCRIPTION_RETENTION.md`; a automatização permanece aberta na mesma lista.
- **Verificação após publicar:** confirmar compilação da Vercel e testar no domínio `https://detectivelabs.pt` a home, loja, treinos, login com novo link, sessão/conta e subscrição. Confirmar que o callback continua no domínio de produção e que a gravação de resultados funciona. A validação do preview não substitui estes testes no ambiente final.

## Lista de tarefas abertas

- [ ] **Privacidade do login — risco temporariamente aceite:** uma chamada direta à API pública do Supabase para um email inexistente, com criação de conta desativada, devolveu `422 / otp_disabled`. Isto pode permitir distinguir a existência de contas, apesar das respostas genéricas na interface. Não permite iniciar sessão nem consultar os dados da conta. Investigar uma solução no fornecedor ou uma alteração do sistema de autenticação que deixe de distinguir contas existentes e inexistentes. CAPTCHA e limites reduzem automação, mas não eliminam a distinção. Para fechar esta tarefa, testar diretamente a API, além da interface, sem regressões no acesso por email.
- [ ] **Automatizar a conservação da lista:** substituir a remoção manual após 12 meses por um processo automático verificável. Até lá, rever mensalmente e antes de cada campanha, excluir contactos fora do prazo e atender os pedidos de cancelamento recebidos por suporte. A automatização não deve renovar o prazo por pedidos de subscrição repetidos nem afetar as contas de agente. O envio de campanhas/cupões continua fora do site e deverá incluir cancelamento simples.
- [ ] **Revisão operacional dos fornecedores:** confirmar os contratos de tratamento, garantias de transferências internacionais e prazos dos registos técnicos dos fornecedores. A localização da base na Irlanda não prova que todo o processamento seja exclusivamente europeu. Esta revisão não foi confirmada pelo proprietário e mantém-se pendente; a conclusão de preparação técnica não equivale a validação jurídica.

## Limites desta validação

- Não constitui um teste de carga nem garantia de ausência de vulnerabilidades. Não foram testados todos os browsers, clientes de email ou fornecedores de caixas de correio.
- Login no preview e apresentação do novo email foram confirmados pelo proprietário; a renovação e o isolamento de dados foram testados tecnicamente com contas temporárias.
- Os tempos dos jogos são informativos e enviados pelo browser; não devem servir como prova para prémios ou classificações competitivas. Não há resgate de descontos implementado.
- Não foram removidas as três cópias locais de rotas que já estavam sem controlo de versões.
- Este relatório não autoriza publicação em produção.

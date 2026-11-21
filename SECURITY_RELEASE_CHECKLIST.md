# Validação da branch de testes — 21/11/2026

Branch: `feature/enigmas-gratuitos`. Código funcional verificado: `126d1b6`.

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
- Fotografia original no cartaz, usando ajuste `contain` e otimização Next Image. Grelha e alturas existentes preservadas. Antes/depois no viewport original: 290,24 × 579,69 px; a 375 px de largura: 310,40 × 260 px, também confirmado no preview.
- Dois modelos de email em português, nas cores do site, guardados em `supabase/email-templates/` e no Supabase, mantendo `{{ .ConfirmationURL }}`. SMTP próprio com Resend já estava ativo; não foram alteradas credenciais nem limites.
- O preview falhava por ausência de `NEXT_PUBLIC_SUPABASE_URL`, identificada na consola. A variável foi guardada **apenas em Preview**. A compilação na Vercel passou a recusar configuração incompleta, com teste de regressão e suporte aos aliases existentes.
- Callback exato do endereço estável da branch adicionado ao Supabase. O Site URL continua a ser `https://detectivelabs.pt`; não foi aberto um wildcard para previews.
- Aviso de privacidade publicado em `/privacidade`, ligado ao rodapé e aos formulários, com Edgar Pereira como responsável, contacto de suporte e conservação da lista por 12 meses desde o registo.

## Evidência dos testes

- Nove testes automatizados passaram; lint e build passaram após as últimas alterações de código. `npm audit` reportou zero vulnerabilidades conhecidas; as dependências não mudaram depois dessa verificação.
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

## Pendências para a passagem a produção

1. **Configuração obrigatória:** definir `NEXT_PUBLIC_SUPABASE_URL` também no ambiente Production da Vercel antes de publicar esta branch. A chave pública e a chave administrativa já constavam da configuração desse ambiente; não foram reveladas nem alteradas. O novo controlo de compilação impede publicar a branch sem o endereço público.
2. **Conservação e cancelamentos:** cumprir a revisão mensal da lista e os pedidos recebidos por suporte, segundo `SUBSCRIPTION_RETENTION.md`. A remoção ao fim de 12 meses é manual nesta versão; não há tarefa automática. Antes de qualquer campanha, excluir contactos fora do prazo e disponibilizar cancelamento simples no próprio email. Ainda não existe envio de campanhas/cupões no site.
3. **Fornecedores:** confirmar os contratos de tratamento, garantias de transferências internacionais e prazos dos registos técnicos dos fornecedores. A localização da base na Irlanda não prova que todo o processamento seja exclusivamente europeu. O aviso não inventa essa garantia.
4. **Limitação de privacidade no fornecedor de login:** uma chamada direta à API pública do Supabase para um email inexistente, com criação de conta desativada, devolveu `422 / otp_disabled`. Isto pode permitir distinguir a existência de contas, apesar das respostas genéricas na interface. Não permite iniciar sessão nem consultar os dados da conta. Os limites do Supabase reduzem o volume, mas a interface não consegue eliminar esta distinção na API do fornecedor. CAPTCHA pode dificultar tentativas automáticas; eliminar a distinção exige suporte/configuração do fornecedor ou uma alteração do sistema de autenticação.

## Limites desta validação

- Não constitui um teste de carga nem garantia de ausência de vulnerabilidades. Não foram testados todos os browsers, clientes de email ou fornecedores de caixas de correio.
- Login no preview e apresentação do novo email foram confirmados pelo proprietário; a renovação e o isolamento de dados foram testados tecnicamente com contas temporárias.
- Os tempos dos jogos são informativos e enviados pelo browser; não devem servir como prova para prémios ou classificações competitivas. Não há resgate de descontos implementado.
- Não foram removidas as três cópias locais de rotas que já estavam sem controlo de versões.
- Este relatório não autoriza publicação em produção.

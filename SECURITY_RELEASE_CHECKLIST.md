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
- Não foi efetuado merge, push nem deploy. Falta repetir os testes no domínio de preview e confirmar a configuração de produção.

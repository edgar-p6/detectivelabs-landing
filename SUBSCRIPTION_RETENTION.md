# Conservação da lista de novidades

Responsável: Edgar Pereira / Detective Labs. Contacto: suporte@detectivelabs.pt.

O prazo escolhido é de 12 meses desde o registo (`subscribers.created_at`). Não há medição de abertura de emails nem um campo de última atividade. Pedir novamente a subscrição mantém o registo original e não renova o consentimento nem a data. A conta de agente tem um tratamento separado.

## Processo operacional

Rever a lista pelo menos mensalmente e antes de qualquer campanha. Remover contactos ao atingir o prazo e atender os pedidos de cancelamento recebidos por email. O site não tem, nesta versão, uma tarefa automática de eliminação nem envia campanhas.

No SQL Editor, esta consulta mostra apenas a quantidade de contactos já fora do prazo:

```sql
select count(*) as contactos_fora_do_prazo
from public.subscribers
where created_at <= now() - interval '12 months';
```

Depois de rever os resultados, o responsável pode executar a remoção definitiva:

```sql
delete from public.subscribers
where created_at <= now() - interval '12 months';
```

Não foi executada nenhuma remoção nesta sessão. Não incluir os contactos fora do prazo em campanhas. Cada campanha deve oferecer cancelamento simples e refletir os pedidos de remoção na tabela antes de novo envio. A escolha do fornecedor de campanhas e a sua lista de supressão precisam de ser confirmadas quando o envio for preparado.

Antes de lançar, confirmar os contratos de tratamento e as garantias de transferências dos fornecedores usados, bem como os prazos aplicáveis aos seus registos técnicos. Não assumir que todo o processamento ocorre na União Europeia apenas porque a base Supabase está na Irlanda.

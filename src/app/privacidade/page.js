import Link from 'next/link';

export const metadata = { title: 'Privacidade | Detective Labs' };

export default function PrivacyPage() {
  return (
    <main className="main-wrapper interior-page">
      <section className="interior-page-hero">
        <h1 className="interior-page-title">Privacidade</h1>
        <p className="interior-page-subtitle">Como usamos os teus dados na Detective Labs.</p>
      </section>
      <article className="privacy-content">
        <p>Última atualização: 21 de novembro de 2026.</p>
        <h2>Quem é responsável</h2>
        <p>A Detective Labs é um projeto pessoal de Edgar Pereira, responsável pelo tratamento dos dados descrito neste aviso. Para questões de privacidade ou para exercer os teus direitos, escreve para <a href="mailto:suporte@detectivelabs.pt">suporte@detectivelabs.pt</a>.</p>

        <h2>Lista de novidades</h2>
        <p>Quando subscreves as novidades, guardamos o teu email e a data de registo para te enviar informações sobre o caso “Feliz Aniversário” e o cupão de lançamento. Este tratamento depende do teu consentimento. A subscrição é opcional e está separada da criação de conta.</p>
        <p>Conservamos o contacto da lista durante, no máximo, 12 meses a contar do registo, ou até retirares o consentimento, se o fizeres antes. Repetir o pedido de subscrição não renova automaticamente este prazo. Não usamos a abertura de emails para medir a tua atividade.</p>
        <p>Podes cancelar a subscrição a qualquer momento através de <a href="mailto:suporte@detectivelabs.pt?subject=Cancelar%20subscri%C3%A7%C3%A3o">suporte@detectivelabs.pt</a>. Cada campanha enviada deve também disponibilizar uma forma simples de cancelamento. Não teres uma subscrição não limita o acesso aos treinos.</p>

        <h2>Conta e progresso nos treinos</h2>
        <p>Para disponibilizar a conta que pedes, tratamos o teu email, identificador de utilizador, nome de agente e dados de autenticação. Se jogares com sessão iniciada, guardamos os desafios concluídos, tempos, número de conclusões e datas de atualização para recuperar o teu progresso. A base deste tratamento é a prestação do serviço de conta e treinos.</p>
        <p>Estes dados são conservados enquanto mantiveres a conta. Podes pedir a sua eliminação pelo contacto acima. Como visitante, os resultados dos treinos ficam apenas na página e não são associados a uma conta. Não te inscrevemos na lista de novidades por criares uma conta.</p>

        <h2>Funcionamento e segurança</h2>
        <p>Usamos armazenamento no browser e cookies de sessão para iniciar e manter a sessão. São necessários ao funcionamento da conta. Para limitar pedidos abusivos à lista, o servidor usa um identificador derivado do endereço IP através de uma função criptográfica com chave; a tabela de controlo não guarda o IP em texto simples. Os registos com mais de um dia são removidos quando é processado um novo pedido de subscrição aceite.</p>
        <p>O alojamento e a autenticação também geram registos técnicos para operação e segurança. Usamos a Vercel Analytics para métricas gerais de utilização, sem adicionar cookies publicitários ao site. O tratamento necessário à segurança e à manutenção do serviço assenta no interesse legítimo em prevenir abuso e manter o site a funcionar.</p>

        <h2>Fornecedores</h2>
        <p>Recorremos ao Supabase para autenticação e base de dados, à Vercel para alojamento e métricas, e ao Resend para envio dos emails de acesso. Não vendemos os teus contactos. Estes serviços podem processar dados através de infraestrutura internacional; as condições de tratamento, conservação de registos e garantias de transferência constam da documentação de cada fornecedor:</p>
        <ul>
          <li><a href="https://supabase.com/privacy">Privacidade do Supabase</a></li>
          <li><a href="https://vercel.com/legal/privacy-policy">Privacidade da Vercel</a></li>
          <li><a href="https://resend.com/legal/privacy-policy">Privacidade do Resend</a></li>
        </ul>

        <h2>Os teus direitos</h2>
        <p>Podes pedir acesso, correção ou eliminação dos teus dados, limitação do tratamento e, quando aplicável, portabilidade ou oposição. Podes retirar o consentimento para novidades sem afetar o tratamento realizado anteriormente. Para proteger os teus dados, podemos precisar de confirmar que o pedido vem do titular do email.</p>
        <p>Podes também apresentar uma reclamação à <a href="https://www.cnpd.pt/">Comissão Nacional de Proteção de Dados (CNPD)</a>. O email é necessário para criar uma conta ou receber novidades; se não o forneceres, podes continuar a explorar o site e os treinos como visitante.</p>
        <Link href="/" className="action-button action-button-secondary">Voltar à página inicial</Link>
      </article>
    </main>
  );
}

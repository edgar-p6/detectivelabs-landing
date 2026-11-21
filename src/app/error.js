'use client';

export default function ErrorPage({ reset }) {
  return <main className="account-page"><section className="account-panel"><h1>Não foi possível carregar esta página.</h1><p role="alert">Verifica a ligação e tenta novamente. Os teus resultados guardados não foram alterados.</p><button type="button" className="btn-primary" onClick={reset}>Tentar novamente</button></section></main>;
}

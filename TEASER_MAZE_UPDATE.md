# Cartaz e labirinto — branch de testes

O cartaz mantém as dimensões existentes do contentor. Duas imagens com enquadramentos próprios (retrato no computador, panorâmica até 768 px) preenchem a área com `object-fit: cover`. O título e a frase de teaser são sobreposições HTML.

## Imagens

Origem: fotografia fornecida pelo utilizador, `foto festa.png`. Adaptações geradas com o gerador de imagens da OpenAI:

- `public/cases/feliz-aniversario-teaser-portrait.png`
- `public/cases/feliz-aniversario-teaser-wide.png`

Instruções de geração: preservar as cinco personagens, identidades, expressões e vestuário; expandir o jardim ao anoitecer, com iluminação quente e atmosfera de mistério; criar espaço para o título no formato retrato e manter todas as personagens no centro do formato panorâmico. Sem texto incorporado, personagens adicionais, armas ou sangue.

## Labirinto

Grelha de 21 × 21, 13 becos sem saída e três postos obrigatórios, em qualquer ordem. O menor percurso completo tem 224 movimentos. A saída fica bloqueada até os três postos estarem ativos. Setas, WASD e botões táteis; contador, percurso opcional e reinício.

Cliente e servidor partilham o mapa e as regras. O servidor reconstrói o percurso recebido, recusa paredes, saída antecipada e movimentos após terminar, mantendo o limite de 4096 movimentos. Os testes cobrem conectividade, postos, solução completa e percursos inválidos.

Os resultados anteriores e os 150 pontos do jogo são preservados; repetir não atribui novos pontos. Os tempos antigos pertencem ao mapa anterior e não são diretamente comparáveis com os novos.

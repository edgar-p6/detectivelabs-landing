# Detective Labs

Direction approved by the owner: Noir contemporâneo.

Use charcoal surfaces, warm pale text and a muted lime accent. The main action receives the accent; secondary actions use an outline or an underlined link. No decorative glows, gradients, generic icons or invented evidence.

Energy 2 / rhythm 3 / motion 1. Strong, compact headings; sentence-case navigation and labels; readable body copy. Motion is limited to immediate interaction feedback, with a reduced-motion fallback.

The existing Caso #01, “Feliz Aniversário”, is the homepage's subject. Its preparation status must remain clear. Free training is the primary action while the paid case is unavailable. Do not invent dates, prices, testimonials or proof materials.

Tokens and shared adjustments live in `src/app/noir.css`, imported after the existing game styles. The inherited stylesheet remains to preserve game layouts. Forms use visible labels, explicit loading/error/success feedback and high-contrast focus and field boundaries. Training cards use native buttons; dialogs keep keyboard focus and close with Escape.

Pages share the theme, navigation and container width. Keep existing authentication, subscription and progress storage connections. The current worktree is `feature/enigmas-gratuitos`; production is separate.

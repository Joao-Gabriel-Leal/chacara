insert into public.event_settings (
  name,
  tagline,
  event_date,
  location,
  hero_title,
  hero_subtitle,
  total_cost,
  amount_per_person,
  pix_instructions
) values (
  'Chacara Hub',
  'Fim de semana premium entre amigos, com caos organizado.',
  '2026-12-12T12:00:00-03:00',
  'Chacara Horizonte, Mairinque - SP',
  'O hub oficial da chacara',
  'Tudo em um lugar so: pagamento, quartos, fotos, mural e jogos.',
  4800,
  240,
  'Enviar PIX para pix@chacarahub.dev e anexar comprovante no app.'
);

insert into public.rooms (name, capacity, vibe, badge) values
  ('Vista Piscina', 4, 'sol da manha e acesso rapido ao caos', 'Premium Deck'),
  ('Suite do Churras', 4, 'perto da churrasqueira e do som', 'Smoke Club'),
  ('Refugio da Resenha', 4, 'onde o after comeca', 'After Safehouse'),
  ('Ninho da Logistica', 4, 'saida rapida para mercado e transporte', 'Ops Base'),
  ('Salao Flex', 4, 'acomoda quem decide em cima da hora', 'Wildcard');

insert into public.external_albums (title, href, description) values
  ('Dia 1', 'https://photos.google.com', 'Chegada, quartos e primeiro churrasco.'),
  ('Piscina & Sunset', 'https://drive.google.com', 'Arquivos em alta para quem quer baixar tudo.'),
  ('Madrugada Cinematica', 'https://photos.google.com', 'As melhores da madrugada.');

insert into public.polls (title, description, status) values
  ('Tema da noite de sabado', 'Escolha o mood principal do after.', 'active'),
  ('Cafe da manha de domingo', 'Pra nao sofrer no dia seguinte.', 'active');

-- Create content table
CREATE TABLE IF NOT EXISTS content (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Seed initial content for all sections
-- Hero Section
INSERT OR REPLACE INTO content (key, value) VALUES
  ('hero_title', 'En drivande kraft genom hela investeringsprojektets alla faser. Resultat börjar med människor.'),
  ('hero_subtitle', 'We make stuff work'),
  ('hero_description', 'This is a different text');

-- About Section
INSERT OR REPLACE INTO content (key, value) VALUES
  ('about_heading', 'Om Pollux'),
  ('about_subheading', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'),
  ('about_intro_heading', 'Vårt engagemang utmärker oss'),
  ('about_intro_text', 'Pollux startade 2017 av erfarna projektledningskonsulter som alla delar filosofin att framgångsrika industriprojekt inte bara bygger på teknik och struktur, utan på människors förmåga att skapa bestående värden. När vi tar oss an ett uppdrag, vare sig det gäller att förverkliga en ny industrianläggning, modernisera en befintlig produktion eller genomföra en utredande förstudie, så tar vi ansvar för hela projektets livscykel.

Genom åren har vi haft förmånen att samarbeta med företag som delar vår syn på att långsiktig affärsnytta uppstår när människor får rätt förutsättningar att bidra med engagemang, kompetens och ansvar. Det är så visioner blir till verklighet och värde skapas. Utifrån det perspektivet är vår ambition att vara en självklar del av den förändring som formar svensk industri, där tekniska framsteg och värderingsstyrda arbetssätt går hand i hand.');

-- Services Section
INSERT OR REPLACE INTO content (key, value) VALUES
  ('services_heading', 'Projektledning'),
  ('services_subheading', 'En drivande kraft genom hela investeringsprojektets alla faser'),
  ('services_text', 'We offer comprehensive web development, cloud infrastructure setup, and digital transformation consulting. Our goal is to deliver solutions that are scalable, maintainable, and perfectly aligned with your business objectives.'),
  ('services_intro_heading', 'Vi brinner vi för att göra skillnad'),
  ('services_intro_text', 'Behöver du hjälp att definiera, motivera och genomföra dina planerade investeringar? Vi tillför det engagemang, den erfarenhet och det ledarskap som krävs för att förverkliga dina idéer. Vi är proffs på projektledning och driver dina projekt från de första tankarna till en fullt fungerande anläggning.'),
  ('services_card1_heading', 'Förstudier'),
  ('services_card1_text', 'I förstudierna klargör vi projektets omfattning, analyserar nuläget, strukturerar innehållet och kartlägger intressenter. Vi bedömer affärsnyttan, jämför olika lösningsalternativ, tydliggör krav och tar fram en första plan för genomförandet.'),
  ('services_card2_heading', 'Planering & Projektering'),
  ('services_card2_text', 'I förstudierna klargör vi projektets omfattning, analyserar nuläget, strukturerar innehållet och kartlägger intressenter. Vi bedömer affärsnyttan, jämför olika lösningsalternativ, tydliggör krav och tar fram en första plan för genomförandet.'),
  ('services_card3_heading', 'Genomförande'),
  ('services_card3_text', 'I förstudierna klargör vi projektets omfattning, analyserar nuläget, strukturerar innehållet och kartlägger intressenter. Vi bedömer affärsnyttan, jämför olika lösningsalternativ, tydliggör krav och tar fram en första plan för genomförandet.');

-- Contact Section
INSERT OR REPLACE INTO content (key, value) VALUES
  ('contact_heading', 'Kontakt'),
  ('contact_subheading', 'För mer information om hur vi kan hjälpa ert projekt.'),
  ('contact_email', 'info@pollux.se'),
  ('contact_phone', '+46 (0)70 5327165');

-- Clients Section
INSERT OR REPLACE INTO content (key, value) VALUES
  ('clients_heading', 'Våra kunder'),
  ('clients_subheading', 'Some of the');

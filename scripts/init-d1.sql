-- Create content table
CREATE TABLE IF NOT EXISTS content (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Seed initial content for all sections
-- Hero Section
INSERT OR REPLACE INTO content (key, value) VALUES
  ('hero_title', 'Resultat börjar med människor.');
  
-- About Section
INSERT OR REPLACE INTO content (key, value) VALUES
  ('about_heading', 'Teknik och affärsnytta'),
  ('about_subheading', 'Det börjar alltid med människor.'),
  ('about_intro_heading', 'Om Pollux'),
  ('about_intro_text', 'Pollux startade 2017 av erfarna projektledningskonsulter som alla delar filosofin att framgångsrika industriprojekt inte bara bygger på teknik och struktur, utan på människors förmåga att skapa bestående värden. När vi tar oss an ett uppdrag, vare sig det gäller att förverkliga en ny industrianläggning, modernisera en befintlig produktion eller genomföra en utredande förstudie, så tar vi ansvar för hela projektets livscykel. Genom åren har vi haft förmånen att samarbeta med företag som delar vår syn på att långsiktig affärsnytta uppstår när människor får rätt förutsättningar att bidra med engagemang, kompetens och ansvar. Det är så visioner blir till verklighet och värde skapas. Utifrån det perspektivet är vår ambition att vara en självklar del av den förändring som formar svensk industri, där tekniska framsteg och värderingsstyrda arbetssätt går hand i hand.');

-- Services Section
INSERT OR REPLACE INTO content (key, value) VALUES
  ('services_heading', 'Erfarna projektledare'),
  ('services_subheading', 'Flexibel samverkan människor emellan'),
  ('services_intro_heading', 'Vårt erbjudande'),
  ('services_intro_text', 'Vi är ett konsultbolag som hjälper våra uppdragsgivare att förverkliga investeringar i komplexa industriprojekt, från första idé till en färdigställd anläggning. Ingen kund är den andra lik och därför arbetar vi med skräddarsydda lösningar formade efter kundens behov, förutsättningar och önskemål. Vi är med från de första strategiska vägvalen till de operativa beslut som säkrar genomförandet. Våra uppdrag sträcker sig oftast över flera år så i slutändan handlar det om samverkan mellan människor som alla strävar åt samma håll.'),
  ('services_card1_heading', 'Fas 1 - Förstudier'),
  ('services_card1_text', 'I förstudierna klargör vi projektets omfattning, analyserar nuläget, strukturerar innehållet och kartlägger intressenter. Vi bedömer affärsnyttan, jämför olika lösningsalternativ, tydliggör krav och tar fram en första plan för genomförandet.'),
  ('services_card2_heading', 'Fas 2 - Planering & Projektering'),
  ('services_card2_text', 'Vi driver projektet framåt under planeringsfasen, som omfattar projektering, upphandling och förberedelser inför genomförandet. Vår roll är att skapa struktur, engagemang och framdrift – så att projektet, efter ett positivt investeringsbeslut, är redo att realiseras.'),
  ('services_card3_heading', 'Fas 3 - Genomförande'),
  ('services_card3_text', 'Efter en noggrann planering leder vi projektets genomförande på bästa sätt. Vi följer upp, säkerställer kvalitet och hanterar de utmaningar som uppstår – alltid med målet att leverera enligt plan.');

-- Contact Section
INSERT OR REPLACE INTO content (key, value) VALUES
  ('contact_heading', 'Kontakt'),
  ('contact_subheading', 'För mer information om hur vi kan hjälpa er.'),
  ('contact_name', 'VD, Olle Bjurström'),
  ('contact_email', 'olle@pollux.se'),
  ('contact_phone', '070-532 71 65');

-- Clients Section
INSERT OR REPLACE INTO content (key, value) VALUES
  ('clients_heading', 'Värdeskapande kundrelationer'),
  ('clients_subheading', 'En investering i humankapital'),
  ('clients_intro_heading', 'Kunder'),
  ('clients_intro_text', 'Vi har haft förmånen att genomföra uppdrag för företag i flera olika branscher, och oavsett projekt, så har kärnan alltid varit densamma: samarbetet mellan människor som vill åstadkomma något tillsammans. För det är i miljöer där människor trivs som verklig affärsnytta skapas.'),
  ('clients_card1_heading', 'Stockholm Exergi'),
  ('clients_card1_text', 'Stockholm Exergi förser stora delar av Stockholmsregionen med energi: fjärrvärme, ibland el & kyla, samt tar hand om avfall och restvärme. Pollux har agerat som huvudprojektledare för åtskilliga investeringsprojekt, från idé till färdig anläggning.'),
  ('clients_card2_heading', 'Stockholms Hamnar'),
  ('clients_card2_text', 'Stockholms Hamnar sköter och utvecklar Stockholms hamnar och kajer för färje-, kryssnings- och containertrafik samt skärgårdstrafik. Pollux har ansvarat för framtagandet av en förstudie med målsättning att hitta en ny verksamhetsutövare i en del av Norra Värtahamnen.'),
  ('clients_card3_heading', 'Zander & Ingeström'),
  ('clients_card3_text', 'Zander & Ingeström är ett ledande företag inom pump- och värmeteknik som erbjuder produkter och lösningar inom energi- och flödesteknik. Pollux har ansvarat för att hitta nya leverantörer på kritiska komponenter, samt bistått med att utveckla en modulär produktplattform för deras industriella elpannor.');

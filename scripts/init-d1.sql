-- Create content table
CREATE TABLE IF NOT EXISTS content (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Seed initial content for all sections
-- Hero Section
INSERT OR REPLACE INTO content (key, value) VALUES
  ('hero_title', 'Hello world'),
  ('hero_subtitle', 'We make stuff work'),
  ('hero_description', 'This is a different text');

-- About Section
INSERT OR REPLACE INTO content (key, value) VALUES
  ('about_heading', 'About Us'),
  ('about_text', 'We are a company dedicated to creating innovative solutions that help businesses thrive in the digital age. Our team of experts brings years of experience and passion to every project.');

-- Services Section
INSERT OR REPLACE INTO content (key, value) VALUES
  ('services_heading', 'Our Services'),
  ('services_text', 'We offer comprehensive web development, cloud infrastructure setup, and digital transformation consulting. Our goal is to deliver solutions that are scalable, maintainable, and perfectly aligned with your business objectives.');

-- Contact Section
INSERT OR REPLACE INTO content (key, value) VALUES
  ('contact_heading', 'Get In Touch'),
  ('contact_email', 'hello@example.com'),
  ('contact_phone', '+1 (555) 123-4567');

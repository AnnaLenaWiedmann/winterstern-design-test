# Der Fall Winterstern

Private Entwicklungsfassung der interaktiven Adventskrimi-Website.

## Seiten
- `/` – Spieleransicht
- `/spielleitung.html` – Verwaltung

## Betrieb
Die Seiten sind statische HTML-Dateien und werden auf Vercel ohne Build-Schritt bereitgestellt. Die Daten sind in Supabase gespeichert. Im Quellcode befindet sich nur der **öffentliche** Supabase-Publishable-Key; keine geheimen Server- oder Datenbank-Schlüssel hochladen.

## Wichtige Hinweise
- Eine private GitHub-Ablage macht die Vercel-Website **nicht** automatisch privat. Die Website wird über Supabase-Authentifizierung geschützt.
- Die aktuelle Fassung dient der Entwicklung. Vor der Freigabe für den Spieler sind Zugangsschutz, Sicherheitsregeln, private Medien und die Freischaltung unveröffentlichter Inhalte zu prüfen.
- Zugangsdaten, geheime API-Keys und Datenbank-Passwörter niemals in dieses Repository hochladen.

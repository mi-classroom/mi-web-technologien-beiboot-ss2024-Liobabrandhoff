# Verwende ein offizielles Node.js-Image als Basis
FROM node:latest

# Erstelle ein Arbeitsverzeichnis
WORKDIR /app

# Kopiere package.json und package-lock.json
COPY package*.json ./

# Installiere Abhängigkeiten
RUN npm install

# Kopiere den Rest des Anwendungscodes
COPY . .

# Exponiere den Port, auf dem die App läuft
EXPOSE 8000

# Starte die Anwendung
CMD ["node", "server.js"]
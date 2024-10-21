# Utiliser l'image Node pour la construction et l'exécution
FROM node:20

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le reste du code
COPY . .

# Exposer le port 4200 pour le développement
EXPOSE 4200

# Démarrer l'application Angular en mode développement
CMD ["npm", "run", "start", "--", "--host", "0.0.0.0", "--port", "4200"]

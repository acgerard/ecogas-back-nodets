# Ecogas back
Backend for the Ecogas project
Based on NodeJs and Express in Typescript.

Offers REST services for the resources stations and measures.

## Run locally
- start db service :
docker-compose up db
  
- start node
npm run start-dev
  
The server creates a user admin@ecogas.com with password changeit

## Github Actions
Automatic deployement on o2Switch on push on master branch.

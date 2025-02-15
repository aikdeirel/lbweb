FROM node:20-slim AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-slim AS runtime

WORKDIR /app
COPY --from=build /app/dist/ ./dist/
COPY --from=build /app/package.json .
COPY --from=build /app/node_modules/ ./node_modules/

ENV HOST=0.0.0.0
ENV PORT=8080

EXPOSE 8080
CMD [ "node", "./dist/server/entry.mjs" ]
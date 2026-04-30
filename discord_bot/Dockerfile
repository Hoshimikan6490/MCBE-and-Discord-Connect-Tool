FROM node:24-alpine

WORKDIR /app

# Copy app files (excluded files are controlled by .dockerignore).
COPY . .

RUN npm ci --omit=dev

ENV NODE_ENV=production
ENV PORT=8000

EXPOSE 8000

CMD ["npm", "run", "main"]

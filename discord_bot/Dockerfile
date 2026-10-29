FROM node:26

WORKDIR /app

# Copy app files (excluded files are controlled by .dockerignore).
COPY . .

RUN npm ci --omit=dev

ENV NODE_ENV=production
ENV PORT=8000

EXPOSE 8000

CMD ["npm", "run", "main"]

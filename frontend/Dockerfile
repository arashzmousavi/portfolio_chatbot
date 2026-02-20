# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# نصب فقط dependencies
COPY package*.json ./
RUN npm install

# کپی کل پروژه
COPY . .

# Build کردن Next.js
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# کپی فایل‌ها از Build Stage
COPY --from=builder /app ./

# نصب فقط production dependencies
RUN npm install --production

# کپی entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# پورت پیش‌فرض Next.js
EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]

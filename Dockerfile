# สร้าง Image จาก node:18-alpine
FROM node:18-alpine

# สร้าง Directory ที่จะเก็บโปรเจค
RUN mkdir -p /usr/src/app

# กำหนด Working Directory
WORKDIR /usr/src/app

# Copy package.json ไปที่ Working Directory
COPY package.json /usr/src/app

# ลง Dependencies
RUN npm install

# Copy โปรเจคไปที่ Working Directory
COPY . /usr/src/app

# กำหนด Port ที่จะใช้
EXPOSE 8080

# รันโปรเจค
CMD ["npm", "start"]

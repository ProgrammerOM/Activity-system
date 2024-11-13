# ขั้นตอนที่ 1: เลือก base image
FROM node:16

# ขั้นตอนที่ 2: กำหนด working directory ใน container
WORKDIR /usr/src/app

# ขั้นตอนที่ 3: คัดลอกไฟล์ package.json และ package-lock.json ไปยัง working directory
COPY package*.json ./

# ขั้นตอนที่ 4: ติดตั้ง dependencies ที่ระบุใน package.json
RUN npm install

# ขั้นตอนที่ 5: คัดลอกไฟล์ทั้งหมดในโปรเจกต์ไปยัง container
COPY . .

# ขั้นตอนที่ 6: กำหนดพอร์ตที่ container จะฟัง (พอร์ต 8000)
EXPOSE 8000

# ขั้นตอนที่ 7: รันแอปพลิเคชัน
CMD ["npm", "start"]

# 使用官方Node.js镜像作为基础
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制项目文件
COPY . .

# 构建生产版本
RUN npm run build

# 暴露端口
EXPOSE 30001

# 启动应用
CMD ["npm", "start"]

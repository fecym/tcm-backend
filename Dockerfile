# 使用Node.js的官方基础镜像
FROM node:16

# 设置工作目录
WORKDIR /app

# 复制构建后的文件到工作目录
COPY dist/ ./dist

# 拷贝PM2配置文件
COPY pm2.json .

COPY package*.json ./

COPY .env.* ./

COPY node_modules/ ./node_modules

RUN npm install -g pm2 && \
    mkdir -p log && \
    chmod -R 777 log


# 暴露应用程序使用的端口
EXPOSE 4000

# 使用PM2启动应用程序
CMD ["pm2-runtime", "start", "pm2.json"]
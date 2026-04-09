# 非遗数字馆（Next.js 全栈）

前台展示非遗条目，管理员后台维护内容；访客可投稿，管理员在「待审核」中通过或拒绝。

数据库为 **PostgreSQL**。图片：生产环境用 **Vercel Blob**；本地未配置 Blob 时写入 `public/uploads/`。

## 本地运行（两种方式任选）

### 方式 A：Docker 本地 Postgres（无需注册 Neon）

1. 安装 [Docker Desktop](https://www.docker.com/products/docker-desktop)。
2. 复制环境变量：将 `.env.example` 复制为 `.env`，默认已指向本机 PostgreSQL（与 `docker-compose.yml` 一致）。
3. 启动数据库并建表、种子数据：

   ```bash
   npm install
   npm run docker:up
   npx prisma migrate deploy
   npm run db:seed
   ```

4. `npm run dev`，打开 [http://localhost:3000](http://localhost:3000)

默认管理员：`admin@example.com` / `changeme`（可在 `.env` 中改 `ADMIN_EMAIL`、`ADMIN_PASSWORD` 后重新 `npm run db:seed`）。

**一条命令建表+种子**（在已 `docker:up` 且 `.env` 正确时）：`npm run db:setup`

### 方式 B：Neon 云数据库

1. 在 [Neon](https://neon.tech) 创建项目，复制连接串（含 `sslmode=require`）。  
2. 在 `.env` 中设置 `DATABASE_URL=...`（Neon 的串）。  
3. `npm install` → `npx prisma migrate deploy` → `npm run db:seed` → `npm run dev`。

**本地仅检查编译（不连库）**：`npm run build:local`

## Vercel 部署

### 1. 准备代码仓库

将项目推送到 GitHub / GitLab / Bitbucket。

### 2. 连接 Vercel

1. 打开 [vercel.com](https://vercel.com) → **Add New** → **Project** → 导入仓库。  
2. **Framework Preset** 选 Next.js，构建命令保持默认 `npm run build`（已包含 `prisma migrate deploy`）。  
3. 在 **Environment Variables** 中添加：

| 变量名 | 说明 |
|--------|------|
| `DATABASE_URL` | Neon 的 Postgres 连接串（不要用本地 `localhost`） |
| `AUTH_SECRET` | 与本地相同或新生成的随机长密钥 |
| `AUTH_URL` | 部署完成后的站点地址，如 `https://你的项目.vercel.app`（建议填写） |
| `BLOB_READ_WRITE_TOKEN` | 见下方 Blob 步骤 |

### 3. 创建 Vercel Blob（图片持久化）

1. 在 Vercel 项目 → **Storage** → **Create** → 选 **Blob**。  
2. 创建后与当前项目 **Connect**，会自动注入 `BLOB_READ_WRITE_TOKEN`。  
3. 重新部署一次（或 Redeploy）。

若不配置 Blob，生产环境上传会失败（无持久磁盘），**务必配置 Blob**。

### 4. 首次部署后的数据

构建阶段会执行 `prisma migrate deploy` 建表。创建管理员与示例数据：在本地把 `.env` 的 `DATABASE_URL` 临时改为 **与 Vercel 相同的 Neon 连接串**，然后执行：

```bash
npm run db:seed
```

或在 Vercel → **Functions** / 使用 `vercel env pull` 拉取环境后再执行 seed。

### 5. 常见问题

- **登录跳转异常**：检查 `AUTH_URL` 是否与浏览器地址一致（含 `https`）。  
- **数据库连接失败**：确认 Neon 允许访问、连接串含 `sslmode=require`。  
- **上传 500**：确认已设置 `BLOB_READ_WRITE_TOKEN` 并已 Redeploy。

## 脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 开发服务器 |
| `npm run build` | 生产构建（含 `migrate deploy`，需有效 `DATABASE_URL`） |
| `npm run build:local` | 仅 generate + next build，不执行迁移 |
| `npm run docker:up` | 启动 Docker 中的 Postgres |
| `npm run db:setup` | `migrate deploy` + `db:seed` |
| `npm run db:seed` | 种子数据 |
| `npx prisma migrate dev` | 本地开发迁移（改 schema 时用） |

## 从旧版 SQLite 迁移说明

若你曾使用 `file:./dev.db`，请改用 PostgreSQL（Docker 或 Neon），并重新执行 `migrate deploy` 与 `db:seed`；旧 `dev.db` 不会自动导入。

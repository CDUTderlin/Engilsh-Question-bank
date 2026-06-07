# Snowy English Server

This is the backend API for the WeChat Mini Program.

## Local setup

```bash
cd server
npm install
Copy-Item .env.example .env
npm run dev
```

Health check:

```bash
curl http://127.0.0.1:3100/health
```

Mock WeChat login while developing locally:

```bash
curl -X POST http://127.0.0.1:3100/api/auth/wechat-login -H "Content-Type: application/json" -d "{\"code\":\"mock-code\"}"
```

Use the returned token:

```bash
curl http://127.0.0.1:3100/api/me -H "Authorization: Bearer YOUR_TOKEN"
```

## Production setup

1. Set these values in `server/.env`:

```text
NODE_ENV=production
PORT=3100
WECHAT_APPID=your-mini-program-appid
WECHAT_SECRET=your-mini-program-appsecret
JWT_SECRET=use-a-long-random-string
WECHAT_LOGIN_MOCK=false
```

2. Start the server:

```bash
npm install --omit=dev
npm start
```

3. Put HTTPS in front of it with Caddy/Nginx/IIS reverse proxy:

```text
api.your-domain.com -> 127.0.0.1:3100
```

4. Add `https://api.your-domain.com` to the WeChat Mini Program request legal domains.

Do not put `WECHAT_SECRET` in Mini Program frontend code.

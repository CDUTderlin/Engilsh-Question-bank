const fs = require('fs')
const path = require('path')

const projectConfigPath = path.resolve(__dirname, '..', 'dist', 'build', 'mp-weixin', 'project.config.json')
const appId = String(process.env.UNI_WX_APPID || '').trim()

if (!fs.existsSync(projectConfigPath)) {
  console.warn('[mp-weixin] project.config.json not found, skipping appid injection.')
  process.exit(0)
}

const projectConfig = JSON.parse(fs.readFileSync(projectConfigPath, 'utf8'))

if (appId) {
  projectConfig.appid = appId
  fs.writeFileSync(projectConfigPath, `${JSON.stringify(projectConfig, null, 2)}\n`, 'utf8')
  console.log(`[mp-weixin] Injected appid into ${projectConfigPath}`)
  process.exit(0)
}

console.warn('[mp-weixin] UNI_WX_APPID is empty. Keeping the generated tourist appid; set UNI_WX_APPID before release builds.')

import { app, BrowserWindow } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
process.env.APP_ROOT = path.join(__dirname, '..')
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

const VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

process.env.VITE_PUBLIC = VITE_PUBLIC

let win: BrowserWindow | null

function getIconPath(): string {
  if (process.platform === 'win32') return path.join(VITE_PUBLIC, 'icon.ico') // Windows
  if (process.platform === 'linux') return path.join(VITE_PUBLIC, 'icon.png') // Linux
  return path.join(VITE_PUBLIC, 'icon.icns')                                  // macOS
}

function createWindow() {
  win = new BrowserWindow({
    icon: getIconPath(),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'), // Script executado antes do renderer
      contextIsolation: true,  // Isola os contextos JS do main e do renderer (segurança)
      nodeIntegration: false,  // Impede acesso direto às APIs do Node no renderer
      sandbox: true,           // Restringe ainda mais as permissões do renderer
    },
  })

  // Em dev, carrega direto do servidor Vite (HMR); em prod, serve o HTML compilado
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL).catch(console.error)
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html')).catch(console.error)
  }
}

// No macOS o app permanece ativo mesmo sem janelas abertas (comportamento padrão do sistema)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})
// No macOS, recriar a janela ao clicar no ícone do dock quando não há janelas abertas
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)

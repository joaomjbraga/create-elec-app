import { contextBridge, ipcRenderer } from 'electron'

// --------- Expõe algumas APIs para o processo Renderer ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...params) => listener(event, ...params))
  }
  // Você pode expor outras APIs que precisar aqui.
  // ...
})

import { defineConfig, type Plugin } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import tailwindcss from '@tailwindcss/vite'

// Lê as fotos de public/categorias e as expõe em 'virtual:galleries':
// { "casas_urbanas/chacara-flora": ["/categorias/casas_urbanas/chacara-flora/1.jpg", ...] }
// Assim a galeria de cada imóvel mostra todas as fotos da pasta, sem contar à mão.
function galleries(): Plugin {
  const VIRTUAL_ID = 'virtual:galleries'
  const RESOLVED_ID = '\0' + VIRTUAL_ID
  const root = fileURLToPath(new URL('./public/categorias', import.meta.url))
  const isImage = (name: string) => /\.(jpe?g|png|webp|avif)$/i.test(name)

  const scan = () => {
    const result: Record<string, string[]> = {}
    const walk = (dir: string) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true })
      const images = entries
        .filter((e) => !e.isDirectory() && isImage(e.name)) // OneDrive pode marcar fotos como não-arquivo comum
        .map((e) => e.name)
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      const rel = path.relative(root, dir).split(path.sep).join('/')
      if (images.length) result[rel] = images.map((name) => `/categorias/${rel}/${name}`)
      entries.filter((e) => e.isDirectory()).forEach((e) => walk(path.join(dir, e.name)))
    }
    if (fs.existsSync(root)) walk(root)
    return result
  }

  return {
    name: 'galleries',
    resolveId: (id) => (id === VIRTUAL_ID ? RESOLVED_ID : undefined),
    load: (id) => (id === RESOLVED_ID ? `export default ${JSON.stringify(scan())}` : undefined),
    // Em desenvolvimento, recarrega a página quando fotos são adicionadas ou removidas
    configureServer(server) {
      server.watcher.add(root)
      const onChange = (file: string) => {
        if (!path.resolve(file).startsWith(root) || !isImage(file)) return
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID)
        if (mod) server.moduleGraph.invalidateModule(mod)
        server.ws.send({ type: 'full-reload' })
      }
      server.watcher.on('add', onChange)
      server.watcher.on('unlink', onChange)
    },
  }
}

export default defineConfig({
  plugins: [
    galleries(),
    tailwindcss(),
  ],
})

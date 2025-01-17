import { compareVersions } from '@/utils'
import { unionBy } from 'lodash'
import { CreateDesignDto, DesignComponentDto } from '../dto/create-design.dto'

interface PackageJson {
  dependencies: { name: string, version: string }[]
}

interface ImportType {
  packageName: string
  destructuring: boolean
  exportName: string
  aliasName: string
}

interface ComponentType {
  componentName: string
  props: Record<string, any>
}

interface StructureData {
  imports: ImportType[]
  components: ComponentType[]
}

export class GeneratorCode {
  source: CreateDesignDto
  packageJson: PackageJson = {
    dependencies: [],
  }

  structureData: StructureData = {
    imports: [],
    components: [],
  }

  constructor(source: CreateDesignDto) {
    this.source = source
    this.parse(source.components)
  }

  // 解析成结构化数据
  parse(source: DesignComponentDto[]) {
    source.forEach((item) => {
      const { component } = item
      const { sourceInfo } = component
      const { packageName, version, destructure, exportName, aliasName } = sourceInfo

      this.packageJson.dependencies.push({ name: packageName, version })
      this.structureData.imports.push({
        packageName,
        destructuring: destructure,
        exportName,
        aliasName,
      })
      this.structureData.components.push({
        componentName: aliasName || exportName,
        props: component.props,
      })
    })
  }

  // ${JSON.stringify(this.packageJson.dependencies)}
  /**
   * 生成 package.json 内容
   */
  generatePackageJson() {
    // 后面弄成模版进行填充
    return `
    {
      "name": "design-generator",
      "type": "module",
      "version": "1.0.0",
      "description": "${this.source.name}",
      "scripts": {
        "dev": "vite",
        "build": "tsc -b && vite build",
        "lint": "eslint .",
        "lint:fix": "eslint . --fix",
        "preview": "vite preview"
      },
      "dependencies": {
        "react": "^19.0.0",
        "react-dom": "^19.0.0",
${this.getDependencies()}
      },
      "devDependencies": {
        "@ant-design/v5-patch-for-react-19": "^1.0.3",
        "@antfu/eslint-config": "^3.12.1",
        "@eslint/js": "^9.17.0",
        "@types/lodash-es": "^4.17.12",
        "@types/node": "^22.10.5",
        "@types/react": "^19.0.2",
        "@types/react-dom": "^19.0.2",
        "@vitejs/plugin-react-swc": "^3.5.0",
        "eslint": "^9.17.0",
        "eslint-plugin-react-hooks": "^5.0.0",
        "eslint-plugin-react-refresh": "^0.4.16",
        "globals": "^15.14.0",
        "less": "^4.2.1",
        "postcss": "^8.4.49",
        "tailwindcss": "^3.4.17",
        "typescript": "~5.7.2",
        "typescript-eslint": "^8.18.2",
        "vite": "^6.0.5"
      }
    }
    `
  }

  // 生成代码
  generateCode() {
    return `
${this.generateImports()}

export default function App() {
  return (
    <div>${this.generateComponents()}    </div>
  )
}

`
  }

  generateIndex() {
    return `
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import '@ant-design/v5-patch-for-react-19'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

`
  }

  generateViteConfig() {
    return `
import path from 'node:path'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
  plugins: [
    react(),
  ],
})

`
  }

  generateHtml() {
    return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${this.source.name}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>

`
  }

  generateTsconfig() {
    return `
{
  "compilerOptions": {
    "target": "ES2020",
    "jsx": "react-jsx",
    "lib": [
      "ES2020",
      "DOM",
      "DOM.Iterable"
    ],
    "moduleDetection": "force",
    "useDefineForClassFields": true,
    "baseUrl": ".",
    "module": "ESNext",
    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    /* Linting */
    "strict": true,
    "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noEmit": true,
    "isolatedModules": true,
    "skipLibCheck": true
  },
  "include": [
    "src"
  ]
}

`
  }

  generateImports() {
    return this.structureData.imports.map((item) => {
      return `import { ${item.exportName} } from '${item.packageName}'`
    }).join('\n')
  }

  generateComponents() {
    return `${this.structureData.components.map((item) => {
      return `
      <${item.componentName} ${Object.entries(item.props).map(([key, value]) => `${key}="${value}"`).join(' ')} />`
    })}
`
  }

  getDependencies() {
    const dependencies = []

    this.packageJson.dependencies.forEach((item) => {
      const index = dependencies.findIndex(dep => dep.name === item.name)
      if (index === -1) {
        dependencies.push(item)
      }
      else {
        dependencies[index].version = compareVersions([dependencies[index].version, item.version])[0]
      }
    })

    return dependencies.map(item => `        "${item.name}": "${item.version}"`).join(',\n')
  }
}

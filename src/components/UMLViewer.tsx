// // UMLViewer.tsx
// import { useState } from 'react'
// import axios from 'axios'
// import { encode } from 'plantuml-encoder'

// export default function UMLViewer() {
//   const [inputCode, setInputCode] = useState('public class Persona { public string Nombre { get; set; } }')
//   const [uml, setUml] = useState('')
//   const [src, setSrc] = useState('')
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState('')

//   const handleSubmit = async () => {
//     try {
//       setIsLoading(true)
//       setError('')
      
//       const response = await axios.post('http://127.0.0.1:8000/api/generar-diagrama', {
//         codigo: inputCode,
//       })
      
//       const raw = response.data.uml
//       setUml(raw)

//       if (!raw.includes('@startuml') || !raw.includes('@enduml')) {
//         throw new Error('El UML recibido no es válido')
//       }

//       const encoded = encode(raw)
//       setSrc(`https://www.plantuml.com/plantuml/svg/${encoded}`)

//     } catch (error) {
//       console.error('Error al generar UML:', error)
//       setError('Error al generar el diagrama. Verifica la consola para más detalles.')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="p-4 space-y-4 max-w-4xl mx-auto">
//       <h1 className="text-2xl font-bold text-center mb-6">Generador de Diagramas UML</h1>
      
//       <div className="space-y-2">
//         <label htmlFor="code-input" className="block text-sm font-medium text-gray-700">
//           Ingresa tu código:
//         </label>
//         <textarea
//           id="code-input"
//           value={inputCode}
//           onChange={(e) => setInputCode(e.target.value)}
//           rows={8}
//           className="w-full border border-gray-300 rounded-md p-2 font-mono text-sm"
//           placeholder="Pega aquí tu código (ej: public class Persona { public string Nombre { get; set; } })"
//         />
//       </div>

//       <button
//         onClick={handleSubmit}
//         disabled={isLoading}
//         className={`px-4 py-2 rounded-md text-white ${isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
//       >
//         {isLoading ? 'Generando...' : 'Generar Diagrama UML'}
//       </button>

//       {error && (
//         <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
//           {error}
//         </div>
//       )}

//       {src && (
//         <div className="mt-6 space-y-2">
//           <h2 className="text-xl font-bold">Diagrama Generado:</h2>
//           <div className="border rounded-md p-2 bg-white">
//             <img 
//               src={src} 
//               alt="Diagrama UML" 
//               className="mx-auto" 
//               onError={() => setError('Error al cargar el diagrama. Verifica el código generado.')}
//             />
//           </div>
//         </div>
//       )}

//       {uml && (
//         <div className="mt-4 space-y-2">
//           <h2 className="text-lg font-semibold">Código PlantUML Generado:</h2>
//           <textarea
//             value={uml}
//             readOnly
//             rows={10}
//             className="w-full border border-gray-300 rounded-md p-2 font-mono text-sm bg-gray-50"
//           />
//         </div>
//       )}
//     </div>
//   )
// }


// // UMLViewer.tsx -------------------------------------------------------------------------------------------
// import { useState } from 'react'
// import axios from 'axios'
// import { encode } from 'plantuml-encoder'

// export default function UMLViewer() {
//   const [inputCode, setInputCode] = useState('public class Persona { public string Nombre { get; set; } }')
//   const [language, setLanguage] = useState('csharp')
//   const [diagramType, setDiagramType] = useState('class')
//   const [uml, setUml] = useState('')
//   const [src, setSrc] = useState('')
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState('')

//   const handleSubmit = async () => {
//     try {
//       setIsLoading(true)
//       setError('')
      
//       // Versión compatible con el nuevo backend
//       const response = await axios.post(
//         'http://127.0.0.1:8000/api/api/diagramas/generar',
//         {
//           codigo: inputCode,
//           lenguaje: language,
//           diagramas: [diagramType]  // Envía como array
//         }
//       );
      
//       // El nuevo endpoint devuelve {data: {class: "...", sequence: "..."}}
//       const raw = response.data.data[diagramType] || response.data.plantuml
//       setUml(raw)

//       if (!raw.includes('@startuml') || !raw.includes('@enduml')) {
//         throw new Error('El UML recibido no es válido')
//       }

//       const encoded = encode(raw)
//       setSrc(`https://www.plantuml.com/plantuml/svg/${encoded}`)

//     } catch (error) {
//       console.error('Error al generar UML:', error)
//       setError('Error al generar el diagrama. Verifica la consola para más detalles.')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="p-4 space-y-4 max-w-4xl mx-auto">
//       <h1 className="text-2xl font-bold text-center mb-6">Generador de Diagramas UML</h1>
      
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {/* Selector de Lenguaje */}
//         <div className="space-y-2">
//           <label htmlFor="language-select" className="block text-sm font-medium text-gray-700">
//             Lenguaje:
//           </label>
//           <select
//             id="language-select"
//             value={language}
//             onChange={(e) => setLanguage(e.target.value)}
//             className="w-full border border-gray-300 rounded-md p-2"
//           >
//             <option value="csharp">C#</option>
//             <option value="java">Java</option>
//             <option value="python">Python</option>
//           </select>
//         </div>

//         {/* Selector de Tipo de Diagrama */}
//         <div className="space-y-2">
//           <label htmlFor="diagram-select" className="block text-sm font-medium text-gray-700">
//             Tipo de Diagrama:
//           </label>
//           <select
//             id="diagram-select"
//             value={diagramType}
//             onChange={(e) => setDiagramType(e.target.value)}
//             className="w-full border border-gray-300 rounded-md p-2"
//           >
//             <option value="class">Clases</option>
//             <option value="sequence">Secuencia</option>
//           </select>
//         </div>
//       </div>

//       {/* Área de Código */}
//       <div className="space-y-2">
//         <label htmlFor="code-input" className="block text-sm font-medium text-gray-700">
//           Ingresa tu código:
//         </label>
//         <textarea
//           id="code-input"
//           value={inputCode}
//           onChange={(e) => setInputCode(e.target.value)}
//           rows={8}
//           className="w-full border border-gray-300 rounded-md p-2 font-mono text-sm"
//           placeholder="Pega aquí tu código (ej: public class Persona { public string Nombre { get; set; } })"
//         />
//       </div>

//       <button
//         onClick={handleSubmit}
//         disabled={isLoading}
//         className={`px-4 py-2 rounded-md text-white ${isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
//       >
//         {isLoading ? 'Generando...' : 'Generar Diagrama UML'}
//       </button>

//       {error && (
//         <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
//           {error}
//         </div>
//       )}

//       {src && (
//         <div className="mt-6 space-y-2">
//           <h2 className="text-xl font-bold">Diagrama Generado:</h2>
//           <div className="border rounded-md p-2 bg-white">
//             <img 
//               src={src} 
//               alt="Diagrama UML" 
//               className="mx-auto" 
//               onError={() => setError('Error al cargar el diagrama. Verifica el código generado.')}
//             />
//           </div>
//         </div>
//       )}

//       {uml && (
//         <div className="mt-4 space-y-2">
//           <h2 className="text-lg font-semibold">Código PlantUML Generado:</h2>
//           <textarea
//             value={uml}
//             readOnly
//             rows={10}
//             className="w-full border border-gray-300 rounded-md p-2 font-mono text-sm bg-gray-50"
//           />
//         </div>
//       )}
//     </div>
//   )
// }




// UMLViewer.tsx---------------------------------------------------------------------------------------------

import { useState } from 'react'
import axios from 'axios'
import { encode } from 'plantuml-encoder'

export default function UMLViewer() {
  const [inputCode, setInputCode] = useState('public class Persona { public string Nombre { get; set; } }')
  const [language, setLanguage] = useState('csharp')
  const [diagramType, setDiagramType] = useState('class')
  const [uml, setUml] = useState('')
  const [src, setSrc] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      setError('')
      
      const response = await axios.post(
        'https://diagramauml.onrender.com/api/api/diagramas/generar',
        {
          codigo: inputCode,
          lenguaje: language,
          diagramas: [diagramType]
        }
      );
      
      const raw = response.data.data[diagramType] || response.data.plantuml
      setUml(raw)

      if (!raw.includes('@startuml') || !raw.includes('@enduml')) {
        throw new Error('El UML recibido no es válido')
      }

      const encoded = encode(raw)
      setSrc(`https://www.plantuml.com/plantuml/svg/${encoded}`)

    } catch (error) {
      console.error('Error al generar UML:', error)
      setError('Error al generar el diagrama. Verifica la consola para más detalles.')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(uml)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {/* Container principal con glassmorphism */}
      <div className="max-w-6xl mx-auto backdrop-blur-lg bg-gray-800/50 rounded-2xl shadow-xl overflow-hidden border border-gray-700/30">
        {/* Header con gradiente animado */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 p-8 text-white animate-gradient-x">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">UML Diagram</h1>
              <p className="mt-2 text-purple-100">Transforma código en diagramas profesionales</p>
            </div>
            <div className="hidden md:block">
              <div className="flex space-x-2">
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium">C#</span>
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium">Java</span>
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium">Python</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="p-8 space-y-8">
          {/* Panel de controles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Selector de lenguaje */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Lenguaje</label>
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent appearance-none"
                >
                  <option value="csharp" className="bg-gray-800">C#</option>
                  <option value="java" className="bg-gray-800">Java</option>
                  <option value="python" className="bg-gray-800">Python</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Selector de tipo de diagrama */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Tipo de Diagrama</label>
              <div className="relative">
                <select
                  value={diagramType}
                  onChange={(e) => setDiagramType(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent appearance-none"
                >
                  <option value="class" className="bg-gray-800">Diagrama de Clases</option>
                  <option value="sequence" className="bg-gray-800">Diagrama de Secuencia</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Botón de generar */}
            <div className="flex items-end">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`w-full px-6 py-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center ${
                  isLoading
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-lg hover:shadow-pink-500/30'
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generar Diagrama
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Área de código */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-300">Código Fuente</label>
              <span className="text-xs px-2 py-1 bg-gray-700 rounded-md text-gray-300">{language.toUpperCase()}</span>
            </div>
            <div className="relative">
              <textarea
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                rows={10}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg font-mono text-sm text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder={`Ingresa tu código ${language} aquí...`}
              />
              <div className="absolute bottom-3 right-3">
                <button 
                  onClick={() => setInputCode('')}
                  className="p-1 rounded-md bg-gray-600/50 hover:bg-gray-500/50 transition-colors"
                  title="Limpiar código"
                >
                  <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="p-4 bg-rose-900/30 border-l-4 border-rose-500 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <svg className="h-5 w-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-rose-100">Error al generar el diagrama</h3>
                  <div className="mt-1 text-sm text-rose-200">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Diagrama generado */}
          {src && (
            <div className="mt-8 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h2 className="text-2xl font-bold text-white">Diagrama Generado</h2>
                <div className="flex space-x-3">
                  <a 
                    href={src.replace('/svg/', '/png/')} 
                    download="uml-diagram.png"
                    className="px-4 py-2 flex items-center bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg text-white transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Descargar PNG
                  </a>
                  <a 
                    href={`https://www.plantuml.com/plantuml/uml/${encode(uml)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 flex items-center bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg text-white transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Abrir en PlantUML
                  </a>
                </div>
              </div>
              
              <div className="border-2 border-gray-700 rounded-xl p-4 bg-gray-900 shadow-inner overflow-auto">
                <img 
                  src={src} 
                  alt="Diagrama UML Generado" 
                  className="mx-auto" 
                  onError={() => setError('Error al cargar el diagrama. Verifica el código generado.')}
                />
              </div>
            </div>
          )}

          {/* Código PlantUML */}
          {uml && (
            <div className="mt-8 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Código PlantUML</h2>
                <button 
                  onClick={copyToClipboard}
                  className="px-4 py-2 flex items-center bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg text-white transition-colors"
                >
                  {copied ? (
                    <>
                      <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      ¡Copiado!
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      Copiar Código
                    </>
                  )}
                </button>
              </div>
              
              <div className="relative">
                <pre className="p-4 bg-gray-800 rounded-lg overflow-auto max-h-96">
                  <code className="font-mono text-sm text-gray-300">{uml}</code>
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-gray-800/50 border-t border-gray-700/50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} UML Diagram - Todos los derechos reservados
            </p>
            <div className="mt-3 md:mt-0 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Términos</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacidad</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Contacto</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
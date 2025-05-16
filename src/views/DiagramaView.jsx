// UMLViewer.tsx -------------------------------------------------------------------------------------------
import { useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { encode } from 'plantuml-encoder'
import AuthContext from '../context/AuthContext';
import { API_ROUTES } from '../config/api';

export default function UMLViewer() {
  // Estado para el código y generación de diagramas
  const [inputCode, setInputCode] = useState('public class Persona { public string Nombre { get; set; } }')
  const [language, setLanguage] = useState('csharp')
  const [diagramType, setDiagramType] = useState('class')
  const [uml, setUml] = useState('')
  const [src, setSrc] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Estado para el manejo de proyectos
  const [projects, setProjects] = useState([])
  const [selectedProjectId, setSelectedProjectId] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [isLoadingProjects, setIsLoadingProjects] = useState(false)
  
  const { token } = useContext(AuthContext);

  // Cargar la lista de proyectos al montar el componente
  useEffect(() => {
    fetchProjects();
  }, []);

  // Función para obtener la lista de proyectos
  const fetchProjects = async () => {
    try {
      setIsLoadingProjects(true);
      setError('');
      
      console.log('Obteniendo proyectos con token:', token);
      
      const response = await axios.get(
        API_ROUTES.PROYECTOS, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Depurar la respuesta completa
      console.log('Respuesta completa de proyectos:', response);
      console.log('Datos de proyectos:', response.data);
      
      // Determinar la estructura de los datos recibidos
      let projectsData = response.data;
      
      // Si la respuesta tiene una propiedad específica donde están los proyectos
      if (response.data && response.data.proyectos) {
        projectsData = response.data.proyectos;
      }
      
      // Si la API devuelve un objeto en lugar de un array
      if (projectsData && !Array.isArray(projectsData) && typeof projectsData === 'object') {
        projectsData = Object.values(projectsData);
      }
      
      if (Array.isArray(projectsData) && projectsData.length > 0) {
        console.log('Proyectos encontrados:', projectsData.length);
        setProjects(projectsData);
        // Seleccionar el primer proyecto por defecto
        setSelectedProjectId(projectsData[0].id);
      } else {
        console.log('No se encontraron proyectos o el formato no es el esperado');
        setProjects([]);
      }
    } catch (error) {
      console.error('Error al obtener proyectos:', error);
      console.error('Detalles del error:', error.response?.data);
      setError('Error al cargar la lista de proyectos: ' + (error.message || 'Desconocido'));
      setProjects([]);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  // Función para crear un nuevo proyecto
  const createProject = async () => {
    try {
      if (!newProjectName.trim()) {
        setError('El nombre del proyecto no puede estar vacío');
        return;
      }
      
      setIsLoading(true);
      const response = await axios.post(
        API_ROUTES.CREAR_PROYECTO,
        {
          nombre: newProjectName,
          user_id: localStorage.getItem('userId') || '3fe2b3ab-740a-4883-a291-834d43e2da1f'
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log('Proyecto creado:', response.data);
      
      // Cerrar el modal y limpiar el nombre
      setShowModal(false);
      setNewProjectName('');
      
      // Recargar la lista de proyectos
      fetchProjects();
      
      return response.data.id;
    } catch (error) {
      console.error('Error al crear el proyecto:', error);
      console.error('Detalles del error:', error.response?.data);
      setError('Error al crear el proyecto: ' + (error.message || 'Desconocido'));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para crear un proyecto de ejemplo
  const createExampleProject = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await axios.post(
        API_ROUTES.CREAR_PROYECTO,
        {
          nombre: "Proyecto de prueba " + new Date().toLocaleTimeString(),
          user_id: localStorage.getItem('userId') || '3fe2b3ab-740a-4883-a291-834d43e2da1f'
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Proyecto de ejemplo creado:', response.data);
      fetchProjects();
      return response.data.id;
    } catch (error) {
      console.error('Error al crear proyecto de ejemplo:', error);
      console.error('Detalles del error:', error.response?.data);
      setError('Error al crear proyecto de ejemplo: ' + (error.message || 'Desconocido'));
    } finally {
      setIsLoading(false);
    }
  };
  // Función para generar el diagrama UML
  const handleGenerateDiagram = async () => {
    try {
      if (!selectedProjectId) {
        setError('Por favor, selecciona un proyecto primero');
        return;
      }
      
      setIsLoading(true);
      setError('');
      
      console.log('Datos enviados para generar diagrama:', {
        proyecto_id: selectedProjectId,
        codigo: inputCode,
        lenguaje: language,
        diagramas: [diagramType]
      });

      // Generar el diagrama con el ID del proyecto seleccionado
      const response = await axios.post(
        API_ROUTES.GENERAR_DIAGRAMA,
        {
          proyecto_id: selectedProjectId,
          codigo: inputCode,
          lenguaje: language,
          diagramas: [diagramType]
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Respuesta del servidor:', response.data);

      // La estructura real es {success: true, data: [{ contenido_plantuml: "..." }]}
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        // Buscar el diagrama del tipo solicitado en el array de datos
        const diagrama = response.data.data.find(item => 
          item.nombre?.toLowerCase().includes(diagramType) || 
          item.tipo === diagramType
        );
        
        if (diagrama && diagrama.contenido_plantuml) {
          const raw = diagrama.contenido_plantuml;
          setUml(raw);

          if (!raw.includes('@startuml') || !raw.includes('@enduml')) {
            throw new Error('El UML recibido no es válido');
          }

          const encoded = encode(raw);
          setSrc(`https://www.plantuml.com/plantuml/svg/${encoded}`);
        } else {
          throw new Error(`No se encontró un diagrama de tipo "${diagramType}" en la respuesta`);
        }
      } else {
        throw new Error('La respuesta del servidor no tiene el formato esperado');
      }
    } catch (error) {
      console.error('Error al generar UML:', error);
      console.error('Detalles del error:', error.response?.data);
      setError(`Error al generar el diagrama: ${error.message || 'Verifica la consola para más detalles'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Modal para crear un nuevo proyecto
  const ProjectModal = () => {
    if (!showModal) return null;
    
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Crear Nuevo Proyecto</h2>
          
          <div className="mb-4">
            <label htmlFor="new-project-name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Proyecto:
            </label>
            <input
              id="new-project-name"
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Ingresa el nombre del proyecto"
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              onClick={createProject}
              disabled={isLoading}
              className={`px-4 py-2 rounded-md text-white ${isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isLoading ? 'Creando...' : 'Crear Proyecto'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 space-y-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Generador de Diagramas UML</h1>
      
      {/* Sección de Proyectos */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Proyectos</h2>
          <div className="flex space-x-2">
            <button
              onClick={fetchProjects}
              disabled={isLoadingProjects}
              className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              {isLoadingProjects ? 'Cargando...' : 'Recargar'}
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Crear Proyecto
            </button>
          </div>
        </div>
        
        {isLoadingProjects ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : projects.length === 0 ? (
          <div>
            <p className="text-gray-500 py-2 mb-3">No hay proyectos disponibles.</p>
            <button
              onClick={createExampleProject}
              className="px-3 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
            >
              Crear Proyecto de Ejemplo
            </button>
            <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
              <p className="text-sm text-gray-600">Información de depuración:</p>
              <p className="text-xs text-gray-500 mt-1">- Token presente: {token ? 'Sí' : 'No'}</p>
              <p className="text-xs text-gray-500">- URL API: {import.meta.env.VITE_API_BASE_URL}/api/proyectos</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-3">
            {projects.map(project => (
              <div 
                key={project.id || 'sin-id'}
                onClick={() => setSelectedProjectId(project.id)}
                className={`p-3 border rounded-md cursor-pointer transition-colors ${
                  selectedProjectId === project.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{project.nombre || 'Proyecto sin nombre'}</h3>
                    {/* <p className="text-sm text-gray-500">ID: {project.id || 'Sin ID'}</p> */}
                  </div>
                  {selectedProjectId === project.id && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      Seleccionado
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Configuración del Diagrama */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Configuración del Diagrama</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Selector de Lenguaje */}
          <div className="space-y-2">
            <label htmlFor="language-select" className="block text-sm font-medium text-gray-700">
              Lenguaje:
            </label>
            <select
              id="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="csharp">C#</option>
              <option value="java">Java</option>
              <option value="python">Python</option>
            </select>
          </div>

          {/* Selector de Tipo de Diagrama */}
          <div className="space-y-2">
            <label htmlFor="diagram-select" className="block text-sm font-medium text-gray-700">
              Tipo de Diagrama:
            </label>
            <select
              id="diagram-select"
              value={diagramType}
              onChange={(e) => setDiagramType(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="class">Clases</option>
              <option value="sequence">Secuencia</option>
            </select>
          </div>
        </div>

        {/* Área de Código */}
        <div className="space-y-2 mb-4">
          <label htmlFor="code-input" className="block text-sm font-medium text-gray-700">
            Ingresa tu código:
          </label>
          <textarea
            id="code-input"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            rows={8}
            className="w-full border border-gray-300 rounded-md p-2 font-mono text-sm"
            placeholder="Pega aquí tu código (ej: public class Persona { public string Nombre { get; set; } })"
          />
        </div>

        <button
          onClick={handleGenerateDiagram}
          disabled={isLoading || !selectedProjectId}
          className={`px-4 py-2 rounded-md text-white ${
            isLoading || !selectedProjectId 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Generando...' : 'Generar Diagrama UML'}
        </button>
        {!selectedProjectId && (
          <p className="text-sm text-red-500 mt-2">Selecciona un proyecto primero</p>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Diagrama Generado */}
      {src && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Diagrama Generado:</h2>
          <div className="border rounded-md p-2 bg-white">
            <img 
              src={src} 
              alt="Diagrama UML" 
              className="mx-auto" 
              onError={() => setError('Error al cargar el diagrama. Verifica el código generado.')}
            />
          </div>
          
          {uml && (
            <div className="mt-4 space-y-2">
              <h3 className="text-lg font-semibold">Código PlantUML Generado:</h3>
              <textarea
                value={uml}
                readOnly
                rows={10}
                className="w-full border border-gray-300 rounded-md p-2 font-mono text-sm bg-gray-50"
              />
            </div>
          )}
        </div>
      )}

      {/* Modal para crear proyecto */}
      <ProjectModal />
    </div>
  )
}
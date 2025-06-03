import api from './api'

class DiagramService {
  /**
   * Genera un diagrama UML a partir de código fuente
   * @param {string} code - Código fuente para analizar
   * @param {string} languaje - Lenguaje de programación
   * @param {string} tipo_diagrama - Tipo de diagrama a generar
   * @returns {Promise<Object>} Datos del diagrama generado
   */
  async generateDiagram(code, languaje = 'python', tipo_diagrama = 'class') {
    try {
      console.log('Generando diagrama...', { languaje, tipo_diagrama })
      const response = await api.post('/diagramas/generar', {
        code,
        languaje,
        tipo_diagrama
      })

      return response.data
    } catch (error) {
      console.error('Error generando diagrama:', error)
      throw new Error(error.response?.data?.detail || 'Error al generar el diagrama')
    }
  }

  /**
   * Crea un nuevo diagrama UML
   * @param {Object} diagramData - Datos del diagrama
   * @returns {Promise<Object>} Diagrama creado
   */
  async createDiagram(diagramData) {
    try {
      console.log('Creando diagrama...', diagramData);

      const response = await api.post('/diagramas/crear', diagramData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error creando diagrama:', error)
      throw new Error(error.response?.data?.detail || 'Error al crear el diagrama')
    }
  }
  /**
   * Obtiene todos los diagramas de un proyecto
   * @param {string} proyectoId - ID del proyecto
   * @returns {Promise<Array>} Lista de diagramas
   */
  async getProjectDiagrams(projectId) {
    try {
      console.log('Obteniendo diagramas del proyecto:', projectId);
      const response = await api.get(`/diagramas/proyecto/${projectId}`);
      console.log('Diagramas obtenidos:', response.data);
      return response.data.diagramas || response.data || [];
    } catch (error) {
      console.error('Error al obtener los diagramas del proyecto:', error);
      throw new Error(error.response?.data?.detail || 'Error al obtener los diagramas del proyecto');
    }
  }

  /**
   * Obtiene todos los diagramas
   * @returns {Promise<Array>} Lista de todos los diagramas
   */
  async getAllDiagrams() {
    try {
      console.log('Obteniendo todos los diagramas...');
      const response = await api.get('/diagramas/');
      return response.data; // Retorna todos los diagramas
    } catch (error) {
      console.error('Error al obtener todos los diagramas:', error);
      throw error;
    }
  }

  /**
   * Obtiene un diagrama específico por ID
   * @param {string} diagramaId - ID del diagrama
   * @returns {Promise<Object>} Datos del diagrama
   */  async getDiagramById(diagramaId) {
    try {
      console.log('Obteniendo diagrama:', diagramaId)

      const response = await api.get(`/diagramas/${diagramaId}`)

      return response.data // Retorna el diagrama específico
    } catch (error) {
      console.error(`Error al obtener el diagrama con ID ${diagramaId}:`, error)
      throw error
    }
  }

  /**
   * Actualiza un diagrama existente
   * @param {string} diagramaId - ID del diagrama
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>} Diagrama actualizado
   */
  async updateDiagram(diagramaId, updateData) {
    try {
      console.log('Actualizando diagrama:', diagramaId)

      const response = await api.put(`/diagramas/${diagramaId}`, updateData)

      return response.data
    } catch (error) {
      console.error('Error actualizando diagrama:', error)
      throw new Error(error.response?.data?.detail || 'Error al actualizar el diagrama')
    }
  }

  /**
   * Elimina un diagrama
   * @param {string} diagramaId - ID del diagrama
   * @returns {Promise<void>}
   */
  async deleteDiagram(diagramaId) {
    try {
      console.log('Eliminando diagrama:', diagramaId)

      await api.delete(`/diagramas/${diagramaId}`)
    } catch (error) {
      console.error('Error eliminando diagrama:', error)
      throw new Error(error.response?.data?.detail || 'Error al eliminar el diagrama')
    }
  }

  /**
   * Genera la URL de imagen SVG de PlantUML
   * @param {string} plantUmlCode - Código PlantUML
   * @returns {string} URL de la imagen
   */
  generatePlantUmlImageUrl(plantUmlCode) {
    if (!plantUmlCode) return null

    try {
      // Codificar el código PlantUML para URL
      const encoded = btoa(unescape(encodeURIComponent(plantUmlCode)))
      return `https://www.plantuml.com/plantuml/svg/${encoded}`
    } catch (error) {
      console.error('Error generando URL de PlantUML:', error)
      return null
    }
  }

  /**
   * Valida el código PlantUML
   * @param {string} code - Código PlantUML a validar
   * @returns {boolean} True si es válido
   */
  validatePlantUmlCode(code) {
    if (!code || typeof code !== 'string') return false

    // Verificar que tenga las etiquetas básicas de PlantUML
    const hasStart = code.includes('@startuml') || code.includes('@startmindmap') || code.includes('@startgantt')
    const hasEnd = code.includes('@enduml') || code.includes('@endmindmap') || code.includes('@endgantt')

    return hasStart && hasEnd
  }
}

export const diagramService = new DiagramService()

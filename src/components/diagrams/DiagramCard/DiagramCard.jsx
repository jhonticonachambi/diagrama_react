import { useState } from 'react'
import { diagramService } from '../../../services/diagramService'
import Button from '../../common/Button/Button'
import ViewDiagramModal from '../ViewDiagramModal/ViewDiagramModal'
import EditDiagramModal from '../EditDiagramModal/EditDiagramModal'

const DiagramCard = ({ diagram, onDiagramUpdated, onDiagramDeleted, userRole }) => {  const [isExpanded, setIsExpanded] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  const canEdit = userRole === 'Propietario' || userRole === 'Editor'

  const formatDate = (dateString) => {
    if (!dateString) return "Fecha desconocida"
    
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return "Fecha inválida"
    }
  }

  const getTipoLabel = (tipo) => {
    const tipos = {
      'class': 'Diagrama de Clases',
      'sequence': 'Diagrama de Secuencia', 
      'activity': 'Diagrama de Actividad',
      'use_case': 'Casos de Uso',
      'component': 'Componentes',
      'deployment': 'Despliegue'
    }
    return tipos[tipo] || tipo
  }
  const handleViewDiagram = () => {
    setShowViewModal(true)
    setError(null)
  }

  const handleDownload = () => {
    if (!diagram.codigo_plantuml) return

    // Crear un archivo de texto con el código PlantUML
    const blob = new Blob([diagram.codigo_plantuml], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${diagram.nombre}.puml`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDelete = async () => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar el diagrama "${diagram.nombre}"?`)) {
      return
    }

    try {
      setIsLoading(true)
      await diagramService.deleteDiagram(diagram.id)
      onDiagramDeleted?.(diagram.id)
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = () => {
    setShowEditModal(true)
    setIsMenuOpen(false)
    setError(null)
  }
  const handleDiagramUpdated = (updatedDiagram) => {
    onDiagramUpdated?.(updatedDiagram)
  }

  return (
    <div className="relative bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col h-64 w-full min-w-0 overflow-hidden">
      {/* Botón de menú en la esquina superior derecha */}
      <div className="absolute top-2 right-2">
        <div className="relative">
          <button
            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <span className="sr-only">Abrir menú</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 text-gray-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12 12a.75.75 0 100-1.5.75.75 0 000 1.5zM12 17.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
              />
            </svg>
          </button>
          {isMenuOpen && (            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <ul className="py-1">
                {canEdit && (
                  <li>
                    <button
                      onClick={handleEdit}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Editar
                    </button>
                  </li>
                )}
                <li>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Ver versiones
                  </button>
                </li>
                <li>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Vista previa
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>      <div className="p-3 flex-grow">
        <div className="mb-2">
          <h3 className="text-base font-semibold text-gray-900 mb-1 whitespace-nowrap overflow-hidden text-ellipsis">
            {diagram.nombre}
          </h3>
          <div className="flex items-center space-x-2 mb-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              {getTipoLabel(diagram.tipo_diagrama)}
            </span>
            {diagram.es_publico && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                🌐 Público
              </span>
            )}
          </div>
          {diagram.descripcion && (
            <p className="text-sm text-gray-600 mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
              {diagram.descripcion}
            </p>
          )}
          <p className="text-xs text-gray-500">
            Creado el {formatDate(diagram.fecha_creacion)}
            {diagram.fecha_actualizacion && diagram.fecha_actualizacion !== diagram.fecha_creacion && (
              <span> • Actualizado el {formatDate(diagram.fecha_actualizacion)}</span>
            )}
          </p>
        </div>
      </div>      {/* Botón en la parte inferior */}
      <div className="border-t px-3 py-2 flex justify-center">
        <button
          onClick={handleViewDiagram}
          className="text-sm font-medium text-blue-600 hover:underline focus:outline-none"
        >
          Abrir diagrama
        </button>
      </div>

      {/* Modal para ver diagrama */}
      {showViewModal && (
        <ViewDiagramModal
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          diagramId={diagram.id}
        />
      )}

      {/* Modal para editar diagrama */}
      {showEditModal && (
        <EditDiagramModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          diagram={diagram}
          onDiagramUpdated={handleDiagramUpdated}
        />
      )}
    </div>
  )
}

export default DiagramCard

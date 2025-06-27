// composables/useExport.js
import { ref } from 'vue'
import * as XLSX from 'xlsx'

export const useExport = () => {
  const exportLoading = ref(false)

  // Exportar cronograma a Excel
  const exportCronogramaToExcel = async (data, plazoMeses = null) => {
    if (!data || !Array.isArray(data)) {
      console.error('No hay datos para exportar')
      return
    }

    try {
      exportLoading.value = true

      // Preparar datos para Excel
      const excelData = data.map(item => ({
        'Cuota': item.cuota,
        'Vencimiento': item.vcmto,
        'Saldo Inicial': item.saldo_inicial,
        'Capital': item.capital,
        'Interés': item.interes,
        'Cuota Neta': item.cuota_neta,
        'IGV': item.igv,
        'Total Cuota': item.total_cuota,
        'Saldo Final': item.saldo_final
      }))

      // Crear libro de Excel
      const ws = XLSX.utils.json_to_sheet(excelData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Cronograma de Pagos')

      // Ajustar el ancho de las columnas
      const wscols = [
        { wch: 8 },  // Cuota
        { wch: 12 }, // Vencimiento
        { wch: 15 }, // Saldo Inicial
        { wch: 12 }, // Capital
        { wch: 12 }, // Interés
        { wch: 12 }, // Cuota Neta
        { wch: 8 },  // IGV
        { wch: 12 }, // Total Cuota
        { wch: 15 }  // Saldo Final
      ]
      ws['!cols'] = wscols

      // Generar nombre del archivo
      const timestamp = new Date().toISOString().slice(0, 10)
      const fileName = plazoMeses 
        ? `cronograma_pagos_${plazoMeses}_meses_${timestamp}.xlsx`
        : `cronograma_pagos_${timestamp}.xlsx`
      
      // Descargar archivo
      XLSX.writeFile(wb, fileName)

      return { success: true, fileName }

    } catch (error) {
      console.error("Error exportando a Excel:", error)
      return { success: false, error }
    } finally {
      exportLoading.value = false
    }
  }

  // Exportar tabla genérica a Excel
  const exportTableToExcel = async (data, sheetName = 'Datos', fileName = null) => {
    if (!data || !Array.isArray(data)) {
      console.error('No hay datos para exportar')
      return { success: false, error: 'No hay datos para exportar' }
    }

    try {
      exportLoading.value = true

      // Crear libro de Excel
      const ws = XLSX.utils.json_to_sheet(data)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, sheetName)

      // Generar nombre del archivo si no se proporciona
      const timestamp = new Date().toISOString().slice(0, 10)
      const finalFileName = fileName || `export_${timestamp}.xlsx`
      
      // Descargar archivo
      XLSX.writeFile(wb, finalFileName)

      return { success: true, fileName: finalFileName }

    } catch (error) {
      console.error("Error exportando a Excel:", error)
      return { success: false, error }
    } finally {
      exportLoading.value = false
    }
  }

  // Exportar a CSV
  const exportToCSV = async (data, fileName = null) => {
    if (!data || !Array.isArray(data)) {
      console.error('No hay datos para exportar')
      return { success: false, error: 'No hay datos para exportar' }
    }

    try {
      exportLoading.value = true

      // Convertir a CSV
      const ws = XLSX.utils.json_to_sheet(data)
      const csv = XLSX.utils.sheet_to_csv(ws)

      // Crear blob y descargar
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      
      const timestamp = new Date().toISOString().slice(0, 10)
      const finalFileName = fileName || `export_${timestamp}.csv`
      
      link.href = URL.createObjectURL(blob)
      link.download = finalFileName
      link.click()

      return { success: true, fileName: finalFileName }

    } catch (error) {
      console.error("Error exportando a CSV:", error)
      return { success: false, error }
    } finally {
      exportLoading.value = false
    }
  }

  return {
    exportLoading,
    exportCronogramaToExcel,
    exportTableToExcel,
    exportToCSV
  }
}
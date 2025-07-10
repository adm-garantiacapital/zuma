import { ref } from 'vue'
import ExcelJS from 'exceljs'

export const useExport = () => {
  const exportLoading = ref(false)

  const exportCronogramaToExcel = async (data, plazoMeses = null) => {
    if (!data || !Array.isArray(data)) return

    exportLoading.value = true

    try {
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Cronograma de Pagos')

      // Logo SVG
      const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="115" height="32" viewBox="0 0 141 32" fill="none">
        <g clip-path="url(#clip0_2984_14683)">
          <path
                            d="M49.7217 19.0546C49.7217 22.6972 47.1846 26.3682 42.3372 26.3682C37.4898 26.3682 34.9527 22.683 34.9527 19.0546V1.05396H29.2266V19.3947C29.2266 22.8956 30.5447 26.0422 32.9542 28.2533C35.3213 30.4502 38.6663 31.655 42.3372 31.655C46.0224 31.655 49.3532 30.4502 51.7202 28.2533C54.1156 26.028 55.4479 22.8815 55.4479 19.3947V1.05396H49.7217V19.0546Z"
                            fill="#101010" />
                        <path
                            d="M25.9237 5.53285V1.05396H0.992159V6.11397H18.2699L0 26.3257V30.9179H26.9159V25.7729H7.6538L25.9237 5.53285Z"
                            fill="#101010" />
                        <path
                            d="M108.741 28.0548C107.012 28.0548 105.623 26.6658 105.623 24.9366V12.8464C105.623 5.47611 100.903 0.331055 94.142 0.331055C90.1734 0.331055 86.4599 2.17364 84.3197 5.16429C82.222 2.13111 79.288 0.331055 76.0564 0.331055C69.9617 0.331055 67.6372 5.16429 67.6372 5.16429V1.05391H57.9141V3.917H58.7787C60.5079 3.917 61.8969 5.30602 61.8969 7.03522V30.9179H71.62V28.0548H70.7554C69.0262 28.0548 67.6372 26.9067 67.6372 25.1917V12.7472C67.6372 8.77858 70.2735 5.64619 74.6532 5.64619C78.1683 5.64619 80.8896 8.50928 80.8896 12.6055V30.9179H90.6128V28.0548H89.7482C88.019 28.0548 86.63 26.6658 86.63 24.9366V12.7472C86.63 8.77858 89.2521 5.64619 93.6318 5.64619C97.2177 5.64619 99.8966 8.62267 99.8966 12.7472V30.9179H109.606V28.0548H108.741Z"
                            fill="#101010" />
                        <path
                            d="M135.274 1.05391V5.16429C135.274 5.16429 130.923 0.331055 124.446 0.331055C115.771 0.331055 108.713 7.262 108.713 15.9363C108.713 15.9646 108.713 15.9788 108.713 16.0072C108.713 16.0355 108.713 16.0497 108.713 16.078C108.713 24.7523 115.771 31.6833 124.446 31.6833C130.923 31.6833 135.274 26.8501 135.274 26.8501V30.9604H141.001V15.993V1.05391H135.274ZM135.274 16.0639C135.274 21.8893 130.54 26.6233 124.715 26.6233C118.89 26.6233 114.156 21.8893 114.156 16.0639C114.156 16.0355 114.156 16.0213 114.156 15.993C114.156 15.9646 114.156 15.9505 114.156 15.9221C114.156 10.0967 118.89 5.36272 124.715 5.36272C130.54 5.36272 135.274 10.0967 135.274 15.9221C135.274 15.9505 135.274 15.9646 135.274 15.993C135.26 16.0213 135.274 16.0355 135.274 16.0639Z"
                            fill="#101010" />
        </g>
        <defs>
          <clipPath id="clip0_2984_14683">
            <rect width="141" height="31.3381" fill="white" transform="translate(0 0.331055)" />
          </clipPath>
        </defs>
      </svg>`.trim()

      const imageId = workbook.addImage({
        base64: 'data:image/svg+xml;base64,' + btoa(logoSvg),
        extension: 'svg'
      })

      // Ajustar posición del logo (más centrado → columna B)
      // Ajustar posición del logo (más centrado → columna B)
      worksheet.addImage(imageId, {
        tl: { col: 0.5, row: 0.2 }, // posición más centrada
        ext: { width: 165, height: 48 } // tamaño exacto: 4.49 cm x 1.35 cm
      })


      // Título principal (A1:I3)
      worksheet.mergeCells('A1:G3')
      const titleCell = worksheet.getCell('A1')
      titleCell.value = 'CRONOGRAMA DE HIPOTECA'
      titleCell.font = { size: 14, bold: true, color: { argb: 'FFFFFFFF' } }
      titleCell.alignment = { horizontal: 'center', vertical: 'middle' }
      titleCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF6790FF' }
      }

      // Fila 4 vacía, luego encabezados en A5:I5
      const headers = [
        'Cuota', 'Vcmto. (día)', 'Saldo Inicial',
        'Interés', 'Capital', 'Cuota Neta', 'Saldo Final'
      ]


      const headerRow = worksheet.addRow(headers.map(h => h.toUpperCase())) // Mayúsculas

      headerRow.eachCell(cell => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF6790FF' }
        }
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }
        cell.alignment = { horizontal: 'center', vertical: 'middle' }
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' }
        }
      })

      // Datos desde fila 6
      data.forEach(item => {
        const row = worksheet.addRow([
          item.cuota,
          item.vcmto,
          item.saldo_inicial,
          item.interes,
          item.capital,
          item.cuota_neta,
          item.saldo_final
        ])

        row.eachCell(cell => {
          cell.alignment = { horizontal: 'center', vertical: 'middle' }
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          }
        })
      })

      // Ajuste de ancho
      worksheet.columns.forEach(col => {
        col.width = 15
      })

      // Descargar archivo
      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })

      const timestamp = new Date().toISOString().slice(0, 10)
      const fileName = plazoMeses
      ? `cronograma_credito_hipotecario_${plazoMeses}_meses_${timestamp}.xlsx`
      : `cronograma_credito_hipotecario_${timestamp}.xlsx`

      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = fileName
      link.click()
      URL.revokeObjectURL(link.href)

      return { success: true, fileName }

    } catch (error) {
      console.error('Error exportando a Excel:', error)
      return { success: false, error }
    } finally {
      exportLoading.value = false
    }
  }

  return {
    exportLoading,
    exportCronogramaToExcel
  }
}

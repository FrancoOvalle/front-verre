import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, ChartConfiguration, ChartType } from 'chart.js/auto';
import { MantenimientoService } from '../../../services/mantenimiento.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private doughnutChartInstance: Chart<'doughnut'> | null = null;
  private doughnutChartPreventivoInstance: Chart<'doughnut'> | null = null;
  private callsVolumeChartInstance: Chart<'line'> | null = null;

  startDate: string = '';
  endDate: string = '';
  programadas: number = 0;
  preventivas: number = 0;
  reservas: any[] = [];
  usuarios: any[] = [];
  tablaUltimos: any[] = []

  porcentajeProgramadas: string = "";
  programadasConfirmadas: number = 0;
  programadasFinalizadas: number = 0;
  programadasPendientes: number = 0;

  porcentajePreventivas: string = "";
  preventivasConfirmadas: number = 0;
  preventivasFinalizadas: number = 0;
  preventivasPendientes: number = 0;

  constructor(
    private mantenimientoService: MantenimientoService,
    private toastr: ToastrService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.loadData();
    this.createCallsVolumeChart();
    this.datosTabla();
  }

  datosTabla():void{
    this.mantenimientoService.datosTablaDashboard().subscribe(resp => {
      if(resp.error){
        console.error('Error al generar tabla de datos', resp.errorDetalle);
        return;
      }

      const data = resp.data;
      this.tablaUltimos = data;
    })
  }

  onDateChange(): void {
    if(this.endDate <= this.startDate){
      this.toastr.error('Error la fecha de inicio es mayor a la de fin'); // Muestra mensaje de error
      Swal.fire('Error!', 'La fecha de fin no puede ser inferior a la de inicio.', 'error');

    }
    if (this.startDate && this.endDate) {
      this.loadData();
    }
  }

  loadData(): void {
    this.mantenimientoService.getEstadisticasProgramadas(this.startDate, this.endDate).subscribe(data => {
      if (data.data && data.data.length > 0) {
        const totalData = data.data[0];
        this.programadas = totalData.total || 0;

        const statuses = totalData.statuses || [];
        this.programadasConfirmadas = statuses.find((status: { status: string; }) => status.status === 'Confirmado')?.count || 0;
        this.programadasFinalizadas = statuses.find((status: { status: string; }) => status.status === 'Confirmado')?.count || 0;
        this.programadasPendientes = statuses.find((status: { status: string; }) => status.status === 'Activo')?.count || 0;

        if (this.doughnutChartInstance) this.doughnutChartInstance.destroy();
        // if (this.doughnutChartPreventivoInstance) this.doughnutChartPreventivoInstance.destroy();
        if (this.programadas > 0) {
          this.porcentajeProgramadas = ((this.programadasFinalizadas * 100) / this.programadas).toFixed(2);
        } else {
          this.porcentajeProgramadas = '0'; // O cualquier otro valor predeterminado que tenga sentido en tu contexto
        }


        this.createDoughnutChart(this.programadasFinalizadas, this.programadasPendientes);

      } else {
        this.programadas = 0;
        this.programadasConfirmadas = 0;
        this.programadasPendientes = 0;
        this.programadasFinalizadas = 0;
      }

      this.reservas = data.reservas || [];
      this.usuarios = data.usuarios || [];
    });

    this.mantenimientoService.getEstadisticasPreventivas(this.startDate, this.endDate).subscribe(data => {
      if (data.data && data.data.length > 0) {
        const totalData = data.data[0];
        this.preventivas = totalData.total || 0;

        const statuses = totalData.statuses || [];
        this.preventivasConfirmadas = statuses.find((status: { status: string; }) => status.status === 'Confirmado')?.count || 0;
        this.preventivasFinalizadas = statuses.find((status: { status: string; }) => status.status === 'Confirmado')?.count || 0;
        this.preventivasPendientes = statuses.find((status: { status: string; }) => status.status === 'Activa')?.count || 0;

        if (this.doughnutChartPreventivoInstance) this.doughnutChartPreventivoInstance.destroy();
        if (this.preventivasFinalizadas > 0) {
          this.porcentajePreventivas = ((this.preventivasFinalizadas * 100)/this.preventivas).toFixed(2);
        } else {
          this.porcentajePreventivas = '0'; // O cualquier otro valor predeterminado que tenga sentido en tu contexto
        }

        this.createDoughnutChartPreventivo(this.preventivasFinalizadas, this.preventivasPendientes);

      } else {
        this.preventivas = 0;
        this.preventivasConfirmadas = 0;
        this.preventivasPendientes = 0;
        this.preventivasFinalizadas = 0;
      }

      this.reservas = data.reservas || [];
      this.usuarios = data.usuarios || [];
    });

  }

  createDoughnutChart(finalizadas: number, pendientes: number) {
    const ctx = document.getElementById('doughnutChart') as HTMLCanvasElement;

    const config: ChartConfiguration<'doughnut', number[], string> = {
      type: 'doughnut',
      data: {
        labels: ['Finalizadas', 'Pendientes'],
        datasets: [{
          data: [finalizadas, pendientes],
          backgroundColor: ['#4caf50', '#ffcf40'],
          hoverOffset: 2,
          borderWidth: 2
        }]
      },
      options: {
        cutout: '70%',
        plugins: {
          tooltip: { enabled: true },
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              boxWidth: 20,
              padding: 15,
            }
          },
        }
      }
    };

    this.doughnutChartInstance = new Chart(ctx, config);
  }

  createDoughnutChartPreventivo(finalizadas: number, pendientes: number) {
    const ctx = document.getElementById('doughnutChartPreventivo') as HTMLCanvasElement;

    const config: ChartConfiguration<'doughnut',number[], string> = {
      type: 'doughnut',
      data: {
        labels: ['Finalizadas', 'Pendientes'],
        datasets: [{
          data: [finalizadas, pendientes],
          backgroundColor: ['#4caf50', '#ffcf40'],
          hoverOffset: 2,
          borderWidth: 2
        }]
      },
      options: {
        cutout: '70%',
        plugins: {
          tooltip: { enabled: true },
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              boxWidth: 20,
              padding: 15,
            }
          },
        }
      }
    };
    this.doughnutChartPreventivoInstance = new Chart(ctx, config);
  }

  createCallsVolumeChart() {
    this.mantenimientoService.generaGrafico().subscribe(response => {
      if (response.error) {
        console.error('Error al generar el gráfico:', response.errorDetalle);
        return;
      }

      // Procesar los datos recibidos para Chart.js
      const data = response.data;
      const labelsSet = new Set<string>(); // Para mantener etiquetas únicas
      const programadasData: number[] = [];
      const preventivasData: number[] = [];

      // Mapear las etiquetas y datos
      data.forEach((item: any) => {
        const label = `${item.month}/${item.year}`;
        labelsSet.add(label);

        // Determina si es Programada o Preventiva y agrega el valor total correspondiente
        if (item.coleccion === 'Programada') {
          programadasData.push(item.total);
        } else if (item.coleccion === 'Preventiva') {
          preventivasData.push(item.total);
        }
      });

      const labels = Array.from(labelsSet); // Convertir el Set en un array

      // Asegurar que programadasData y preventivasData tengan la misma longitud que labels
      const fillMissingData = (data: number[], length: number) => {
        while (data.length < length) {
          data.push(0);
        }
      };

      fillMissingData(programadasData, labels.length);
      fillMissingData(preventivasData, labels.length);

      // Configurar el gráfico
      const ctx = document.getElementById('callsVolumeChart') as HTMLCanvasElement;
      this.callsVolumeChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels, // Etiquetas de los meses
          datasets: [{
            label: 'Programadas',
            data: programadasData,
            borderColor: '#007bff',
            fill: false
          },
          {
            label: 'Preventivas',
            data: preventivasData,
            borderColor: '#28a745',
            fill: false
          }]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              beginAtZero: true
            },
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }, error => {
      console.error('Error en la llamada al servicio de gráfico:', error);
    });
  }
  procesarSolicitante(solicitante: string): string {
    if (!solicitante) return '';
    return solicitante.split(/\d/)[0].trim();
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '';
    return fecha.split("T")[0];
  }


}

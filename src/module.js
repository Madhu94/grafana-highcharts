import { MetricsPanelCtrl } from 'grafana/app/plugins/sdk'; // will be resolved to app/plugins/sdk

const Highcharts = require('highcharts');

// for debugging
window.Highcharts = Highcharts;

class Ctrl extends MetricsPanelCtrl {

  constructor($scope, $injector) {
    super($scope, $injector);
    this.events.on('data-received', this.onDataReceived.bind(this));
  }

  flip(array) {
    return array.map(([x, y]) => ([y * 1000, x]));
  }

  _createChart(data) {
    return Highcharts.chart('container', {
      xAxis: { type: 'datetime' },
      series: this._makeSeries(data),
      plotOptions: {
        series: {
          connectNulls: true
        }
      },
      title: { text: 'TimeSeries Charts' },
      legend: {
        enabled: false
      }
    });
  }

  _makeSeries(data) {
    return data.map((timeSerie) => {
      return {
        id: timeSerie.target,
        name: timeSerie.target,
        data: this.flip(timeSerie.datapoints)
      }
    });
  }

  _updateChart(data) {
    const series = this._makeSeries(data);
    let newOnes = [], oldOnes = [];
    for (let i = 0; i < series.length; i++) {
      if (this.chart.series.find((serie) => serie.name === series[i].name)) {
        oldOnes.push(series[i]);
      } else {
        newOnes.push(series[i]);
      }
    }
    newOnes.forEach((serie) => {
      this.chart.addSeries(serie, false);
    });
    console.log(newOnes);
    this.chart.update({series: oldOnes}, false);
    this.chart.redraw();
  }

  onDataReceived(data) {
    if (!this.chart) {
      this.chart = this._createChart(data);
    } else {
      this._updateChart(data);
    }
  }

  get panelPath() {
    if (this._panelPath === undefined) {
      this._panelPath = `/public/plugins/${this.pluginId}/`;
    }
    return this._panelPath;
  }  
}

Ctrl.templateUrl = 'partials/template.html';

export { Ctrl as PanelCtrl }

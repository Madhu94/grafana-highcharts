import { MetricsPanelCtrl } from 'grafana/app/plugins/sdk'; // will be resolved to app/plugins/sdk

const Highcharts = require('highcharts');

class Ctrl extends MetricsPanelCtrl {

  constructor($scope, $injector) {
    super($scope, $injector);
    this.events.on('data-received', this.onDataReceived.bind(this));
  }

  flip(array) {
    return array.map(([x, y]) => ([y * 1000, x]));
  }

  onDataReceived(args) {
    const seriesData = this.flip(args[0].datapoints);
    Highcharts.chart('container', {
      xAxis: { type: 'datetime' },
      series: [{
        data: seriesData,
        name: 'test series'
      }],
      plotOptions: {
        series: {
          connectNulls: true
        }
      },
      chart: {
        title: 'A timeseries chart! :) '
      }
    });
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

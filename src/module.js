import { MetricsPanelCtrl } from 'grafana/app/plugins/sdk'; // will be resolved to app/plugins/sdk

const Highcharts = require('highcharts');

class Ctrl extends MetricsPanelCtrl {

  constructor($scope, $injector) {
    super($scope, $injector);
  }

  get panelPath() {
    if (this._panelPath === undefined) {
      this._panelPath = `/public/plugins/${this.pluginId}/`;
    }
    return this._panelPath;
  }

  panelDidMount() {
    super.panelDidMount();
    Highcharts.chart('container', {
      series: [{
        data: [1,2,3,4,5,6,7,8,9,10],
        name: 'test series'
      }]
    })
  }
  
}

Ctrl.templateUrl = 'partials/template.html';

export { Ctrl as PanelCtrl }

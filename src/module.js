import { MetricsPanelCtrl } from 'grafana/app/plugins/sdk'; // will be resolved to app/plugins/sdk
import React from 'react';
import ReactDOM from 'react-dom';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';


class GrafanaHighchartsPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { chartType: 'line' };
    this._handleChartTypeSwitch = this._handleChartTypeSwitch.bind(this);
  }

  static get chartTypes() {
    return [
      'line',
      'column',
      'area',
      'bar',
      'pie'
    ];
  }

  _handleChartTypeSwitch(event) {
    console.log(event.target.value);
    this.setState({chartType: event.target.value});
  }

  render() {
    const choices = GrafanaHighchartsPanel.chartTypes.map((choice, idx) => {
      return (<option value={choice} key={`${choice}-${idx}`}>{choice}</option>);
    });
    const options = {
      ...this.props.options,
      chart: {
        ...this.props.options.chart,
        type: this.state.chartType
      }
    };
    return (
      <div>
        <select value={this.state.chartType} onChange={this._handleChartTypeSwitch}>
          {choices}
        </select>
        <HighchartsReact options={options} />
      </div>
    );
  }
}
// for debugging
window.Highcharts = Highcharts;

class Ctrl extends MetricsPanelCtrl {

  constructor($scope, $injector) {
    super($scope, $injector);
    this.events.on('data-received', this.onDataReceived.bind(this));
  }

  _getChartConfig(data) {
    return {
      xAxis: { type: 'datetime' },
      series: this._makeSeries(data),
      plotOptions: {
        series: {
          connectNulls: true
        }
      },
      title: { text: 'TimeSeries Charts' },
      legend: {
        enabled: true
      }
    };
  }

  _makeSeries(data) {
    return data.map((timeSerie) => {
      return {
        id: timeSerie.target,
        name: timeSerie.target,
        data: timeSerie.datapoints.map(([x, y]) => ([y * 1000, x]))
      }
    });
  }

  onDataReceived(data) {
    ReactDOM.render(<GrafanaHighchartsPanel options={this._getChartConfig(data)} />, 
      document.getElementById('container'));
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

import { QueryCtrl } from 'grafana/app/plugins/sdk';

export class GoogleSpreadsheetsQueryCtrl extends QueryCtrl {
  scope: any;
  panelCtrl: any;
  resultFormats: any[];
  static templateUrl = 'partials/query.editor.html';

  /** @ngInject */
  constructor($scope, $injector) {
    super($scope, $injector);
    this.scope = $scope;
    this.resultFormats = [{ text: 'Time series', value: 'time_series' }, { text: 'Table', value: 'table' }];
  }

  onChangeInternal() {
    this.panelCtrl.refresh();
  }
}

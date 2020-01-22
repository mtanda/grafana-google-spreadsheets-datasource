import GoogleSpreadsheetsDatasource from './datasource';
import { GoogleSpreadsheetsQueryCtrl } from './query_ctrl';
import { GoogleSpreadsheetsAnnotationsQueryCtrl } from './annotations_query_ctrl';
import { DataSourcePlugin } from '@grafana/data';
import { GoogleSpreadsheetsQuery, GoogleSpreadsheetsOptions } from './types';

class GoogleSpreadsheetsConfigCtrl {
  static templateUrl = 'config.html';
}

export const plugin = new DataSourcePlugin<GoogleSpreadsheetsDatasource, GoogleSpreadsheetsQuery, GoogleSpreadsheetsOptions>(
  GoogleSpreadsheetsDatasource
)
  .setConfigCtrl(GoogleSpreadsheetsConfigCtrl)
  .setQueryCtrl(GoogleSpreadsheetsQueryCtrl)
  .setAnnotationQueryCtrl(GoogleSpreadsheetsAnnotationsQueryCtrl);

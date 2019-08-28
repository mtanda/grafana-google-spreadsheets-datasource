import { GoogleSpreadsheetsDatasource } from './datasource';
import { GoogleSpreadsheetsQueryCtrl } from './query_ctrl';
import { GoogleSpreadsheetsAnnotationsQueryCtrl } from './annotations_query_ctrl';

class GoogleSpreadsheetsConfigCtrl {
  static templateUrl = 'partials/config.html';
}

export {
  GoogleSpreadsheetsDatasource as Datasource,
  GoogleSpreadsheetsConfigCtrl as ConfigCtrl,
  GoogleSpreadsheetsQueryCtrl as QueryCtrl,
  GoogleSpreadsheetsAnnotationsQueryCtrl as AnnotationsQueryCtrl,
};

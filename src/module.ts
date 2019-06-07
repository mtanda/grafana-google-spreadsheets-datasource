import { GoogleSpreadsheetDatasource } from './datasource';
import { GoogleSpreadsheetQueryCtrl } from './query_ctrl';
import { GoogleSpreadsheetAnnotationsQueryCtrl } from './annotations_query_ctrl';

class GoogleSpreadsheetConfigCtrl {
  static templateUrl = 'partials/config.html';
}

export {
  GoogleSpreadsheetDatasource as Datasource,
  GoogleSpreadsheetConfigCtrl as ConfigCtrl,
  GoogleSpreadsheetQueryCtrl as QueryCtrl,
  GoogleSpreadsheetAnnotationsQueryCtrl as AnnotationsQueryCtrl
};

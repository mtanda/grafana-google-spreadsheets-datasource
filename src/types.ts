import { DataQuery, DataSourceJsonData } from '@grafana/data';

export interface GoogleSpreadsheetsOptions extends DataSourceJsonData {
  access: string;
  clientId: string;
}

export interface GoogleSpreadsheetsQuery extends DataQuery {
  refId: string;
  spreadsheetId: string;
  range: string;
  transpose: boolean;
  timeFormat: string;
  resultFormat: string;
  timeKey: string;
  timeKeys: string;
  valueKeys: string;
  useHeader: boolean;
  aliasFormat: string;
}

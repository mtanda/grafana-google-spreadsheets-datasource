import _ from 'lodash';
import moment from 'moment';
import TableModel from 'grafana/app/core/table_model';
import scriptjs from 'scriptjs';
import { DataSourceApi, DataSourceInstanceSettings, DataQueryRequest } from '@grafana/data';
import { GoogleSpreadsheetsQuery, GoogleSpreadsheetsOptions } from './types';

export default class GoogleSpreadsheetsDatasource extends DataSourceApi<GoogleSpreadsheetsQuery, GoogleSpreadsheetsOptions> {
  type: string;
  name: string;
  id: number;
  access: string;
  clientId: string;
  scopes: any;
  discoveryDocs: any;
  q: any;
  templateSrv: any;
  timeSrv: any;
  initialized: boolean;

  /** @ngInject */
  constructor(instanceSettings: DataSourceInstanceSettings<GoogleSpreadsheetsOptions>, $q, templateSrv, timeSrv) {
    super(instanceSettings);
    this.type = instanceSettings.type;
    this.name = instanceSettings.name;
    this.id = instanceSettings.id;
    this.access = instanceSettings.jsonData.access || 'direct';
    this.clientId = instanceSettings.jsonData.clientId;
    this.scopes = 'https://www.googleapis.com/auth/spreadsheets.readonly';
    this.discoveryDocs = ['https://sheets.googleapis.com/$discovery/rest?version=v4'];
    this.q = $q;
    this.templateSrv = templateSrv;
    this.timeSrv = timeSrv;
    this.initialized = false;
  }

  async load() {
    const deferred = this.q.defer();
    scriptjs('https://apis.google.com/js/api.js', () => {
      gapi.load('client:auth2', () => {
        gapi.client.load('sheets', 'v4', () => {
          return deferred.resolve();
        });
      });
    });
    return deferred.promise;
  }

  async initialize() {
    if (this.access === 'proxy') {
      return Promise.resolve([]); // not supported
    }
    if (this.initialized) {
      return Promise.resolve(gapi.auth2.getAuthInstance().currentUser.get());
    }

    await this.load();
    await gapi.client.init({
      clientId: this.clientId,
      scope: this.scopes,
      discoveryDocs: this.discoveryDocs,
    });

    const authInstance = gapi.auth2.getAuthInstance();
    if (!authInstance) {
      throw { message: 'failed to initialize' };
    }

    const isSignedIn = authInstance.isSignedIn.get();
    if (isSignedIn) {
      this.initialized = true;
      return authInstance.currentUser.get();
    }

    const user = await authInstance.signIn();
    this.initialized = true;

    return user;
  }

  async testDatasource() {
    try {
      await this.initialize();
      return { status: 'success', message: 'Data source is working', title: 'Success' };
    } catch (err) {
      return { status: 'error', message: err.message, title: 'Error' };
    }
  }

  async query(options: DataQueryRequest<GoogleSpreadsheetsQuery>) {
    await this.initialize();

    const results: any = await Promise.all(
      options.targets
        .filter(t => !t.hide && t.spreadsheetId)
        .map(t => {
          return this.getValues(
            this.templateSrv.replace(t.spreadsheetId, options.scopedVars),
            this.templateSrv.replace(t.range, options.scopedVars),
            t.transpose
          );
        })
    );
    const data = results
      .map((result, i) => {
        const timeFormat = options.targets[i].timeFormat;
        switch (options.targets[i].resultFormat) {
          case 'table':
            const timeKeys = (options.targets[i].timeKeys || '').split(',').map(k => {
              return parseInt(k, 10);
            });
            const table = new TableModel();
            table.columns = result.values[0].map((v, i) => {
              if (timeKeys && timeKeys.includes(i)) {
                return { text: `c${i}`, type: 'time' };
              }
              return { text: `c${i}`, type: 'string' };
            });
            if (timeKeys) {
              result.values.forEach(v => {
                timeKeys.forEach(timeKey => {
                  v[timeKey] = moment(v[timeKey], timeFormat).valueOf();
                });
              });
            }
            table.rows = result.values;
            return [table];
          default:
            let header = {};
            if (options.targets[i].useHeader) {
              header = result.values[0];
              result.values = result.values.slice(1);
            }

            const timeKey = options.targets[i].timeKey ? parseInt(options.targets[i].timeKey, 10) : 0;
            const valueKeys = (options.targets[i].valueKeys || '1').split(',').map(k => {
              return parseInt(k, 10);
            });

            const series = {};
            result.values.forEach(v => {
              let uniqueAttributeKey = 'u';
              const attrs = {};
              if (v.length > 2) {
                uniqueAttributeKey = v
                  .filter((v, k) => {
                    return k !== timeKey && !valueKeys.includes(k);
                  })
                  .map((v, k) => {
                    attrs[`attribute${k}`] = v;
                    return v;
                  })
                  .join('_');
              }
              valueKeys.forEach(valueKey => {
                const headerValue = header[valueKey] || '';
                const uniqueKey = `${uniqueAttributeKey}_${headerValue}`;
                if (!series[uniqueKey]) {
                  series[uniqueKey] = {
                    target: this.renderTemplate(
                      options.targets[i].aliasFormat,
                      Object.assign({ range: result.range }, { header: headerValue }, attrs)
                    ),
                    datapoints: [],
                  };
                }
                series[uniqueKey].datapoints.push([
                  parseFloat(v[valueKey]),
                  timeFormat ? moment(v[timeKey], timeFormat).valueOf() : parseFloat(v[timeKey]),
                ]);
              });
            });

            return Object.values(series);
        }
      })
      .flat();

    return {
      data: data,
    };
  }

  async metricFindQuery(query) {
    await this.initialize();
    
    const cellValuesQuery = query.match(/^cell_values\(([^,]+?),\s?([^,]+?)\)/);
    if (cellValuesQuery) {
      const spreadsheetId = this.templateSrv.replace(cellValuesQuery[1]);
      const range = this.templateSrv.replace(cellValuesQuery[2]);
      const result = await this.getValues(spreadsheetId, range);
      return _.uniq(result.values.flat()).map(v => {
        return {
          text: v,
        };
      });
    }

    return this.q.when([]);
  }

  async annotationQuery(options) {
    await this.initialize();

    const annotation = options.annotation;
    const spreadsheetId = this.templateSrv.replace(annotation.spreadsheetId || '');
    const range = this.templateSrv.replace(annotation.range || '');
    const timeKeys = this.templateSrv.replace(annotation.timeKeys || '0,1').split(',');
    const timeFormat = this.templateSrv.replace(annotation.timeFormat || '');
    const titleFormat = this.templateSrv.replace(annotation.titleFormat || '{{2}}');
    const textFormat = this.templateSrv.replace(annotation.textFormat || '{{3}}');
    const tagKeys = this.templateSrv.replace(annotation.tagKeys || '2,3').split(',');
    const filter = this.templateSrv.replace(annotation.filter || '');

    if (!spreadsheetId || !range) {
      return [];
    }

    const result = await this.getValues(spreadsheetId, range);
    if (_.isEmpty(result)) {
      return [];
    }

    let filterExpression: any = [];
    if (filter) {
      const filterPart = filter.split('=');
      filterExpression = [
        {
          key: filterPart[0],
          op: '=',
          value: filterPart[1].replace(/^"/, '').replace(/"$/, ''),
        },
      ];
    }
    const eventList = result.values
      .filter(value => {
        return filterExpression.every(e => {
          switch (e.op) {
            case '=':
              return value[e.key] === e.value;
            default:
              return true;
          }
        });
      })
      .map((value, i) => {
        const tags = value.filter((v, k) => {
          return tagKeys.includes(String(k));
        });
        const timeFrom = timeFormat ? moment(value[timeKeys[0]], timeFormat).valueOf() : parseInt(value[timeKeys[0]], 10);

        const event: any = [
          {
            annotation: annotation,
            time: timeFrom,
            title: this.renderTemplate(titleFormat, value),
            text: this.renderTemplate(textFormat, value),
            tags: tags,
          },
        ];
        if (timeKeys.length === 2) {
          const timeTo = timeFormat ? moment(value[timeKeys[1]], timeFormat).valueOf() : parseInt(value[timeKeys[1]], 10);
          event[0].regionId = spreadsheetId + i;
          event.push({
            regionId: spreadsheetId + i,
            annotation: annotation,
            time: timeTo,
            title: this.renderTemplate(titleFormat, value),
            text: this.renderTemplate(textFormat, value),
            tags: tags,
          });
        }
        return event;
      })
      .flat();

    return eventList;
  }

  async getValues(spreadsheetId: string, range: string, transpose = false) {
    const response = await gapi.client['sheets'].spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: range,
    });
    response.result.values = response.result.values.filter(v => {
      return v.length > 0;
    });
    if (transpose) {
      response.result.values = _.unzip(response.result.values);
    }
    return response.result;
  }

  renderTemplate(aliasPattern: string, aliasData) {
    const aliasRegex = /\{\{\s*(.+?)\s*\}\}/g;
    return aliasPattern.replace(aliasRegex, (match, g1) => {
      if (aliasData[g1]) {
        return aliasData[g1];
      }
      return g1;
    });
  }
}

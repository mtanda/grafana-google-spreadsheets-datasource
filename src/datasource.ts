import _ from 'lodash';
import moment from 'moment';
//import TableModel from 'grafana/app/core/table_model';
import scriptjs from 'scriptjs';

export class GoogleSpreadsheetsDatasource {
  type: string;
  name: string;
  id: string;
  access: string;
  clientId: string;
  scopes: any;
  discoveryDocs: any;
  q: any;
  templateSrv: any;
  timeSrv: any;
  initialized: boolean;

  constructor(instanceSettings, $q, templateSrv, timeSrv) {
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
    if (this.access == 'proxy') {
      return Promise.resolve([]); // not supported
    }
    if (this.initialized) {
      return Promise.resolve(gapi.auth2.getAuthInstance().currentUser.get());
    }

    await this.load();
    await gapi.client.init({
      clientId: this.clientId,
      scope: this.scopes,
      discoveryDocs: this.discoveryDocs
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
      return { status: "error", message: err.message, title: "Error" };
    }
  }

  async query(options) {
    await this.initialize();

    const results: any = await Promise.all(
      options.targets
        .filter((t) => !t.hide)
        .map((t) => {
          return this.getValues(t.spreadsheetId, t.range);
        })
    );
    const data = results.map((result, i) => {
      return {
        target: this.renderTemplate(options.targets[i].aliasFormat, { range: result.range }),
        datapoints: result.values.map((v) => {
          return [
            parseFloat(v[0]),
            parseFloat(v[1])
          ];
        })
      };
    });

    return {
      data: data
    };
  }

  async annotationQuery(options) {
    await this.initialize();

    const annotation = options.annotation;
    const spreadsheetId = annotation.spreadsheetId || '';
    const range = annotation.range || '';
    const timeKeys = (annotation.timeKeys || '0,1').split(',');
    const timeFormat = (annotation.timeFormat || '');
    const titleFormat = annotation.titleFormat || '{{2}}';
    const textFormat = annotation.textFormat || '{{3}}';
    const tagKeys = (annotation.tagKeys || '2,3').split(',');

    if (!spreadsheetId || !range) { return []; }

    const result = await this.getValues(spreadsheetId, range);
    if (_.isEmpty(result)) {
      return [];
    }

    const eventList = result.values.map((value, i) => {
      const tags = value.filter((v, k) => {
        return tagKeys.includes(String(k));
      });
      const timeFrom = timeFormat ? moment(value[timeKeys[0]], timeFormat).valueOf() : parseInt(value[timeKeys[0]], 10);
      const timeTo = timeFormat ? moment(value[timeKeys[1]], timeFormat).valueOf() : parseInt(value[timeKeys[1]], 10);

      return [
        {
          regionId: spreadsheetId + i,
          annotation: annotation,
          time: timeFrom,
          title: this.renderTemplate(titleFormat, value),
          text: this.renderTemplate(textFormat, value),
          tags: tags,
        },
        {
          regionId: spreadsheetId + i,
          annotation: annotation,
          time: timeTo,
          title: this.renderTemplate(titleFormat, value),
          text: this.renderTemplate(textFormat, value),
          tags: tags,
        }
      ];
    }).flat();

    return eventList;
  }

  async getValues(spreadsheetId: string, range: string) {
    const response = await gapi.client['sheets'].spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: range,
    });
    return response.result;
  }

  renderTemplate(aliasPattern: string, aliasData) {
    const aliasRegex = /\{\{\s*(.+?)\s*\}\}/g;
    return aliasPattern.replace(aliasRegex, function (match, g1) {
      if (aliasData[g1]) {
        return aliasData[g1];
      }
      return g1;
    });
  }
}

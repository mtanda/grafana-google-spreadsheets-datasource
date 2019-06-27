import _ from 'lodash';
//import moment from 'moment';
//import * as dateMath from 'grafana/app/core/utils/datemath';
//import TableModel from 'grafana/app/core/table_model';
import scriptjs from 'scriptjs';

export class GoogleSpreadsheetDatasource {
  type: string;
  name: string;
  id: string;
  access: string;
  clientId: string;
  apiKey: string;
  scopes: any;
  discoveryDocs: any;
  q: any;
  templateSrv: any;
  timeSrv: any;
  backendSrv: any;
  initialized: boolean;

  constructor(instanceSettings, $q, templateSrv, timeSrv, backendSrv) {
    this.type = instanceSettings.type;
    this.name = instanceSettings.name;
    this.id = instanceSettings.id;
    this.access = instanceSettings.jsonData.access || 'direct';
    this.clientId = instanceSettings.jsonData.clientId;
    this.apiKey = instanceSettings.jsonData.apiKey;
    //this.scopes = 'https://www.googleapis.com/auth/spreadsheets.readonly';
    this.scopes = [
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/drive.readonly',
      'https://www.googleapis.com/auth/spreadsheets.readonly',
      'https://www.googleapis.com/auth/spreadsheets'
    ];
    this.discoveryDocs = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
    this.q = $q;
    this.templateSrv = templateSrv;
    this.timeSrv = timeSrv;
    this.backendSrv = backendSrv;
    this.initialized = false;
  }

  load() {
    let deferred = this.q.defer();
    scriptjs('https://apis.google.com/js/api.js', () => {
      gapi.load('client:auth2', () => {
        gapi.client.load('sheets', 'v4', () => {
          console.log('sheets loaded');
          return deferred.resolve();
        });
      });
    });
    return deferred.promise;
  }

  testDatasource() {
    return this.initialize().then(() => {
      return { status: 'success', message: 'Data source is working', title: 'Success' };
    }).catch(err => {
      console.log(err);
      return { status: "error", message: err.message, title: "Error" };
    });
  }

  initialize() {
    if (this.access == 'proxy') {
      return Promise.resolve([]);
    }
    if (this.initialized) {
      return Promise.resolve(gapi.auth2.getAuthInstance().currentUser.get());
    }

    return this.load().then(() => {
      console.log(JSON.stringify(this.clientId));
      console.log(JSON.stringify(this.apiKey));
      console.log(JSON.stringify(this.scopes));
      console.log(JSON.stringify(this.discoveryDocs));
      return gapi.client.init({
        clientId: this.clientId,
        apiKey: this.apiKey,
        scope: this.scopes,
        discoveryDocs: this.discoveryDocs
      }).then(() => {
        let authInstance = gapi.auth2.getAuthInstance();
        if (!authInstance) {
          throw { message: 'failed to initialize' };
        }
        let isSignedIn = authInstance.isSignedIn.get();
        if (isSignedIn) {
          this.initialized = true;
          return authInstance.currentUser.get();
        }
        return authInstance.signIn().then(user => {
          this.initialized = true;
          return user;
        });
      }, err => {
        console.log(err);
        throw { message: 'failed to initialize' };
      });
    });
  }

  query(options) {
    return this.initialize().then(() => {
      return Promise.all(
        options.targets
          .filter((t) => !t.hide)
          .map((t) => {
            let params = {
              spreadsheetId: t.spreadsheetId,
              //range: t.range,
              range: 'Sheet1!A1:A3'
            };
            return this.getValues(params);
          })
      ).then((values) => {
      });
    });
  }

  annotationQuery(options) {
    var annotation = options.annotation;
    var spreadsheetId = annotation.spreadsheetId;

    if (_.isEmpty(spreadsheetId)) {
      return this.q.when([]);
    }

    return this.initialize().then(() => {
    });
  }

  getValues(params) {
    console.log('here2');
    console.log(JSON.stringify(params));
    //return gapi.client['sheets'].spreadsheets.get({
    return gapi.client['sheets'].spreadsheets.values.get({
      spreadsheetId: params.spreadsheetId,
      range: params.range,
    }).then((response) => {
      console.log(response);
      console.log(JSON.stringify(response));
      return response.result;
    }, (err) => {
      throw err;
    });
  }
}

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
  scopes: string;
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
    this.scopes = 'https://www.googleapis.com/auth/spreadsheets.readonly';
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
        return deferred.resolve();
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
      return gapi.client.init({
        clientId: this.clientId,
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
              range: t.range,
            };
            return this.getValues(params).then(values => {
            });
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
    return (() => {
      return gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: params.spreadsheetId,
        range: params.range,
      }).then((response) => {
        return response.result;
      }, (err) => {
        throw err;
      });
    });
  }
}

import {protractor} from 'protractor';

export class HttpUtils {

   sendRequest(requestParameters) {
    const request = require('request');
     const fullUrl = requestParameters.uri;
    const requestOptions = {
      url: fullUrl,
      method: requestParameters.action,
      body: requestParameters.body,
      json: true,
      headers: {
        'content-type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      } ,
      timeout: 30000
    };

    if (requestParameters.timeout) { // if no timeout it uses default
      requestOptions.timeout = requestParameters.timeout;
    }

    if (requestParameters.authorization) {
      requestOptions.headers['Authorization'] = 'bearer ' + requestParameters.authorization;
    }

    const flow = protractor.promise.controlFlow();
    return flow.execute(function () {
      console.log('Http START request UTC time: ' + (new Date()).toUTCString());
      const executeDeferred = protractor.promise.defer();
      request(requestOptions, function (error, response, body) {
        console.log('Http END request UTC time: ' + (new Date()).toUTCString());
        if (!error && (response.statusCode === 200 || response.statusCode === 201)) {
          executeDeferred.fulfill(response );
        } else {
          console.error('=== sent: ' + JSON.stringify(requestOptions));
          console.error('=== got: ' + error + ', response:' + JSON.stringify(response) + ', body:' + JSON.stringify(body));
          executeDeferred.reject(error);
        }
      });
      return executeDeferred.promise;
    });
  }
}



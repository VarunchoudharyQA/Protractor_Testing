import {HttpUtils} from './testHttpUtils';

export class TestUtilsNoUI {
  deletePartner() {
    const seleniumJsFlavours = require('../../../TestData');
    const using = require('jasmine-data-provider');
    const testHttpUtils: HttpUtils = new HttpUtils();
    using(seleniumJsFlavours.PartnerGoku, function (data) {
      testHttpUtils.sendRequest({
        action: 'POST',
        uri: 'https://internal-presencesync.dev.niceincontact.com/psa/v1/auth/login',
        body: {
          username: 'protractor-partner-bu@do65.com',
          password: 'Password@1',
          platform: 'ACD'
        }
      }).then(function (authAPIResponse) {
        const body = authAPIResponse['body'];
        const accessToken = body['accessToken'];
        testHttpUtils.sendRequest({
          action: 'GET',
          uri: 'https://internal-presencesync.dev.niceincontact.com/psa/v1/partners',
          authorization: accessToken
        }).then(function (responseGetAllPartnersCall) {
          const getAllPartners = JSON.stringify(responseGetAllPartnersCall);
          if (JSON.parse(getAllPartners).statusCode === 200) {
            console.log('Successfully received the response for get all partners method', getAllPartners);
            const protractorTenantData = JSON.parse(getAllPartners).body.find(i => i.buId === '101009');
            console.log('-------------------');
            console.log(protractorTenantData);
            const uuidOfPartnerToBeDeleted: string = protractorTenantData.uuid;
            console.log(uuidOfPartnerToBeDeleted);
            testHttpUtils.sendRequest({
                action: 'DELETE',
                uri: 'https://internal-presencesync.dev.niceincontact.com/psa/v1/partnertree/' + uuidOfPartnerToBeDeleted,
              authorization: accessToken
              }
            ).then(function (responseDeletePartnerAPI) {
              const deletePartner = JSON.stringify(responseDeletePartnerAPI);
              if (JSON.parse(deletePartner).statusCode === 200) {
                console.log('Partner deleted successfully');
              } else {
                console.log('Unable to delete partner');
              }
            });
          } else {
            console.log('200 was not received in get all partners call', getAllPartners);
          }
        }, function (errorGetAllPartnerCall) {
          console.log('get all partner call failed, response:' + errorGetAllPartnerCall);
        });

      }, function (errorAuthApiCall) {
        console.log('Failed to get the access token, response:' + errorAuthApiCall);
      });
    });
  }

  createBUMapping() {
    const seleniumJsFlavours = require('../../../TestData');
    const using = require('jasmine-data-provider');
    const testHttpUtils: HttpUtils = new HttpUtils();
    using(seleniumJsFlavours.PartnerGoku, function (data) {
      testHttpUtils.sendRequest({
        action: 'POST',
        uri: 'https://internal-presencesync.dev.niceincontact.com/psa/v1/auth/login',
        body: {
          username: 'protractor-partner-bu@do65.com',
          password: 'Password@1',
          platform: 'ACD'
        }
      }).then(function (authAPIResponse) {
        const body = authAPIResponse['body'];
        const accessToken = body['accessToken'];
        testHttpUtils.sendRequest({
          action: 'POST',
          uri: 'https://internal-presencesync.dev.niceincontact.com/psa/v1/partner',
          authorization: accessToken,
          body: {
            name: data.name,
            email: data.email,
            username: data.username,
            password: data.password,
            buId: data.BUID,
            config: '{"baseURI":"https://platform.devtest.ringcentral.com/restapi", "secret":"dzlnYmFMZWNTUmFqZTRPYndJaXpHUToxZ0ZHaDU1RlJsR0QzUE1zNHNydERnbHBEbmFOMS1SRmFHeGJtSmFBVFFMZw==","authURI":"/oauth/token"}',
            status: 'active',
            format: '1'
          },
        }).then(function (createPartnerResponse) {
          const partnerCreatedResponse = JSON.stringify(createPartnerResponse);
          if (JSON.parse(partnerCreatedResponse).statusCode === 200) {
            console.log('Successfully on-boarded partner', partnerCreatedResponse);
            const partnerId: string = JSON.parse(partnerCreatedResponse).body.uuid;
            console.log('------------' + partnerId + '-------------');
            using(seleniumJsFlavours.TenantUcaasGoku, function (tenantData) {
              testHttpUtils.sendRequest({
                action: 'POST',
                uri: 'https://internal-presencesync.dev.niceincontact.com/psa/v1/incontact-bu',
                authorization: accessToken,
                body: {
                  buName: tenantData.ACDname,
                  buId: tenantData.ACDbu_id,
                  username: tenantData.ACDusername,
                  password: tenantData.ACDpassword,
                  partnerId: partnerId,
                }
              }).then(function (acdBUResponse) {
                testHttpUtils.sendRequest({
                  action: 'POST',
                  uri: 'https://internal-presencesync.dev.niceincontact.com/psa/v1/partner-bu',
                  authorization: accessToken,
                  body: {
                    buName: tenantData.name,
                    buId: tenantData.partner_bu_id,
                    username: tenantData.username,
                    password: tenantData.password,
                    secret: tenantData.client_secret,
                    partnerId: partnerId,
                  }
                }).then(function (partnerBUResponse) {
                  testHttpUtils.sendRequest({
                    action: 'POST',
                    uri: 'https://internal-presencesync.dev.niceincontact.com/psa/v1/bu-map',
                    authorization: accessToken,
                    body: {
                      partnerBUId: tenantData.partner_bu_id,
                      icBUId: tenantData.ACDbu_id,
                      partnerId: partnerId
                    }
                  }).then(function (buMappingResponse) {
                    const buMapRes = JSON.stringify(buMappingResponse);
                    if (JSON.parse(buMapRes).statusCode === 200) {
                      console.log('Successfully mapped tenants', buMapRes);
                    } else {
                      console.log('tenant mapping failed', buMapRes);
                    }
                  });
                },
                  function (errorOnboardingPartnerBU) {
                    console.log('Error while on boarding partner BU' + errorOnboardingPartnerBU);
                  });
              },
                function (errorResponseIncontactBU) {
                  console.log('Error while on boarding inContact BU' + errorResponseIncontactBU);
                });
            });
          } else {
            console.log('partner on-boarding got failed probably because it already exists', partnerCreatedResponse);
          }
        }, function (error) {
          console.log('Account creation failure, response:');
          console.log(error);
        });

      }, function (errorGetAuthToken) {
        console.log('Failed to get Auth Token:' + errorGetAuthToken);
      });
    });
  }

  createPartner() {
    const seleniumJsFlavours = require('../../../TestData');
    const using = require('jasmine-data-provider');
    const testHttpUtils: HttpUtils = new HttpUtils();
    using(seleniumJsFlavours.PartnerGoku, function (data) {
      testHttpUtils.sendRequest({
        action: 'POST',
        uri: 'https://internal-presencesync.dev.niceincontact.com/psa/v1/auth/login',
        body: {
          username: 'protractor-partner-bu@do65.com',
          password: 'Password@1',
          platform: 'ACD'
        }
      }).then(function (authAPIResponse) {
        const body = authAPIResponse['body'];
        const accessToken = body['accessToken'];
        testHttpUtils.sendRequest({
          action: 'POST',
          uri: 'https://internal-presencesync.dev.niceincontact.com/psa/v1/partner',
          authorization: accessToken,
          body: {
            name: data.name,
            email: data.email,
            username: data.username,
            password: data.password,
            buId: data.BUID,
            config: '{"baseURI":"https://platform.devtest.ringcentral.com/restapi", "secret":"dzlnYmFMZWNTUmFqZTRPYndJaXpHUToxZ0ZHaDU1RlJsR0QzUE1zNHNydERnbHBEbmFOMS1SRmFHeGJtSmFBVFFMZw==","authURI":"/oauth/token"}',
            status: 'active',
            format: '1'
          },
        }).then(function (createPartnerResponse) {
          const partnerCreatedResponse = JSON.stringify(createPartnerResponse);
          if (JSON.parse(partnerCreatedResponse).statusCode === 200) {
            console.log('Successfully on-boarded partner', partnerCreatedResponse);
          } else {
            console.log('partner on-boarding got failed probably because it already exists', partnerCreatedResponse);
          }
        }, function (partnerCreateError) {
          console.log('Account creation failure, response:' + partnerCreateError);
        });

      }, function (errorGetAuthToken) {
        console.log('Failed to get Auth Token:' + errorGetAuthToken);
      });
    });
  }

  GetUserPermission() {
    const testHttpUtils: HttpUtils = new HttpUtils();

    testHttpUtils.sendRequest({
      action: 'POST',
      uri: 'https://internal-presencesync.dev.niceincontact.com/psa/v1/auth/login',
      body: {
        username: 'protractor-partner-bu@do65.com',
        password: 'Password@1',
        platform: 'ACD'
      }
    }).then(function (res) {
      const token2 = res;
      const bodyPer = token2['body'];
      const accessToken2 = bodyPer['accessToken'];
      testHttpUtils.sendRequest({
        action: 'GET',
        uri: 'https://internal-presencesync.dev.niceincontact.com/psa/v1/userpermissions',
        authorization: accessToken2
      }).then(function (resPer) {
        const tokenPer = JSON.stringify(resPer);
        if (JSON.parse(tokenPer).statusCode === 200) {
          console.log('Successfully fetched Permissions partner', tokenPer);
        } else {
          console.log('Fetching Permissions got failed', tokenPer);
        }
      }, function (error) {
        console.log('Fetching Permissions failure, response:');
        console.log(error);
      });

    }, function (error) {
      console.log('Failed to Get Permissions');
      console.log(error);
    });
  }
}

var EC = protractor.ExpectedConditions;
var WfmDropdown = require('niceDropdown.po.js');

function getToken(token) {
    if (!token) {
        return window.localStorage.getItem('wfo_saas.userToken');
    }
    else {
        return token;
    }
}

var defaultSoftLimit="500";
var defaultLicenses=[
    {
        "applicationId":"WFM",
        "productId":"EVOLVE",
        "featureIds":[
            102
        ],
        "settings":{

        }
    },
    {
        "applicationId":"QM",
        "productId":"EVOLVE",
        "featureIds":[
            103
        ],
        "settings":{

        }
    },
    {
        "applicationId":"WFI",
        "productId":"EVOLVE",
        "featureIds":[
            34
        ],
        "settings":{

        }
    },
    {
        "applicationId":"ACD",
        "productId":"EVOLVE",
        "featureIds":[
            1,
            11,
            40,
            52,
            53,
            56,
            61,
            63,
            64,
            65,
            66,
            67,
            68
        ],
        "settings":{
            "ACDUserLimit":10000,
            "outboundPortLimit":null,
            "ACDStationLimit":null,
            "ACDConcurrentUserLimit":null,
            "agentlessPortLimit":null,
            "concurrentPortLimit":"1"
        }
    },
    {
        "applicationId":"RECORDING",
        "productId":"EVOLVE",
        "featureIds":[
            105,
            106
        ],
        "settings":{

        }
    }
];

testsUtilsNoUI = {
    createAccount: function (email, password, organizationName, firstName, lastName, licDetailsArray, clusterId, billingId, userSoftLimit) {
        var deferred = protractor.promise.defer();
        var tryCounter = 1;
        var tenantDetails = {
            success: 1,
            orgName: organizationName,
            userEmail: email
        };
        console.log(tenantDetails);
        protractor.testUtilsNoUI.createTenant(tenantDetails.userEmail, password, tenantDetails.orgName, firstName, lastName, licDetailsArray, clusterId, billingId, userSoftLimit).then(function (response) {
            if (response) {
                console.log('Tenant created successfully. {Attempt : 1 }');
                deferred.fulfill(tenantDetails);
            }
            else {
                console.log('Tenant creation failed. {Attempt : 1 }');
                tryCounter++;
                tenantDetails.orgName = tenantDetails.orgName + tryCounter;
                tenantDetails.userEmail = tenantDetails.userEmail.substring(0, tenantDetails.userEmail.indexOf('@')) + tryCounter + tenantDetails.userEmail.substring(tenantDetails.userEmail.indexOf('@'));
                console.log(tenantDetails);
                protractor.testUtilsNoUI.createTenant(tenantDetails.userEmail, password, tenantDetails.orgName, firstName, lastName, licDetailsArray, clusterId, billingId, userSoftLimit).then(function (response) {
                    if (response) {
                        console.log('Tenant created successfully. {Attempt : 2 }');
                        tenantDetails.success = tryCounter;
                        deferred.fulfill(tenantDetails);
                    }
                    else {
                        console.log('Tenant creation failed. {Attempt : 2 }');
                        tryCounter++;
                        tenantDetails.orgName = tenantDetails.orgName + tryCounter;
                        tenantDetails.userEmail = tenantDetails.userEmail.substring(0, tenantDetails.userEmail.indexOf('@')) + tryCounter + tenantDetails.userEmail.substring(tenantDetails.userEmail.indexOf('@'));
                        protractor.testUtilsNoUI.createTenant(tenantDetails.userEmail, password, tenantDetails.orgName, firstName, lastName, licDetailsArray, clusterId, billingId, userSoftLimit).then(function (response) {
                            if (response) {
                                console.log('Tenant created successfully. {Attempt : 3 }');
                                tenantDetails.success = tryCounter;
                                deferred.fulfill(tenantDetails);
                            }
                            else {
                                console.log('Tenant creation failed. {Attempt : 3 }');
                                console.log('Reached maximum number of attempts');
                                deferred.fulfill(tenantDetails);
                            }
                        });
                    }
                });
            }
        });
        return deferred.promise;
    },

    createTenant: function (email, password, organizationName, firstName, lastName, licDetailsArray, clusterId, billingId, userSoftLimit) {
        var timestamp = protractor.testUtils.getRandomString(),
            validRandomChars = 'abcdefghijklmnopqrstuvwxyz',
            orgName = organizationName || 'orghttp' + timestamp + protractor.testUtils.getFullRandomString(5),
            first = firstName || 'some' + protractor.testUtils.getFullRandomString(10, validRandomChars),
            last = lastName || 'some' + protractor.testUtils.getFullRandomString(10, validRandomChars),
            emailAddress = email || protractor.testUtils.getRandomEmail(5),
            pwd = password || 'Pass1234';
        console.log('organizationName: ' + orgName + ' ,emailAddress: ' + email + ' ,password: ' + pwd + ' via http');
        var deferred = protractor.promise.defer();
        var httpUtils = require('./testHttpUtils.js');

        httpUtils.sendRequest({
            action: 'POST',
            uri: '/public/user/login',
            body: {
                email: protractor.TM_LOGIN_EMAIL_ADDRESS,
                password: protractor.TM_LOGIN_PASSWORD,
                userName: protractor.TM_LOGIN_EMAIL_ADDRESS,
                customAttribute: false
            },
            timeout: 30000
        }).then(function (res) {
            console.log('Successful Login to TM');
            httpUtils.sendRequest({
                action: 'POST',
                uri: '/tenants',
                authorization: res.token,
                body: {
                    tenantName: orgName,
                    parentId: null,
                    source: "protractor-admin",
                    expirationDate: new Date(2040, 11, 31, 23, 59, 59),
                    timeZone: "America/New_York",
                    status: "ACTIVE",
                    tenantType: "TRIAL",
                    customerType: "BASIC",
                    clusterId: clusterId || "-1",
                    billingId: billingId || "-1",
                    licenses: licDetailsArray ||defaultLicenses,
                    billingCycle: "5",
                    idmType: protractor.IDMTYPE,
                    userSoftLimit: userSoftLimit || defaultSoftLimit,
                    billingTelephoneNumber: "123456",
                    defaultUser: {
                        firstName: first,
                        lastName: last,
                        email: emailAddress,
                        userName: emailAddress
                    },
                    parameters: {
                        UHA_password: pwd
                    }
                },
                timeout: 50000
            }).then(function (response) {
                if (response.success) {
                    console.log('Successful Account creation', response);
                    deferred.fulfill(true);
                } else {
                    console.log('Account creation failure probably because it already exists', response);
                    deferred.fulfill(false);
                }
            }, function (error) {
                console.log('Account creation failure, response:');
                console.log(error);
                deferred.fulfill(false);
            });

        }, function (error) {
            console.log('Failed to Login TM');
            console.log(error);
            deferred.fulfill(false);
        });

        return deferred.promise;
    },

    createContactHandlingAccount: function (email, password, organizationName, firstName, lastName) {
        var timestamp = protractor.testUtils.getRandomString(),
            validRandomChars = 'abcdefghijklmnopqrstuvwxyz',
            orgName = organizationName || 'orghttp' + timestamp + protractor.testUtils.getFullRandomString(5),
            first = firstName || 'some' + protractor.testUtils.getFullRandomString(10, validRandomChars),
            last = lastName || 'some' + protractor.testUtils.getFullRandomString(10, validRandomChars),
            emailAddress = email || protractor.testUtils.getRandomEmail(5),
            pwd = password || 'Pass1234';
        console.log('organizationName: ' + orgName + ' ,emailAddress: ' + email + ' ,password: ' + pwd + ' via http');
        var deferred = protractor.promise.defer();
        var httpUtils = require('./testHttpUtils.js');

        httpUtils.sendRequest({
            action: 'POST',
            uri: '/public/user/login',
            body: {
                email: protractor.TM_LOGIN_EMAIL_ADDRESS,
                password: protractor.TM_LOGIN_PASSWORD,
                userName: protractor.TM_LOGIN_EMAIL_ADDRESS,
                customAttribute: false
            },
            timeout: 30000
        }).then(function (res) {
            console.log('Successful Login to TM');
            httpUtils.sendRequest({
                action: 'POST',
                uri: '/tenants',
                authorization: res.token,
                body: {
                    tenantName: orgName,
                    parentId: null,
                    source: "protractor-admin",
                    expirationDate: new Date(2040, 11, 31, 23, 59, 59),
                    timeZone: "America/New_York",
                    status: "ACTIVE",
                    tenantType: "TRIAL",
                    customerType: "BASIC",
                    clusterId: "-1",
                    billingId: "-1",
                    billingCycle: "5",
                    billingTelephoneNumber: "123456",
                    licenses: [
                        {
                            applicationId: "ACD",
                            productId: "EVOLVE",
                            featureIds: [
                                1,
                                8,
                                11,
                                29,
                                40,
                                52,
                                53,
                                56,
                                61,
                                63,
                                64,
                                65,
                                66,
                                67,
                                68,
                                96
                            ],
                            settings: {
                                concurrentPortLimit: "1",
                                outboundPortLimit: null,
                                agentlessPortLimit: null,
                                ACDStationLimit: null,
                                ACDUserLimit: null,
                                ACDConcurrentUserLimit: null
                            }
                        }
                    ],
                    defaultUser: {
                        firstName: first,
                        lastName: last,
                        email: emailAddress,
                        userName: emailAddress
                    },
                    parameters: {
                        UHA_password: pwd
                    }
                },
                timeout: 30000
            }).then(function (response) {
                if (response.success) {
                    console.log('Successful Account creation', response);
                    deferred.fulfill(true);
                } else {
                    console.log('Account creation failure probably because it already exists', response);
                    deferred.fulfill(false);
                }
            }, function (error) {
                console.log('Account creation failure, response:');
                console.log(error);
                deferred.reject(error);
            });

        }, function (error) {
            console.log('Failed to Login TM');
            console.log(error);
            deferred.reject(error);
        });

        return deferred.promise;
    },

    login: function (emailAddress, pwd) {
        var deferred = protractor.promise.defer();
        var httpUtils = require('./testHttpUtils.js');
        httpUtils.sendRequest({
            action: 'POST',
            uri: '/public/user/login',
            body: {
                email: emailAddress,
                password: pwd,
                userName: emailAddress,
                customAttribute: false
            },
            timeout: 30000
        }).then(function (response) {
            console.log('Successful Login');
            deferred.fulfill(response.token);
        }, function (error) {
            console.log('Login to failed, response:');
            console.log(error);
            deferred.reject(error);
        });

        return deferred.promise;
    },

    loginFailure: function (emailAddress, pwd) {
        var deferred = protractor.promise.defer();
        var httpUtils = require('./testHttpUtils.js');
        httpUtils.sendRequest({
            action: 'POST',
            uri: '/public/user/login',
            body: {
                email: emailAddress,
                password: pwd,
                userName: emailAddress,
                customAttribute: false
            },
            timeout: 30000
        }).then(function () {
            console.log('Successful Login');
            deferred.reject();
        }, function (error) {
            console.log('Login failed');
            deferred.fulfill(error);
        });

        return deferred.promise;
    },

    createDailyRule: function (name, values, token) {
        var defaultValues = {
            "name": name || "default daily name" + protractor.testUtils.getFullRandomString(10, '1234567890'),
            "length": "8",
            "earliestStart": "0:0",
            "latestStart": "0:0",
            "startIncrement": "0:00",
            "description": "",
            "dailyActivityCodeList": []
        };

        var body = {
            "dailyRule": (values && typeof _.isObject(values) ? _.merge(defaultValues, values) : defaultValues)
        };

        var deferred = protractor.promise.defer();
        var httpUtils = require('./testHttpUtils.js');

        httpUtils.sendRequest({
            action: 'POST',
            uri: '/schedules/daily-rule',
            authorization: token,
            body: body
        }).then(function (res) {
            console.log(res);
            deferred.fulfill(res);
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    },

    createWeeklyRule: function (name, values, token) {

        var deferred = protractor.promise.defer();

        protractor.promise.all([this.getDailyRules(token), this.getUsers(token)]).then(function (result) {
            var defaultValues = {
                "weeklyRuleList": [{
                    "name": "new rule",
                    "description": "",
                    "minDay": 1,
                    "maxDay": 1,
                    "minHours": "45",
                    "maxHours": "186",
                    "assignedUsersId": [result[1][0].id],
                    "dailyWeeklyRules": [{
                        "dailyRule": result[0][0], "minDay": "1", "maxDay": "1", "dayPattern": "SUN_MON_TUE_WED_THU_SAT"
                    }]
                }]
            };
            var body = values && typeof _.isObject(values) ? _.merge(defaultValues, values) : defaultValues;


            var httpUtils = require('./testHttpUtils.js');
            httpUtils.sendRequest({
                action: 'POST',
                uri: '/schedules/weekly-rule',
                authorization: token,
                body: body
            }).then(function (res) {
                console.log(res);
                deferred.fulfill(res);
            }, function (error) {
                deferred.reject(error);
            });
        });
        return deferred.promise;
    },

    getDailyRules: function (token) {
        var deferred = protractor.promise.defer();
        var httpUtils = require('./testHttpUtils.js');

        httpUtils.sendRequest({
            action: 'GET',
            uri: '/schedules/daily-rule',
            authorization: token,
            timeout: 30000
        }).then(function (response) {
            deferred.fulfill(response.dailyRuleList);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    },

    getWeeklyRules: function (token) {
        var deferred = protractor.promise.defer();
        var httpUtils = require('./testHttpUtils.js');

        httpUtils.sendRequest({
            action: 'GET',
            uri: '/schedules/weekly-rule',
            authorization: token,
            timeout: 30000
        }).then(function (response) {
            deferred.fulfill(response.weeklyRuleList);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    },

    createScheduleUnit: function (name, token) {
        var body = {
            "id": "0",
            "name": name,
            "timeZone": "America/New_York",
            "firstWeekDay": "MONDAY",
            "deltaAdded": [],
            "deltaDeleted": [],
            "workingHours": [{"day": "MONDAY", "amountOfHours": 24, "fromHour": "12:00 AM"}, {
                "day": "TUESDAY",
                "amountOfHours": 24,
                "fromHour": "12:00 AM"
            }, {"day": "WEDNESDAY", "amountOfHours": 24, "fromHour": "12:00 AM"}, {
                "day": "THURSDAY",
                "amountOfHours": 24,
                "fromHour": "12:00 AM"
            }, {"day": "FRIDAY", "amountOfHours": 24, "fromHour": "12:00 AM"}, {
                "day": "SATURDAY",
                "amountOfHours": 24,
                "fromHour": "12:00 AM"
            }, {"day": "SUNDAY", "amountOfHours": 24, "fromHour": "12:00 AM"}]
        };
        var deferred = protractor.promise.defer();
        var httpUtils = require('./testHttpUtils.js');
        httpUtils.sendRequest({
            action: 'POST',
            uri: '/user/groups',
            body: body,
            authorization: token
        }).then(function (response) {
            deferred.fulfill(response.groupId);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    },

    destroyAccount: function () {
        //TODO impl when we have the API
    },

    fillUserFields: function (myemail, values) {
        if (!myemail) {
            myemail = this.getRandomEmail();
        }
        var requestBody = {
            acdUserMappings: [],
            assignedGroup: "11e6272e-8993-ea10-a729-00224d830186",
            emailAddress: myemail,
            firstName: "asfd",
            hireDate: "2016-06-05",
            lastName: "asfd",
            mobileNumber: "234534523",
            rank: "1",
            role: "Employee",
            skills: []
        };
        if (values === undefined) {
            values = {};
        }
        requestBody.firstName = values.firstName || 'ufn';
        requestBody.lastName = values.lastName || 'uln';
        requestBody.mobileNumber = values.mobileNumber || protractor.testUtils.getFullRandomString(10, '1234567890');
        requestBody.assignedGroup = values.assignedGroup || this.getGroups()[0].id;
        requestBody.rank = values.rank || '1';
        requestBody.hireDate = new Date();
        requestBody.role = values.role || 'Employee';
        requestBody.skills = values.skills || [];
        requestBody.groupIds = values.groupIds || [];

        return myemail;
    },

    inviteUserByEmail: function (userEmail, adminEmail, token) {
        var deferred = protractor.promise.defer();
        console.log('1inviteUserByEmail ');
        console.log('1userEmail ' + userEmail);
        console.log('1adminEmail ' + adminEmail);
        console.log('1adminEmail token ' + token);
        browser.executeScript(getToken, token).then(function (token) {
            console.log('2userEmail ' + userEmail);
            console.log('2adminEmail ' + adminEmail);
            var body = {
                emailAddressesList: [userEmail], senderEmail: adminEmail
            };

            var httpUtils = require('./testHttpUtils.js');

            httpUtils.sendRequest({
                action: 'POST',
                uri: '/user/invite',
                authorization: token,
                body: body
            }).then(function (res) {
                console.log('res ' + res);
                deferred.fulfill(res);
            }, function (error) {
                console.log('error ' + error);
                deferred.reject(error);
            });

        });
        return deferred.promise;
    },
    createNewUser: function (myemail, values, token) {
        var deferred = protractor.promise.defer();
        var httpUtils = require('./testHttpUtils.js');

        browser.executeScript(getToken, token).then(function (token) {
            if (!myemail) {
                myemail = protractor.testUtils.getRandomEmail();
            }

            if (!values) {
                values = {};
            }
            httpUtils.sendRequest({
                action: 'POST',
                uri: '/wfo/user/register',
                body: {
                    acdInfos: values.acdInfos || [], //[{loginId: "123"}]
                    assignedGroup: values.assignedGroup || '',
                    emailAddress: myemail,
                    firstName: values.firstName || "asfd",
                    hireDate: values.hireDate || "2016-06-05",
                    lastName: values.lastName || "asfd",
                    mobileNumber: values.mobileNumber || "234534523",
                    rank: values.rank || "1",
                    role: values.role || "Employee",
                    skills: values.skills || [],
                    groupIds: values.groupIds || []
                },
                authorization: token,
                timeout: 30000
            }).then(function (response) {
                console.log('new user email: ' + myemail);
                deferred.fulfill({email: myemail, uuid: response.uuid});
            }, function (error) {
                deferred.reject(error);
            });
        });

        return deferred.promise;
    },
    updateUser: function (values, token) {
        var deferred = protractor.promise.defer();
        var httpUtils = require('./testHttpUtils.js');

        browser.executeScript(getToken, token).then(function (token) {
            if (!values) {
                deferred.reject('no values');
            }
            httpUtils.sendRequest({
                action: 'POST',
                uri: '/wfo/user/update',
                body: {
                    id: values.id,
                    acdInfos: values.acdInfos || [], //[{loginId: "123"}]
                    assignedGroup: values.assignedGroup || '',
                    emailAddress: values.emailAddress,
                    firstName: values.firstName || "asfd",
                    hireDate: values.hireDate || "2016-06-05",
                    lastName: values.lastName || "asfd",
                    mobileNumber: values.mobileNumber || "234534523",
                    rank: values.rank || "1",
                    role: values.role || "Employee",
                    skills: values.skills || [],
                    groupIds: values.groupIds || []
                },
                authorization: token,
                timeout: 30000
            }).then(function (response) {
                console.log('user' + values.firstName + ' ' + values.lastName + 'updated');
                deferred.fulfill(values.id);
            }, function (error) {
                deferred.reject(error);
            });
        });
        return deferred.promise;
    },
    getUsers: function (token) {
        var deferred = protractor.promise.defer();
        var httpUtils = require('./testHttpUtils.js');
        browser.executeScript(getToken, token).then(function (token) {
            httpUtils.sendRequest({
                action: 'GET',
                uri: '/wfo/user',
                authorization: token,
                timeout: 30000
            }).then(function (response) {
                deferred.fulfill(response.users);
            }, function (error) {
                deferred.reject(error);
            });
        });
        return deferred.promise;
    },
    deleteUsers: function (emailAddressesList, token) {
        var deferred = protractor.promise.defer();
        var httpUtils = require('./testHttpUtils.js');
        browser.executeScript(getToken, token).then(function (token) {
            httpUtils.sendRequest({
                action: 'POST',
                uri: '/user/delete',
                body: {
                    emailAddressesList: emailAddressesList
                },
                authorization: token,
                timeout: 30000
            }).then(function (response) {
                deferred.fulfill(response.notDeletedUserEmails);
            }, function (error) {
                deferred.reject(error);
            });
        });
        return deferred.promise;
    },

    updateTenant: function (tenant,licDetailsArray, userSoftLimit) {
        var deferred = protractor.promise.defer();
        var httpUtils = require('./testHttpUtils.js');

        var httpUtils = require('./testHttpUtils.js');

        httpUtils.sendRequest({
            action: 'POST',
            uri: '/public/user/login',
            body: {
                email: protractor.TM_LOGIN_EMAIL_ADDRESS,
                password: protractor.TM_LOGIN_PASSWORD,
                userName: protractor.TM_LOGIN_EMAIL_ADDRESS,
                customAttribute: false,
            },
            timeout: 30000
        }).then(function (res) {
            var body = {
                tenantId: tenant.tenantId,
                tenantName: tenant.tenantName,
                schemaName: tenant.schemaName,
                type: tenant.type,
                billingCycle: tenant.billingCycle,
                metaData: {
                    userCap: tenant.userCap,
                },
                licenses: licDetailsArray || defaultLicenses,
                userSoftLimit: userSoftLimit || tenant.userSoftLimit
            };

            httpUtils.sendRequest({
                action: 'PUT',
                uri: '/tenants',
                authorization: res.token,
                body: body,
                timeout: 30000
            }).then(function(res) {
                console.log('Updated the tenant', res);
                deferred.fulfill();
            });
        });
        return deferred.promise;
    },

    getCurrentTenant: function (token) {
        var deferred = protractor.promise.defer();
        var httpUtils = require('./testHttpUtils.js');
        browser.executeScript(getToken, token).then(function (token) {
            httpUtils.sendRequest({
                action: 'GET',
                uri: '/tenants/current',
                authorization: token,
                timeout: 30000
            }).then(function (response) {
                deferred.fulfill(response.tenant);
            }, function (error) {
                deferred.reject(error);
            });
        });
        return deferred.promise;
    },

    addOrUpdateScheduleUnit: function (values, token) {
        var defaultValues = {
            id: '0',
            firstWeekDay: 'MONDAY',
            timeZone: 'US/Hawaii',
            workingHours: [{'day': 'MONDAY', 'amountOfHours': 24, 'fromHour': '12:00 AM'}, {
                'day': 'TUESDAY',
                'amountOfHours': 24,
                'fromHour': '12:00 AM'
            }, {'day': 'WEDNESDAY', 'amountOfHours': 24, 'fromHour': '12:00 AM'}, {
                'day': 'THURSDAY',
                'amountOfHours': 24,
                'fromHour': '12:00 AM'
            }, {'day': 'FRIDAY', 'amountOfHours': 24, 'fromHour': '12:00 AM'}, {
                'day': 'SATURDAY',
                'amountOfHours': 24,
                'fromHour': '12:00 AM'
            }, {'day': 'SUNDAY', 'amountOfHours': 24, 'fromHour': '12:00 AM'}]
        };
        var deferred = protractor.promise.defer();
        var httpUtils = require('./testHttpUtils.js');

        browser.executeScript(getToken, token).then(function (token) {

            httpUtils.sendRequest({
                action: 'PUT',
                uri: '/user/groups',
                body: {
                    id: values.id || defaultValues.id,
                    deltaAdded: values.deltaAdded || [],
                    deltaDeleted: values.deltaDeleted || [],
                    firstWeekDay: values.firstWeekDay || defaultValues.firstWeekDay,
                    name: values.name,
                    timeZone: values.timeZone || defaultValues.timeZone,
                    workingHours: values.workingHours || defaultValues.workingHours
                },
                authorization: token,
                timeout: 30000
            }).then(function (response) {
                deferred.fulfill(response);
            }, function (error) {
                deferred.reject(error);
            });
        });

        return deferred.promise;
    },
    getScheduleUnits: function (token) {
        var deferred = protractor.promise.defer();
        var httpUtils = require('./testHttpUtils.js');
        browser.executeScript(getToken, token).then(function (token) {
            httpUtils.sendRequest({
                action: 'GET',
                uri: '/user/groups',
                authorization: token,
                timeout: 30000
            }).then(function (response) {
                deferred.fulfill(response.groups);
            }, function (error) {
                deferred.reject(error);
            });
        });
        return deferred.promise;
    },
    getThemeId: function () {
        var deferred = protractor.promise.defer();
        var httpUtils = require('./testHttpUtils.js');
        browser.executeScript("return window.localStorage.getItem('wfo_saas.userToken');").then(function (token) {
            httpUtils.sendRequest({
                action: 'GET',
                uri: '/form-designer/get?elementType=THEME',
                authorization: token,
                timeout: 30000
            }).then(function (response) {
                deferred.fulfill(response.elementData);
            }, function (error) {
                deferred.reject(error);
            });
        });
        return deferred.promise;
    },
    createFormNoUI: function (themeId, formData, token) {
        console.log("Create form called");
        var deferred = protractor.promise.defer();
        console.log("Please check " + formData);
        var formDataJson = JSON.parse(formData);
        var httpUtils = require('./testHttpUtils.js');
        console.log("Object created is " + formDataJson);
        browser.executeScript(getToken, token).then(function (token) {
            httpUtils.sendRequest({
                action: 'POST',
                uri: '/form-designer/create?elementType=FORM',
                body: {
                    elementData: formDataJson
                },
                authorization: token,
                timeout: 30000
            }).then(function (response) {
                console.log('form creation status is ' + response.id);
                deferred.fulfill(response.id);
            }, function (error) {
                deferred.reject(error);
            });
        });

        return deferred.promise;
    },
    createSkill: function (skillName, token) {
        var deferred = protractor.promise.defer();
        var httpUtils = require('./testHttpUtils.js');

        browser.executeScript(getToken, token).then(function (token) {
            httpUtils.sendRequest({
                action: 'POST',
                uri: '/wfo/user/skills',
                body: {
                    'id': '',
                    'name': skillName
                },
                authorization: token,
                timeout: 30000
            }).then(function (response) {
                deferred.fulfill(response);
            }, function (error) {
                deferred.reject(error);
            });
        });
        return deferred.promise;
    },
    getSkills: function (token) {
        var deferred = protractor.promise.defer();
        var httpUtils = require('./testHttpUtils.js');

        browser.executeScript(getToken, token).then(function (token) {
            httpUtils.sendRequest({
                action: 'GET',
                uri: '/wfo/user/skills',
                authorization: token,
                timeout: 30000
            }).then(function (response) {
                deferred.fulfill(response.skills);
            }, function (error) {
                deferred.reject(error);
            });
        });
        return deferred.promise;
    },
    getActivityCodes: function (token) {
        var deferred = protractor.promise.defer();
        var httpUtils = require('./testHttpUtils.js');

        browser.executeScript(getToken, token).then(function (token) {
            httpUtils.sendRequest({
                action: 'GET',
                uri: '/activity-codes',
                authorization: token,
                timeout: 30000
            }).then(function (response) {
                deferred.fulfill(response.activityCodes);
            }, function (error) {
                deferred.reject(error);
            });
        });
        return deferred.promise;
    },

    createGroup: function (groupName, token) {
        var deferred = protractor.promise.defer();
        var httpUtils = require('./testHttpUtils.js');

        browser.executeScript(getToken, token).then(function (token) {
            httpUtils.sendRequest({
                action: 'POST',
                uri: '/group',
                body: {
                    'id': '',
                    'name': groupName
                },
                authorization: token,
                timeout: 30000
            }).then(function (response) {
                deferred.fulfill(response);
            }, function (error) {
                deferred.reject(error);
            });
        });
        return deferred.promise;
    },

    getGroups: function (token) {
        var deferred = protractor.promise.defer();
        var httpUtils = require('./testHttpUtils.js');
        browser.executeScript(getToken, token).then(function (token) {
            httpUtils.sendRequest({
                action: 'GET',
                uri: '/group',
                authorization: token,
                timeout: 30000
            }).then(function (response) {
                deferred.fulfill(response.groups);
            }, function (error) {
                deferred.reject(error);
            });
        });
        return deferred.promise;
    },

    createSchedules: function (scheduleRequest, token) {
        var deferred = protractor.promise.defer();
        var httpUtils = require('./testHttpUtils.js');

        browser.executeScript(getToken, token).then(function (token) {
            httpUtils.sendRequest({
                action: 'POST',
                uri: '/schedules',
                body: scheduleRequest,
                authorization: token,
                timeout: 30000
            }).then(function (response) {
                console.log(response);
                deferred.fulfill(response);
            }, function (error) {
                deferred.reject(error);
            });
        });
        return deferred.promise;
    },

    getSchedules: function (values, token) {
        var deferred = protractor.promise.defer();
        var httpUtils = require('./testHttpUtils.js');

        browser.executeScript(getToken, token).then(function (token) {
            httpUtils.sendRequest({
                action: 'POST',
                uri: '/schedules/search',
                body: {
                    'start': values.start,
                    'end': values.end
                },
                authorization: token,
                timeout: 30000
            }).then(function (response) {
                deferred.fulfill(response);
            }, function (error) {
                deferred.reject(error);
            });
        });
        return deferred.promise;
    },

    publishSchedules: function (publishElements, token) {
        var deferred = protractor.promise.defer();
        var httpUtils = require('./testHttpUtils.js');

        browser.executeScript(getToken, token).then(function (token) {
            httpUtils.sendRequest({
                action: 'POST',
                uri: '/schedules/publish',
                body: {
                    publishElements: publishElements
                },
                authorization: token,
                timeout: 30000
            }).then(function (response) {
                console.log(response);
                deferred.fulfill(response);
            }, function (error) {
                deferred.reject(error);
            });
        });
        return deferred.promise;
    },

    sendAscEvent: function (values, token) {
        var deferred = protractor.promise.defer();
        var httpUtils = require('./testHttpUtils.js');

        browser.executeScript(getToken, token).then(function (token) {
            httpUtils.sendRequest({
                action: 'POST',
                uri: '/asc',
                body: {
                    loginId: values.loginId,
                    acdId: '',
                    eventCode: values.eventCode,
                    reasonCode: values.reasonCode,
                    eventUtcTime: values.eventUtcTime
                },
                authorization: token,
                timeout: 30000
            }).then(function (response) {
                deferred.fulfill(response);
            }, function (error) {
                deferred.reject(error);
            });
        });
        return deferred.promise;
    },

    createUserWithOrWithoutEmailId: function (myemail, values, token) {
        var deferred = protractor.promise.defer();
        var httpUtils = require('./testHttpUtils.js');

        browser.executeScript(getToken, token).then(function (token) {
            var result = {
                responseJson: {},
                firstName: {}
            };

            if (!myemail) {
                myemail = '';
            }

            if (!values) {
                values = {};
            }
            httpUtils.sendRequest({
                action: 'POST',
                uri: '/wfo/user/register',
                body: {
                    acdInfos: values.acdInfos || [], //[{loginId: "123"}]
                    assignedGroup: values.assignedGroup || '',
                    emailAddress: myemail,
                    firstName: values.firstName || "asfd",
                    hireDate: values.hireDate || "2016-06-05",
                    lastName: values.lastName || "asfd",
                    mobileNumber: values.mobileNumber || "234534523",
                    rank: values.rank || "1",
                    role: values.role || "Employee",
                    skills: values.skills || [],
                    groupIds: values.groupIds || []
                },
                authorization: token,
                timeout: 30000
            }).then(function (response) {
                console.log('new user email: ' + myemail);
                console.log(response);
                result.responseJson = response;
                result.firstName = values.firstName || "asfd";
                deferred.fulfill(result);
            }, function (error) {
                deferred.reject(error);
            });
        });
        return deferred.promise;
    },
    getRandomEmployeeDetails: function () {
        return {
            employeeEmailAddress: 'ptor.' + (new Date().getTime()) + '@wfosaas.com',
            employeePassword: "Password1"
        }
    },
    setPasswordNoUI: function (emailId, password, tokenFromURL) {
        console.log("Set Password No UI called for " + emailId + " Password is " + password + " token is " + tokenFromURL);
        var deferred = protractor.promise.defer();
        var httpUtils = require('./testHttpUtils.js');
        browser.executeScript(getToken).then(function (token) {
            httpUtils.sendRequest({
                action: 'POST',
                uri: '/public/user/activate',
                body: {
                    "email": emailId,
                    "password": password,
                    "token": tokenFromURL
                },
                authorization: token,
                timeout: 30000
            }).then(function (response) {
                console.log("set password responce is " + response.user.id);
                deferred.fulfill(response.user.id);
            }, function (error) {
                deferred.reject(error);
            });
        });
        return deferred.promise;
    },
    getRandomEvaluatorDetails: function () {
        return {
            evaluatorEmailAddress: 'ptor.' + (new Date().getTime()) + '@wfosaas.com',
            evaluatorPassword: "Password1"
        }
    },

    createNewRole: function (name, roleDescription, myApplications, token) {
        var deferred = protractor.promise.defer();
        var httpUtils = require('./testHttpUtils.js');

        browser.executeScript(getToken, token).then(function (token) {
            httpUtils.sendRequest({
                action: 'POST',
                uri: '/authorization/role',
                body: {
                    displayName: name,
                    description: roleDescription,
                    status: "ACTIVE",
                    applications: myApplications
                },
                authorization: token,
                timeout: 30000
            }).then(function (response) {
                if (response.success) {
                    console.log('Role ' + name + ' created');
                }
                else {
                    console.log('Role not created');
                }
                deferred.fulfill(name);
            }, function (error) {
                deferred.reject(error);
            });
        });

        return deferred.promise;
    },

    deleteCognitoTenant: function (tenantName) {
        var deferred = protractor.promise.defer();
        if (protractor.IDMTYPE === '2') {
            orgName = tenantName ,
                console.log('organizationName: ' + orgName);

            var httpUtils = require('./testHttpUtils.js');

            httpUtils.sendRequest({
                action: 'POST',
                uri: '/public/user/login',
                body: {
                    email: protractor.TM_LOGIN_EMAIL_ADDRESS,
                    password: protractor.TM_LOGIN_PASSWORD,
                    userName: protractor.TM_LOGIN_EMAIL_ADDRESS,
                    customAttribute: false
                },
                timeout: 30000
            }).then(function (res) {
                console.log('Successful Login to TM');
                httpUtils.sendRequest({
                    action: 'POST',
                    uri: '/user/cleanup',
                    authorization: res.token,
                    body: {
                        poolName: orgName
                    },
                    timeout: 50000
                }).then(function (response) {
                    if (response.success) {
                        console.log('Successful Pool deletion  ' + orgName , response);
                        deferred.fulfill(true);
                    } else {
                        console.log('UserPool deletion from Cognito failed', response);
                        deferred.fulfill(false);
                    }
                }, function (error) {
                    console.log('Account deletion failure, response:');
                    console.log(error);
                    deferred.reject(error);
                });

            }, function (error) {
                console.log('Failed to Login TM');
                console.log(error);
                deferred.reject(error);
            });
        }
        else {
            console.log("Tenant was not deleted from KeyCloak");
            deferred.fulfill(true);
        }
        return deferred.promise;
    },

    createDailyRule: function (ruleName, earliestStart, latestStart, startIncrement, token) {
        var deferred = protractor.promise.defer();
        var httpUtils = require('./testHttpUtils.js');
        httpUtils.sendRequest({
            action: 'POST',
            uri: '/schedules/daily-rule',
            body: {
                dailyRule:{
                    name:ruleName,
                    length:'8',
                    earliestStart: earliestStart,
                    latestStart: latestStart,
                    startIncrement:startIncrement
                }
            },
            authorization: token,
            timeout: 30000
        }).then(function () {
            console.log('Daily Rule ' + ruleName + ' created');
            deferred.fulfill(ruleName);
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    },

    getDailyRule: function (token) {
        var deferred = protractor.promise.defer();
        var httpUtils = require('./testHttpUtils.js');
        httpUtils.sendRequest({
            action: 'GET',
            uri: '/schedules/daily-rule',
            authorization: token,
            timeout: 30000
        }).then(function (response) {
            deferred.fulfill(response.dailyRuleList);
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    },

    createWeeklyRule: function (ruleName, assignedUsers, dailyWeeklyRules, minHours, maxHours, token) {
        var deferred = protractor.promise.defer();
        var httpUtils = require('./testHttpUtils.js');
        httpUtils.sendRequest({
            action: 'POST',
            uri: '/schedules/weekly-rule',
            body: {
                weeklyRuleList:[
                    {
                        name:ruleName,
                        assignedUsersId:assignedUsers,
                        dailyWeeklyRules: dailyWeeklyRules,
                        minHours: minHours,
                        maxHours:maxHours
                    }
                ]
            },
            authorization: token,
            timeout: 30000
        }).then(function () {
            console.log('Weekly Rule ' + ruleName + ' created');
            deferred.fulfill(ruleName);
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    },

    createTeam: function (teamName, description, leadUserId, token) {
        var deferred = protractor.promise.defer();
        var httpUtils = require('./testHttpUtils.js');
        httpUtils.sendRequest({
            action: 'POST',
            uri: '/user-management/v1/teams',
            body: {
                name: teamName,
                description: description,
                leadUserId: leadUserId,
                status: 'ACTIVE'
            },
            authorization: token,
            timeout: 30000
        }).then(function () {
            console.log('Team ' + teamName + ' created');
            deferred.fulfill(teamName);
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    }

};
module.exports = testsUtilsNoUI;
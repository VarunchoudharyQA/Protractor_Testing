var helpers = require('./config-helpers.js');
var SpecReporter = require('jasmine-spec-reporter/src/jasmine-spec-reporter.js');
var seleniumPort = process.env.DOCKER_SELENIUM_PORT || 4444;
var suiteDir = process.env.SUITE_DIR || 'target/chrome-reports';
var AUTH_APP_URL =  process.env.AUTH_APP_URL ||  helpers.getBaseUrl().replace('na1', 'auth');
//TM Login Credentials
var TM_LOGIN_EMAIL_ADDRESS = process.env.TM_LOGIN_EMAIL_ADDRESS || 'tmniceadmin@mailinator.com';
var TM_LOGIN_PASSWORD = process.env.TM_LOGIN_PASSWORD || 'Aa123456';
var IDMTYPE=process.env.IDMTYPE || '2';

exports.config = {
    // Test directly against Chrome and Firefox without using a Selenium Server.
    // If this is true, settings for seleniumAddress and seleniumServerJar will be ignored.
    //directConnect: true,

    // The address of a running selenium server.
    seleniumAddress: 'http://localhost:' + seleniumPort + '/wd/hub',

    baseUrl: helpers.getBaseUrl(),
    // Spec patterns are relative to the configuration file location passed
    // to proractor (in this example conf.js).
    // They may include glob patterns.
    specs: ['../../src/app/**/*.prot.spec.js'],

    //this function is running once before any of the tests
    onPrepare: function () {

        protractor

        protractor.SYNTETIC_MONITOR_ACCOUNT = false;
        protractor.baseApiUrl = helpers.getBaseUrl();
        protractor.suiteDir = suiteDir;
        protractor.TM_LOGIN_EMAIL_ADDRESS = TM_LOGIN_EMAIL_ADDRESS;
        protractor.TM_LOGIN_PASSWORD = TM_LOGIN_PASSWORD;
        protractor.AUTH_APP_URL = AUTH_APP_URL;
        protractor.IDMTYPE=IDMTYPE;

        helpers.setWebdriverRemoteFileDetector();
        helpers.setProtractorHelpers();
        helpers.setWindowDimensions();
        helpers.disableAnimations();

        var HtmlScreenshotReporter =  require('protractor-angular-screenshot-reporter');
        var jasmineReporters = require('jasmine-reporters');

        jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
            savePath: suiteDir,
            filePrefix: 'xml-results',
            consolidateAll: true
        }));

        jasmine.getEnv().addReporter(new HtmlScreenshotReporter({
            baseDirectory: suiteDir + '/screenshots',
            docName: 'chrome-summary-results.html',
            takeScreenShotsOnlyForFailedSpecs: true,
            docTitle: 'Protractor Tests Report - Chrome',
            preserveDirectory: false
        }).getJasmine2Reporter());

        jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace: 'all'}));
    },

    allScriptsTimeout: 60000,
    getPageTimeout: 30000,
    framework: 'jasmine2',

    jasmineNodeOpts: {
        onComplete: null,
        isVerbose: true,
        showColors: true,
        includeStackTrace: true,
        defaultTimeoutInterval: 400000,
        silent: true,
        print: function () {
        }
    }
};
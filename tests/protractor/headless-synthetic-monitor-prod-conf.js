var config = require('./headless-chrome-conf.js').config;
var helpers = require('./config-helpers.js');

var seleniumPort = process.env.DOCKER_SELENIUM_PORT || 4447;

//TM Login Credentials
var TM_LOGIN_EMAIL_ADDRESS = process.env.TM_LOGIN_EMAIL_ADDRESS || 'tmniceadmin@mailinator.com';
var TM_LOGIN_PASSWORD = process.env.TM_LOGIN_PASSWORD || 'Aa123456';
var AUTH_APP_URL =  process.env.AUTH_APP_URL || 'https://auth.dev.nice-incontact.com';

//IDMTYPE settings
var IDMTYPE=process.env.IDMTYPE||'2';

//synthetic monitor credentials
var SYNTHETIC_MONITOR_ACCOUNT_EMAIL = process.env.SYNTHETIC_MONITOR_ACCOUNT_EMAIL || 'syntheticmonitor_admin_30082017@mailinator.com';
var SYNTHETIC_MONITOR_ACCOUNT_NAME = process.env.SYNTHETIC_MONITOR_ACCOUNT_NAME || 'syntheticMonitorTenant_302017_admin';

// The address of a running selenium server.
config.seleniumAddress = 'http://localhost:' + seleniumPort + '/wd/hub';
config.specs = ['../../src/app/syntheticMonitor/syntheticMonitor.prot.spec.js'];

// Turn off sharding for synthetic monitor. Not much reason to shard it, and
// since it does it's own reporting configuration, it doesn't get the benefit
// of the reporting consolidation for sharding from the base-conf.js.
config.capabilities.shardTestFiles = false;
config.capabilities.maxInstances = 1;

//this function is running once before any of the tests
config.onPrepare = function () {
    protractor.SYNTETIC_MONITOR_ACCOUNT = true;
    protractor.SYNTHETIC_MONITOR_ACCOUNT_EMAIL = SYNTHETIC_MONITOR_ACCOUNT_EMAIL;
    protractor.SYNTHETIC_MONITOR_ACCOUNT_NAME = SYNTHETIC_MONITOR_ACCOUNT_NAME;
    protractor.baseApiUrl = helpers.getBaseUrl();
    protractor.TM_LOGIN_EMAIL_ADDRESS = TM_LOGIN_EMAIL_ADDRESS;
    protractor.TM_LOGIN_PASSWORD = TM_LOGIN_PASSWORD;
    protractor.AUTH_APP_URL = AUTH_APP_URL;
    protractor.IDMTYPE=IDMTYPE;

    helpers.setWebdriverRemoteFileDetector();
    helpers.setProtractorHelpers();
    helpers.setWindowDimensions();
    helpers.disableAnimations();

    var Jasmine2HtmlReporter = require('protractor-jasmine2-html-reporter');
    var HtmlScreenshotReporter =  require('protractor-jasmine2-screenshot-reporter');
    var jasmineReporters = require('jasmine-reporters');

    jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
        savePath: 'target/synthetic-monitor-reports/prod/tests-xmls',
        filePrefix: 'TEST-',
        consolidateAll: false
    }));

    jasmine.getEnv().addReporter(new HtmlScreenshotReporter({
        dest: 'target/synthetic-monitor-reports/screenshots/prod',
        filename: 'synthetic-monitor-summary-results.html',
        reportOnlyFailedSpecs: false,
        captureOnlyFailedSpecs: true,
        showSummary: true,
        showQuickLinks: true,
        showConfiguration: true,
        reportTitle: "Protractor Tests Report - Synthetic Monitor Prod"
    }));

    jasmine.getEnv().addReporter(new Jasmine2HtmlReporter({
        savePath: 'target/synthetic-monitor-reports/prod',
        filePrefix: 'results.html',
        takeScreenshots: false
    }));

    var SpecReporter = require('jasmine-spec-reporter/src/jasmine-spec-reporter.js');
    jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace: 'all'}));
};

// Overwriting base afterLaunch handling of junit reports since synthetic
// monitor uses own reporting configuration.
config.afterLaunch = function() {};

exports.config = config;
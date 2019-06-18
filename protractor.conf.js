const { SpecReporter } = require('jasmine-spec-reporter');

var suiteDir = process.env.SUITE_DIR || 'target/chrome-reports';

exports.config = {
  allScriptsTimeout: 20000,
  specs: [
    './src/Partner/Partner.e2e-spec.ts',
  ],
  capabilities: {
    'browserName': 'chrome',
  },
  directConnect: true,
  baseUrl: 'https://presencesync.dev.niceincontact.com',
  framework: 'jasmine',

  onPrepare: function () {
    var HtmlScreenshotReporter = require('protractor-angular-screenshot-reporter');
    var jasmineReporters = require('jasmine-reporters');

    browser.driver.manage().window().getSize().then(function (size) {
      var window = browser.manage().window(),
        minWindowWidth = 1300,
        minWindowHeight = 800;

      var width = Math.max(size.width, minWindowWidth),
        height = Math.max(size.height, minWindowHeight);
      return window.setSize(width, height);
    });
    browser.manage().timeouts().implicitlyWait(5000);
    browser.manage().timeouts().setScriptTimeout(60000);

    browser.ignoreSynchronization = true;
    browser.waitForAngularEnabled(false);

    require('ts-node').register({
      project: require('path').join('proxyconfig.json')
    });

    jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
      savePath: suiteDir,
      filePrefix: 'xml-results',
      consolidateAll: true
    }));

    jasmine.getEnv().addReporter(new HtmlScreenshotReporter({
      baseDirectory: suiteDir,
      docName: 'chrome-summary-results.html',
      takeScreenShotsOnlyForFailedSpecs: true,
      docTitle: 'Protractor Tests Report - Chrome',
      preserveDirectory: false
    }).getJasmine2Reporter());
    jasmine.getEnv().addReporter(new SpecReporter({spec: {displayStacktrace: true}}));
  },

  getPageTimeout: 30000,

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

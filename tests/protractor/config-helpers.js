module.exports = {
    getBaseUrl: function () {
        return process.env.PROTRACTOR_BASE_URL || 'http://na1.dev.localhost:8088';
    },

    setWebdriverRemoteFileDetector: function () {
        var webdriverRemote = require('selenium-webdriver/remote');
        browser.setFileDetector(new webdriverRemote.FileDetector());
    },

    setProtractorHelpers: function () {
        protractor.testUtils = require('./common/testsUtils.js');
        protractor.testUtilsNoUI = require('./common/testUtilsNoUI.js');
        protractor.featureToggleTestUtils = require('./common/featureTogglesUtils.js');
        protractor.commonNoUIUtils = require('../../node_modules/nice-protractor-test-utils/protractor/commonNoUIUtils');
        protractor.adminUtilsNoUI = require('../../node_modules/nice-protractor-test-utils/protractor/adminUtilsNoUI');
    },

    setWindowDimensions: function () {
        var window = browser.manage().window(),
            minWindowWidth = 1300,
            minWindowHeight = 800;

        window.getSize().then(function (dimensions) {
            var width = Math.max(dimensions.width, minWindowWidth),
                height = Math.max(dimensions.height, minWindowHeight);

            return window.setSize(width, height);
        }).then(function () {
            return window.getSize();
        }).then(function (dimensions) {
            console.log('*** Browser dimensions: ', dimensions.width, ' x ', dimensions.height);
        });
    },

    disableAnimations: function () {
        var disableNgAnimate = function () {
            angular.module('disableNgAnimate', []).run(['$animate', function ($animate) {
                $animate.enabled(false);
            }]);
        };

        var disableCssAnimate = function () {
            angular.module('disableCssAnimate', []).run(function () {
                var style = document.createElement('style');
                style.type = 'text/css';
                style.innerHTML = '* {' +
                    '-webkit-transition: none !important;' +
                    '-moz-transition: none !important' +
                    '-o-transition: none !important' +
                    '-ms-transition: none !important' +
                    'transition: none !important' +
                    '}';
                document.getElementsByTagName('head')[0].appendChild(style);
            });
        };

        browser.addMockModule('disableNgAnimate', disableNgAnimate);
        browser.addMockModule('disableCssAnimate', disableCssAnimate);
    }
};
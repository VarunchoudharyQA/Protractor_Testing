var config = require('./base-conf.js').config;

config.capabilities = {
    browserName: 'chrome',
    chromeOptions: {
        args: [
            '--disable-web-security',
            '--ignore-certificate-errors',
            '--test-type',
            '--disable-extensions',
            '--disable-infobars'
        ],
        prefs: {
            'password_manager_enabled': false,
            'profile.password_manager_enabled': false,
            'credentials_enable_service': false
        }
    }
};

exports.config = config;

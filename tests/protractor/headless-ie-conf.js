var config = require('./base-conf.js').config;

config.capabilities = {
    browserName: 'internet explorer',
    platform: 'ANY',
    version: '11'
};

exports.config = config;

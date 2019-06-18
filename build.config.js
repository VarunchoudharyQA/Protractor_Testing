/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {
    /**
     * The `build_dir` folder is where our projects are compiled during
     * development and the `compile_dir` folder is where our app resides once it's
     * completely built.
     */
    build_dir: 'build',
    bower_components: 'vendor',
    nice_components: 'niceComponents',
    compile_dir: 'bin',
    temp_dir: 'temp',
    node_modules_dir: 'node_modules',
    build_info_file: 'buildInfo.json',

    /**
     * This is a collection of file patterns that refer to our app code (the
     * stuff in `src/`). These file paths are used in the configuration of
     * build tasks. `js` is all project javascript, less tests. `ctpl` contains
     * our reusable components' (`src/common`) template HTML files, while
     * `atpl` contains the same, but for our app's code. `html` is just our
     * main HTML file, `less` is our main stylesheet, and `unit` contains our
     * app's unit tests.
     */
    app_files: {
        js: ['src/*.js', 'src/**/*Module.js', 'src/**/*.js', '!src/**/*.spec.js', '!src/assets/**/*.js', '!src/**/*.po.js', '!src/**/*.expect.js'],
        jsunit: ['src/**/*.spec.js', '!src/**/*.prot.spec.js', '!src/**/*.po.js', '!src/**/*.expect.js'],

        coffee: ['src/**/*.coffee', '!src/**/*.spec.coffee'],
        coffeeunit: ['src/**/*.spec.coffee'],

        atpl: ['src/app/**/*.tpl.html'],
        ctpl: ['src/common/**/*.tpl.html'],

        html: ['index.html'],
        initScript: ['src/initScript.js'],
        less: 'src/less/main.less',
        less_variables: 'src/less/variables.less',
        initialization_service: 'src/common/services/initializationService.js',
        configuration_json: 'assets/conf/configuration*.json'
    },

    /**
     * This is a collection of files used during testing only.
     */
    test_files: {
        js: [
            'vendor/angular-mocks/angular-mocks.js'
        ],
        protractor: {
            specs: {
                /**User Admin**/
                suite_01: [
                    'src/app/**/e2escenarios.prot.spec.js'
                ],
                suite_02: [
                    'src/app/**/tenants.prot.spec.js',
                    'src/app/**/roleSync.prot.spec.js'
                ],
                suite_03: [
                    'src/app/userManagement/**/userMfaService.prot.spec.js',
                    'src/app/loginAuthenticatorManagement/*.prot.spec.js',
                    'src/app/teams/**/*.prot.spec.js'
                ],
                suite_04: [
                    'src/app/userManagement/**/userManagement.prot.spec.js',
                    'src/app/userManagement/**/userManagementCognito.prot.spec.js'
                ],
                suite_05: [
                    'src/app/userManagement/**/createUserTabs.prot.spec.js',
                    'src/app/userManagement/**/userAttributes.prot.spec.js'
                ],
                suite_06: [
                    'src/app/userManagement/**/importUsers.prot.spec.js'
                ],
                suite_07: [
                    'src/app/userManagement/**/createUserValidations.prot.spec.js',
                    'src/app/permissionDirective.prot.spec.js',
                    'src/app/featureToggleUtil.prot.spec.js'
                ],
                suite_08: [
                    'src/app/skills/**/*.prot.spec.js',
                    'src/app/groups/**/*.prot.spec.js',
                    'src/app/employeeGroups/**/*.prot.spec.js'
                ],
                suite_09: [
                    'src/app/roleManagement/**/*.prot.spec.js',
                    'src/app/recordingConfigurations/**/*.prot.spec.js'
                ],
                suite_10: [
                    'src/app/passwordPolicyManagement/*.prot.spec.js',
                    'src/app/syntheticMonitor/*.prot.spec.js'
                ]
            }
        }
    },

    /**
     * This is the same as `app_files`, except it contains patterns that
     * reference vendor code (`vendor/`) that we need to place into the build
     * process somewhere. While the `app_files` property ensures all
     * standardized files are collected for compilation, it is the user's job
     * to ensure non-standardized (i.e. vendor-related) files are handled
     * appropriately in `vendor_files.js`.
     *
     * The `vendor_files.js` property holds files to be automatically
     * concatenated and minified with our project source files.
     *
     * The `vendor_files.css` property holds any CSS files to be automatically
     * included in our app.
     *
     * The `vendor_files.assets` property holds any assets to be copied along
     * with our app's assets. This structure is flattened, so it is not
     * recommended that you use wildcards.
     */
    vendor_files: {
        js: [
            'vendor/jquery/dist/jquery.min.js',
            'vendor/angular/angular.js',
            'vendor/angular-cookies/angular-cookies.min.js',
            'vendor/angular-resource/angular-resource.min.js',
            'vendor/angular-bootstrap/ui-bootstrap-tpls.js',
            'vendor/angular-ui-indeterminate/dist/indeterminate.min.js',
            'vendor/angular-ui-router/release/angular-ui-router.js',
            'vendor-unmanaged/jquery-ui/jquery-ui.min.js',
            'vendor/angular-jquery-timepicker/src/timepickerdirective.min.js',
            'vendor/jquery-timepicker-jt/jquery.timepicker.min.js',
            'vendor/lodash/lodash.min.js',
            'vendor/moment/min/moment-with-locales.min.js',
            'vendor/angular-messages/angular-messages.js',
            'vendor/angular-local-storage/dist/angular-local-storage.min.js',
            'vendor/moment-timezone/builds/moment-timezone-with-data.min.js',
            'vendor/moment-duration-format/lib/moment-duration-format.js',
            'vendor/angular-ui-select/dist/select.js',
            'vendor/angular-sanitize/angular-sanitize.js',
            'vendor/angular-translate/angular-translate.js',
            'vendor/angular-translate-handler-log/angular-translate-handler-log.js',
            'vendor/bootstrap/dist/js/bootstrap.min.js',
            'vendor/angular-hotkeys/build/hotkeys.min.js',
            'vendor/angular-loading-bar/build/loading-bar.min.js',
            'vendor/interact/dist/interact.min.js',
            'vendor/ng-file-upload/ng-file-upload.min.js',
            'vendor/angular-progress-button-styles/dist/angular-progress-button-styles.min.js',
            'vendor/d3/d3.js',
            'vendor/nvd3/build/nv.d3.js',
            'vendor/angular-nvd3/dist/angular-nvd3.js',
            'vendor/element-resize-detector/dist/element-resize-detector.js',
            'vendor/sockjs-client/dist/sockjs.js',
            'vendor/angular-sockjs/src/index.js',
            'vendor/angular-gridster/dist/angular-gridster.min.js',
            'vendor/ngDraggable/ngDraggable.js',
            'vendor/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.js',
            'vendor/svgxuse/svgxuse.min.js'
        ],
        css: [
            'vendor/angular-hotkeys/build/hotkeys.css',
            'vendor/angular-loading-bar/build/loading-bar.min.css',
            'vendor/components-font-awesome/css/font-awesome.min.css',
            'vendor/angular-progress-button-styles/dist/angular-progress-button-styles.min.css',
            'vendor/nvd3/build/nv.d3.css',
            'vendor/angular-gridster/dist/angular-gridster.min.css',
            'vendor/angular-bootstrap-colorpicker/css/colorpicker.css',
            'vendor/bootstrap/dist/css/bootstrap.css'
        ],
        font: [
            'vendor/bootstrap/fonts/*',
            'vendor/components-font-awesome/fonts/*'
        ],
        assets: []
    },

    environments: {
        dev: 'dev',
        prod: 'prod'
    }
};

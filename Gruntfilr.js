module.exports = function (grunt) {
    'use strict';

    var fs = require("fs");
    var appContext = grunt.file.readJSON('src/assets/conf/configuration.json').appContext;

    /**
     * Load required Grunt tasks. These are installed based on the versions listed
     * in `package.json` when you do `npm install` in this directory.
     */
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-git-revision');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks("grunt-jscs");
    grunt.loadNpmTasks('grunt-protractor-runner');
    grunt.loadNpmTasks('grunt-protractor-webdriver');
    grunt.loadNpmTasks('grunt-webdriver-manager');
    grunt.loadNpmTasks('grunt-selenium-webdriver');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-cache-bust');
    grunt.loadNpmTasks('grunt-istanbul');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-json-angular-translate');
    grunt.loadNpmTasks('grunt-search');
    grunt.loadNpmTasks('grunt-wait-server');

    /**
     * Load in our build configuration file.
     */
    var userConfig = require('./build.config.js');

    /**
     * Load in our common functions file.
     */
    var common = require('./buildCommon.js');
    var commonFunctions = common();
    /**
     * This is the configuration object Grunt uses to give each plugin its
     * instructions.
     */
    var taskConfig = {
        revision: {
            options: {
                property: 'meta.revision',
                ref: 'HEAD',
                short: false
            }
        },

        cacheBust: {
            options: {
                baseDir: './<%= compile_dir %>/assets/',
                assets: ['img/favicon-16x16.png', 'fonts/icomoon*', '<%= pkg.name %>-<%= pkg.version %>.css', '<%= pkg.name %>-<%= pkg.version %>.js'],
                encoding: 'utf8',
                algorithm: 'md5',
                length: 16,
                deleteOriginals: false
            },
            src: ['./<%= compile_dir %>/index.html', './<%= compile_dir %>/assets/*.css']
        },

        /**
         * Starts Connect development server
         */
        connect: {
            dev: {
                options: {
                    port: 9411,
                    // The hostname on which the webserver can be accessed.
                    // Setting it to '*', like '0.0.0.0', will make the server accessible from any local IPv4 address like '127.0.0.1'
                    // and the IP assigned to an ethernet or wireless interface (like '192.168.0.x' or '10.0.0.x').
                    hostname: "localhost",
                    base: "./build",
                    livereload: 35732,
                    open: false
                    // Prevents Grunt to close just after the task (starting the server) completes
                    // This will be removed later as `watch` will take care of that
                    //keepalive: true
                }
            },
            preprod: {
                options: {
                    port: 9112,
                    hostname: "localhost",
                    base: "./build",
                    livereload: true,
                    open: false
                }
            },
            prod: {
                options: {
                    port: 9113,
                    hostname: "localhost",
                    base: "./bin",
                    livereload: true,
                    open: true,
                    keepalive: true
                }
            }
        },

        protractor: {
            options: {
                // Location of your protractor config file
                configFile: "tests/protractor/headless-chrome-conf.js",

                // Do you want the output to use fun colors?
                noColor: false,

                // Set to true if you would like to use the Protractor command line debugging tool
                // debug: true,

                // Additional arguments that are passed to the webdriver command
                args: {}
            },

            headless_e2e: {
                options: {
                    configFile: "tests/protractor/headless-chrome-conf.js",
                    // Stops Grunt process if a test fails
                    keepAlive: false
                }
            },

            headless_e2e_chrome: {
                options: {
                    configFile: "tests/protractor/headless-chrome-conf.js",
                    // Stops Grunt process if a test fails
                    keepAlive: false
                }
            },

            headless_e2e_ie: {
                options: {
                    configFile: "tests/protractor/headless-ie-conf.js",
                    // Stops Grunt process if a test fails
                    keepAlive: false
                }
            },

            headless_e2e_firefox: {
                options: {
                    configFile: "tests/protractor/headless-firefox-conf.js",
                    // Stops Grunt process if a test fails
                    keepAlive: false
                }
            },

            headless_e2e_safari: {
                options: {
                    configFile: "tests/protractor/headless-safari-conf.js",
                    // Stops Grunt process if a test fails
                    keepAlive: false
                }
            },

            headless_e2e_synthetic_monitor_prod: {
                options: {
                    configFile: "tests/protractor/headless-synthetic-monitor-prod-conf.js",
                    // Stops Grunt process if a test fails
                    keepAlive: false
                }
            },

            e2e: {
                options: {
                    configFile: "tests/protractor/headless-chrome-conf.js",
                    // Stops Grunt process if a test fails
                    keepAlive: false
                }
            },

            // headless e2e chrome divided to different suites
            headless_e2e_chrome_conf_app_suite_01: {
                options: {
                    configFile: "tests/protractor/headless-chrome-conf.js",
                    keepAlive: false,
                    args: {
                        specs: ['<%= test_files.protractor.specs.suite_01 %>']
                    }
                }
            },

            headless_e2e_chrome_conf_app_suite_02: {
                options: {
                    configFile: "tests/protractor/headless-chrome-conf.js",
                    keepAlive: false,
                    args: {
                        specs: ['<%= test_files.protractor.specs.suite_02 %>']
                    }
                }
            },

            headless_e2e_chrome_conf_app_suite_03: {
                options: {
                    configFile: "tests/protractor/headless-chrome-conf.js",
                    keepAlive: false,
                    args: {
                        specs: ['<%= test_files.protractor.specs.suite_03 %>']
                    }
                }
            },

            headless_e2e_chrome_conf_app_suite_04: {
                options: {
                    configFile: "tests/protractor/headless-chrome-conf.js",
                    keepAlive: false,
                    args: {
                        specs: ['<%= test_files.protractor.specs.suite_04 %>']
                    }
                }
            },

            headless_e2e_chrome_conf_app_suite_05: {
                options: {
                    configFile: "tests/protractor/headless-chrome-conf.js",
                    keepAlive: false,
                    args: {
                        specs: ['<%= test_files.protractor.specs.suite_05 %>']
                    }
                }
            },

            headless_e2e_chrome_conf_app_suite_06: {
                options: {
                    configFile: "tests/protractor/headless-chrome-conf.js",
                    keepAlive: false,
                    args: {
                        specs: ['<%= test_files.protractor.specs.suite_06 %>']
                    }
                }
            },

            headless_e2e_chrome_conf_app_suite_07: {
                options: {
                    configFile: "tests/protractor/headless-chrome-conf.js",
                    keepAlive: false,
                    args: {
                        specs: ['<%= test_files.protractor.specs.suite_07 %>']
                    }
                }
            },

            headless_e2e_chrome_conf_app_suite_08: {
                options: {
                    configFile: "tests/protractor/headless-chrome-conf.js",
                    keepAlive: false,
                    args: {
                        specs: ['<%= test_files.protractor.specs.suite_08 %>']
                    }
                }
            },

            headless_e2e_chrome_conf_app_suite_09: {
                options: {
                    configFile: "tests/protractor/headless-chrome-conf.js",
                    keepAlive: false,
                    args: {
                        specs: ['<%= test_files.protractor.specs.suite_09 %>']
                    }
                }
            },

            headless_e2e_chrome_conf_app_suite_10: {
                options: {
                    configFile: "tests/protractor/headless-chrome-conf.js",
                    keepAlive: false,
                    args: {
                        specs: ['<%= test_files.protractor.specs.suite_10 %>']
                    }
                }
            }
        },

        protractor_webdriver: {
            webdriver: {
                options: {
                    path: './node_modules/protractor/bin/'
                }
            }
        },

        webdrivermanager: {
            out_dir: './node_modules/protractor/selenium'
            /*
             capabilities: {
             browserName: 'chrome'
             },
             seleniumArgs: [],
             seleniumPort: 4444,
             ignore_ssl: false,
             proxy: false,
             method: 'GET'
             */
        },

        exec: {
            // Download and update webdriver-manager script within protractor node module
            updateWebDriverManager: 'node ./node_modules/protractor/bin/webdriver-manager update'
        },

        /**
         * We read in our `package.json` file so we can access the package name and
         * version. It's already there, so we don't repeat ourselves here.
         */
        pkg: grunt.file.readJSON("package.json"),
        conf_dev: grunt.file.readJSON("src/assets/conf/configuration_dev.json"),
        conf_prod: grunt.file.readJSON("src/assets/conf/configuration_production.json"),

        /**
         * The banner is the comment that is placed at the top of our compiled
         * source files. It is first processed as a Grunt template, where the `<%=`
         * pairs are evaluated based on this very configuration object.
         */
        meta: {
            banner: '/**\n' +
            ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
            ' * <%= pkg.homepage %>\n' +
            ' *\n' +
            ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            //' * Licensed <%= pkg.licenses.type %> <<%= pkg.licenses.url %>>\n' +
            ' */\n'
        },

        /**
         * Increments the version number, etc.
         */
        bump: {
            options: {
                files: [
                    "package.json",
                    "bower.json"
                ],
                commit: false,
                commitMessage: 'chore(release): v%VERSION%',
                commitFiles: [
                    "package.json",
                    "client/bower.json"
                ],
                createTag: false,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: false,
                pushTo: 'origin'
            }
        },

        /**
         * The directories to delete when `grunt clean` is executed.
         */
        clean: {
            build: ['<%= build_dir %>', '<%= compile_dir %>']
        },

        /**
         * The `copy` task just copies files from A to B. We use it here to copy
         * our project assets (images, fonts, etc.) and javascripts into
         * `build_dir`, and then to copy the assets to `compile_dir`.
         */
        copy: {
            build_app_assets: {
                files: [
                    {
                        src: ['**', '**/img/**'],
                        dest: '<%= build_dir %>/assets/',
                        cwd: 'src/assets',
                        expand: true
                    },
                    {
                        src: ['**'],
                        dest: '<%= build_dir %>/assets/<%= pkg.version %>/img/',
                        cwd: 'src/assets/img',
                        expand: true
                    }
                ]
            },
            build_vendor_assets: {
                files: [
                    {
                        src: ['<%= vendor_files.assets %>'],
                        dest: '<%= build_dir %>/assets/',
                        cwd: '.',
                        expand: true,
                        flatten: true
                    }
                ]
            },
            build_appjs: {
                files: [
                    {
                        src: ['<%= app_files.js %>'],
                        dest: '<%= build_dir %>/',
                        cwd: '.',
                        expand: true
                    }
                ]
            },
            build_buildinfo: {
                files: [
                    {
                        src: '<%= build_info_file %>',
                        dest: '<%= build_dir %>/',
                        cwd: '.',
                        expand: true
                    },
                    {
                        src: '<%= build_info_file %>',
                        dest: '<%= compile_dir %>/',
                        cwd: '.',
                        expand: true
                    }
                ],
                options: {
                    processContent: function (content, srcpath) {
                        return grunt.template.process(content);
                    }
                }
            },
            build_vendorjs: {
                files: [
                    {
                        src: ['<%= vendor_files.js %>'],
                        dest: '<%= build_dir %>/',
                        cwd: '.',
                        expand: true
                    }
                ]
            },
            build_vendorcss: {
                files: [
                    {
                        src: ['<%= vendor_files.css %>'],
                        dest: '<%= build_dir %>/',
                        cwd: '.',
                        expand: true
                    }
                ]
            },
            build_vendorfont: {
                files: [
                    {
                        src: ['<%= vendor_files.font %>'],
                        dest: '<%= build_dir %>/fonts',
                        cwd: '.',
                        expand: true,
                        flatten: true
                    }
                ]
            },
            compile_assets: {
                files: [
                    {
                        src: ['**'],
                        dest: '<%= compile_dir %>/assets',
                        cwd: '<%= build_dir %>/assets',
                        expand: true
                    },
                    {
                        src: ['**'],
                        dest: '<%= compile_dir %>/fonts',
                        cwd: '<%= build_dir %>/fonts',
                        expand: true
                    },
                    {
                        src: ['<%= vendor_files.css %>'],
                        dest: '<%= compile_dir %>/',
                        cwd: '.',
                        expand: true
                    }
                ]
            },
            compile_webinf: {
                files: [
                    {
                        src: ['WEB-INF/*'],
                        dest: '<%= compile_dir %>/',
                        cwd: '<%= build_dir %>',
                        expand: true
                    }
                ]
            },
            page_objects: {
                files: [
                    {
                        src: ['src/**/*.po.js', 'src/**/*.expect.js', '<%= bower_components %>/**/*.po.js', '<%= bower_components %>/**/*.expect.js'],
                        dest: '<%= node_modules_dir %>/',
                        cwd: '.',
                        expand: true,
                        flatten: true
                    }
                ]
            }
        },

        /**
         * `grunt concat` concatenates multiple source files into a single file.
         */
        concat: {
            /**
             * The `build_css` target concatenates compiled CSS and vendor CSS
             * together.
             */
            build_css: {
                src: [
                    '<%= vendor_files.css %>',
                    '<%= build_dir %>/<%= nice_components %>/**/*.css',
                    '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'

                ],
                dest: '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
            },
            /**
             * The `compile_js` target is the concatenation of our application source
             * code and all specified vendor source code into a single file.
             */
            compile_js: {
                options: {
                    banner: '<%= meta.banner %>'
                },
                src: [
                    '<%= vendor_files.js %>',
                    'module.prefix',
                    '<%= html2js.app.dest %>',
                    '<%= html2js.common.dest %>',
                    '<%= build_dir %>/strings_*.js',
                    '<%= build_dir %>/<%= nice_components %>/**/dist/*.js',
                    '<%= build_dir %>/src/**/*.js',
                    'module.suffix'
                ],
                dest: '<%= compile_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.js'
            }
        },

        /**
         * `grunt s` compiles the CoffeeScript sources. To work well with the
         * rest of the build, we have a separate compilation task for sources and
         * specs so they can go to different places. For example, we need the
         * sources to live with the rest of the copied JavaScript so we can include
         * it in the final build, but we don't want to include our specs there.
         */
        coffee: {
            source: {
                options: {
                    bare: true
                },
                expand: true,
                cwd: '.',
                src: ['<%= app_files.coffee %>'],
                dest: '<%= build_dir %>',
                ext: '.js'
            }
        },

        /**
         * `ng-min` annotates the sources before minifying. That is, it allows us
         * to code without the array syntax.
         */
        ngAnnotate: {
            compile: {
                files: [
                    {
                        /*src: [ '<%= app_files.js %>' ],
                         cwd: '<%= build_dir %>',
                         dest: '<%= build_dir %>',
                         expand: true*/
                        '<%= compile_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.js': [
                            '<%= vendor_files.js %>',
                            '<%= build_dir %>/<%= nice_components %>/**/dist/*.js',
                            'module.prefix',
                            '<%= html2js.app.dest %>',
                            '<%= html2js.common.dest %>',
                            '<%= build_dir %>/strings_*.js',
                            '<%= build_dir %>/src/**/*Module.js',
                            '<%= build_dir %>/src/**/*.js',
                            '!<%= build_dir %>/src/initScript.js',
                            'module.suffix',
                            '<%= build_dir %>/src/initScript.js'
                        ]
                    }
                ]
            }
        },

        /**
         * Minify the sources!
         */
        uglify: {
            compile: {
                options: {
                    banner: '<%= meta.banner %>',
                    sourceMap: true
                },
                files: {
                    '<%= concat.compile_js.dest %>': '<%= concat.compile_js.dest %>'
                }
            }
        },

        /**
         * `grunt-contrib-less` handles our LESS compilation and uglification automatically.
         * Only our `main.less` file is included in compilation; all other files
         * must be imported from this file.
         */
        less: {
            build: {
                files: {
                    '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css': '<%= app_files.less %>'
                },
                options: {
                    strictMath: true
                }
            },
            compile: {
                files: {
                    '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css': '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
                },
                options: {
                    cleancss: true,
                    compress: true,
                    strictMath: true
                }
            }
        },

        /**
         * 'grunt-contrib-cssmin' is used to minify css files
         */
        cssmin: {
            options: {
                shorthandCompacting: true,
                roundingPrecision: -1,
                keepSpecialComments: 0
            },
            target: {
                files: {
                    '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css': '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
                }
            }
        },

        /**
         * `jshint` defines the rules of our linter as well as which files we
         * should check. This file, all javascript sources, and all our unit tests
         * are linted based on the policies listed in `options`. But we can also
         * specify exclusionary patterns by prefixing them with an exclamation
         * point (!); this is useful when code comes from a third party but is
         * nonetheless inside `src/`.
         */
        jshint: {
            src: [
                '<%= app_files.js %>'
            ],
            test: [
                '<%= app_files.jsunit %>'
            ],
            gruntfile: [
                'Gruntfile.js'
            ],
            options: {
                jshintrc: true,
                reporterOutput: ""
            }
        },

        jscs: {
            src: {
                files: {
                    src: ['<%= app_files.js %>']
                }
            },
            test: {
                files: {
                    src: ['<%= app_files.jsunit %>']
                }
            },
            options: {
                config: ".jscsrc",
                verbose: true
            }
        },


        /**
         * `coffeelint` does the same as `jshint`, but for CoffeeScript.
         * CoffeeScript is not the default in nice.saas.wfm, so we're just using
         * the defaults here.
         */
        coffeelint: {
            src: {
                files: {
                    src: ['<%= app_files.coffee %>']
                }
            },
            test: {
                files: {
                    src: ['<%= app_files.coffeeunit %>']
                }
            }
        },

        /**
         * HTML2JS is a Grunt plugin that takes all of your template files and
         * places them into JavaScript files as strings that are added to
         * AngularJS's template cache. This means that the templates too become
         * part of the initial payload as one JavaScript file. Neat!
         */
        html2js: {
            /**
             * These are the templates from `src/app`.
             */
            app: {
                options: {
                    base: 'src/app'
                },
                src: ['<%= app_files.atpl %>'],
                dest: '<%= build_dir %>/templates-app.js'
            },

            /**
             * These are the templates from `src/common`.
             */
            common: {
                options: {
                    base: 'src/common'
                },
                src: ['<%= app_files.ctpl %>'],
                dest: '<%= build_dir %>/templates-common.js'
            }
        },

        /**
         * The Karma configurations.
         */
        karma: {
            app: {
                configFile: './tests/karma/karma-app.config.js'
            },
            commonDirectivesAndFilters: {
                configFile: './tests/karma/karma-directives-filters.config.js'
            },
            commonModelsServicesUtils: {
                configFile: './tests/karma/karma-models-services-utils.config.js'
            },
            all: {
                configFile: './tests/karma/karma-all.config.js'
            }
        },

        /**
         * The `index` task compiles the `index.html` file as a Grunt template. CSS
         * and JS files co-exist here but they get split apart later.
         */
        index: {

            /**
             * During development, we don't want to have wait for compilation,
             * concatenation, minification, etc. So to avoid these steps, we simply
             * add all script files directly to the `<head>` of `index.html`. The
             * `src` property contains the list of included files.
             */
            build: {
                dir: '<%= build_dir %>',
                src: [
                    '<%= vendor_files.js %>',
                    '<%= build_dir %>/<%= nice_components %>/**/*.js',
                    '<%= html2js.common.dest %>',
                    '<%= html2js.app.dest %>',
                    '<%= build_dir %>/strings_*.js',
                    '<%= build_dir %>/src/**/*Module.js',
                    '<%= build_dir %>/src/**/*.js',
                    '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
                ]
            },

            /**
             * When it is time to have a completely compiled application, we can
             * alter the above to include only a single JavaScript and a single CSS
             * file. Now we're back!
             */
            compile: {
                dir: '<%= compile_dir %>',
                src: [
                    '<%= concat.compile_js.dest %>',
                    //'<%= vendor_files.css %>',
                    '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
                ]
            }
        },

        /**
         * And for rapid development, we have a watch set up that checks to see if
         * any of the files listed below change, and then to execute the listed
         * tasks when they do. This just saves us from having to type "grunt" into
         * the command-line every time we want to see what we're working on; we can
         * instead just leave "grunt watch" running in a background terminal. Set it
         * and forget it, as Ron Popeil used to tell us.
         *
         * But we don't need the same thing to happen for all the files.
         */
        delta: {
            /**
             * By default, we want the Live Reload to work for all tasks; this is
             * overridden in some tasks (like this file) where browser resources are
             * unaffected. It runs by default on port 35729, which your browser
             * plugin should auto-detect.
             */
            options: {
                livereload: 35732
            },

            /**
             * When the Gruntfile changes, we just want to lint it. In fact, when
             * your Gruntfile changes, it will automatically be reloaded!
             */
            gruntfile: {
                files: 'Gruntfile.js',
                tasks: ['jshint:gruntfile'],
                options: {
                    livereload: false
                }
            },

            /**
             * When our JavaScript source files change, we want to run lint them and
             * run our unit tests.
             */
            jssrc: {
                files: [
                    '<%= app_files.js %>'
                ],
                tasks: ['jshint:src', 'jscs:src', 'karmaSuites', 'copy:build_appjs']
            },

            /**
             * When assets are changed, copy them. Note that this will *not* copy new
             * files, so this is probably not very useful.
             */
            assets: {
                files: [
                    'src/assets/**/*'
                ],
                tasks: ['copy:build_app_assets', 'copy:build_vendor_assets']
            },

            /**
             * When index.html changes, we need to compile it.
             */
            html: {
                files: ['src/<%= app_files.html %>'],
                tasks: ['index:build']
            },

            /**
             * When our templates change, we only rewrite the template cache.
             */
            tpls: {
                files: [
                    '<%= app_files.atpl %>',
                    '<%= app_files.ctpl %>'
                ],
                tasks: ['html2js']
            },

            /**
             * When the CSS files change, we need to compile and minify them.
             */
            less: {
                files: ['src/**/*.less'],
                tasks: ['string-replace:less_assets_server_dev', 'less:build', 'concat:build_css', 'copy:build_vendorcss']
            },

            /**
             * When a JavaScript unit test file changes, we only want to lint it and
             * run the unit tests. We don't want to do any live reloading.
             */
            jsunit: {
                files: [
                    '<%= app_files.jsunit %>'
                ],
                tasks: ['jshint:test', 'jscs:test', 'karmaSuites'],
                options: {
                    livereload: false
                }
            }
        },

        /**
         * Replaces strings on files by using string or regex patterns.
         * Attempts to be a String.prototype.replace adapter task for your grunt project.
         */
        'string-replace': {
            less_assets_server_prod: {
                files: [{
                    src: '<%= app_files.less_variables %>',
                    dest: '<%= temp_dir %>/',
                    expand: true,
                    flatten: true
                }],
                options: {
                    replacements: [
                        {
                            pattern: /@assets-base-url\s*:\s*["'].*["']/,
                            replacement: '@assets-base-url: "<%= conf_prod.assetsServerBaseUrl %>"'
                        },
                        {
                            pattern: /<version>/,
                            replacement: '<%= pkg.version %>'
                        }]
                }
            },

            less_assets_server_dev: {
                files: [{
                    src: '<%= app_files.less_variables %>',
                    dest: '<%= temp_dir %>/',
                    expand: true,
                    flatten: true
                }],
                options: {
                    replacements: [
                        {
                            pattern: /@assets-base-url\s*:\s*["'].*["']/,
                            replacement: '@assets-base-url: "<%= conf_dev.assetsServerBaseUrl %>"'
                        },
                        {
                            pattern: /<version>/,
                            replacement: '<%= pkg.version %>'
                        }]
                }
            },

            config_assets_server: {
                files: [{
                    src: '<%= build_dir %>/<%= app_files.configuration_json %>',
                    dest: '<%= build_dir %>/'
                }],
                options: {
                    replacements: [{
                        pattern: /<version>/,
                        replacement: '<%= pkg.version %>'
                    }]
                }
            }
        },

        /**
         * Converting the application strings files [src/assets/strings/*.json] to a translation-loader module.
         * Create for each string file a new file in the dist directory.
         */
        jsonAngularTranslate: {
            translateStrings: {
                options: {
                    moduleName: 'translations-app',
                    extractLanguage: function (filepath) {
                        var stringFileName = filepath.split('/').reverse()[0];
                        var firstIndex = stringFileName.indexOf('_') + 1;
                        var lastIndex = stringFileName.indexOf('.');
                        return stringFileName.slice(firstIndex, lastIndex);
                    },
                    hasPreferredLanguage: false
                },
                files: [{
                    expand: true,
                    cwd: 'src/assets/strings',
                    src: '*.json',
                    dest: '<%= build_dir %>/',
                    ext: '.js'
                }]
            }
        },

        search: {
            fdescribe: {
                files: {
                    src: ["src/**/*.spec.js"]
                },
                options: {
                    searchString: /(fdescribe)/g,
                    logFormat: "console",
                    failOnMatch: true
                }
            }
        },

        waitServer: {
            selenium: {
                options: {
                    req: 'http://localhost:' + (process.env.DOCKER_SELENIUM_PORT || 4444) + '/wd/hub',
                    fail: function () {
                        console.error('Selenium server is not running. DOCKER_SELENIUM_PORT = ' + process.env.DOCKER_SELENIUM_PORT);
                    },
                    timeout: 30 * 1000,
                    isforce: false,
                    interval: 1000,
                    print: true
                }
            }
        }
    };

    grunt.initConfig(grunt.util._.extend(taskConfig, userConfig));

    /**
     * In order to make it safe to just compile or copy *only* what was changed,
     * we need to ensure we are starting from a clean, fresh build. So we rename
     * the `watch` task to `delta` (that's why the configuration var above is
     * `delta`) and then add a new task called `watch` that does a clean build
     * before watching for changes.
     */
    grunt.renameTask('watch', 'delta');
    grunt.registerTask('watch', ['watch-dev']);
    grunt.registerTask('watch-dev', ['build-dev', 'connect:dev', 'delta']);
    grunt.registerTask('watch-prod', ['build-prod', 'connect:dev', 'delta']);

    /**
     * The default task is to build and compile.
     */
    grunt.registerTask('default', ['compile-prod']);

    /**
     * The `build` task gets your app ready to run for development and testing.
     */
    grunt.registerTask('build', [
        'revision', 'clean:build', 'html2js', 'jsonAngularTranslate', 'jshint', 'jscs', 'getNiceComponents',
        'copy:page_objects', 'less:build', 'concat:build_css', 'cssmin', 'copy:build_app_assets', 'copy:build_vendor_assets',
        'copy:build_appjs', 'copy:build_vendorjs', 'copy:build_vendorcss', 'copy:build_vendorfont',
        'index:build', 'copy:build_buildinfo'
    ]);

    /**
     * The `compile` task gets your app ready for deployment by concatenating and
     * minifying your code.
     * It then runs both development and prod servers (as per 'server + connect' task configuration)
     */
    grunt.registerTask('compile', [
        'less:compile', 'copy:compile_assets', 'copy:compile_webinf', 'ngAnnotate', 'uglify', 'index:compile'
    ]);

    grunt.registerTask('build-dev', [
        'pre-build-dev', 'build', 'post-build-dev'
    ]);

    grunt.registerTask('pre-build-dev', [
        'string-replace:less_assets_server_dev'
    ]);

    grunt.registerTask('post-build-dev', [
        'string-replace:config_assets_server', 'karmaSuites'
    ]);

    grunt.registerTask('build-dev-without-unit-tests', [
        'pre-build-dev', 'build', 'post-build-dev-without-unit-tests'
    ]);

    grunt.registerTask('post-build-dev-without-unit-tests', [
        'string-replace:config_assets_server'
    ]);

    grunt.registerTask('build-prod', [
        'pre-build-prod', 'build', 'createWarXML', 'post-build-prod'
    ]);

    grunt.registerTask('pre-build-prod', [
        'search:fdescribe', 'string-replace:less_assets_server_prod'
    ]);

    grunt.registerTask('post-build-prod', [
        'string-replace:config_assets_server', 'karmaAll'
    ]);

    grunt.registerTask('compile-dev', [
        'build-dev', 'compile', 'string-replace:config_assets_server'
    ]);

    grunt.registerTask('compile-prod', [
        'build-prod', 'compile', 'cacheBust', 'string-replace:config_assets_server'
    ]);

    // Creates the `server` task to launch all servers
    grunt.registerTask('server', [
        'connect'
    ]);

    grunt.registerTask('karmaSuites', [
        'karma:app', 'karma:commonDirectivesAndFilters', 'karma:commonModelsServicesUtils', 'jscs'
    ]);

    grunt.registerTask('karmaAll', [
        'karma:all', 'jscs'
    ]);

    grunt.registerTask('e2e', [
        //'protractor_webdriver:webdriver', 'build:dev', 'connect:dev', 'protractor:e2e'
        'build-dev', 'connect:dev', 'protractor:e2e'
    ]);

    grunt.registerTask('headless-e2e', [
        //'exec:updateWebDriverManager', 'protractor_webdriver:webdriver', 'build-prod', 'connect:preprod', 'protractor:headless_e2e'
        'exec:updateWebDriverManager', 'protractor:headless_e2e'
    ]);

    grunt.registerTask('headless-e2e-chrome', [
        'exec:updateWebDriverManager', 'protractor:headless_e2e_chrome'
    ]);

    //individual protractor suites START
    grunt.registerTask('headless-e2e-chrome-conf-suite-01', [
        'waitServer:selenium', 'protractor:headless_e2e_chrome_conf_app_suite_01'
    ]);

    grunt.registerTask('headless-e2e-chrome-conf-suite-02', [
        'waitServer:selenium', 'protractor:headless_e2e_chrome_conf_app_suite_02'
    ]);

    grunt.registerTask('headless-e2e-chrome-conf-suite-03', [
        'waitServer:selenium', 'protractor:headless_e2e_chrome_conf_app_suite_03'
    ]);

    grunt.registerTask('headless-e2e-chrome-conf-suite-04', [
        'waitServer:selenium', 'protractor:headless_e2e_chrome_conf_app_suite_04'
    ]);

    grunt.registerTask('headless-e2e-chrome-conf-suite-05', [
        'waitServer:selenium', 'protractor:headless_e2e_chrome_conf_app_suite_05'
    ]);

    grunt.registerTask('headless-e2e-chrome-conf-suite-06', [
        'waitServer:selenium', 'protractor:headless_e2e_chrome_conf_app_suite_06'
    ]);

    grunt.registerTask('headless-e2e-chrome-conf-suite-07', [
        'waitServer:selenium', 'protractor:headless_e2e_chrome_conf_app_suite_07'
    ]);

    grunt.registerTask('headless-e2e-chrome-conf-suite-08', [
        'waitServer:selenium', 'protractor:headless_e2e_chrome_conf_app_suite_08'
    ]);

    grunt.registerTask('headless-e2e-chrome-conf-suite-09', [
        'waitServer:selenium', 'protractor:headless_e2e_chrome_conf_app_suite_09'
    ]);

    grunt.registerTask('headless-e2e-chrome-conf-suite-10', [
        'waitServer:selenium', 'protractor:headless_e2e_chrome_conf_app_suite_10'
    ]);
    //individual protractor suites END

    grunt.registerTask('headless-e2e-firefox', [
        'exec:updateWebDriverManager', 'protractor:headless_e2e_firefox'
    ]);
    grunt.registerTask('headless-e2e-ie', [
        'exec:updateWebDriverManager', 'protractor:headless_e2e_ie'
    ]);
    grunt.registerTask('headless-e2e-safari', [
        'exec:updateWebDriverManager', 'protractor:headless_e2e_safari'
    ]);
    grunt.registerTask('headless-e2e-synthetic-monitor-prod', [
        'protractor:headless_e2e_synthetic_monitor_prod'
    ]);

    /**
     * Set a value into the project's Grunt configuration
     */
    grunt.registerTask('set-grunt-config', 'Sets a value into the project\'s Grunt configuration', function(prop, value) {
        grunt.config.set(prop, value);
    });

    /**
     * A utility function to get all app JavaScript sources.
     */
    function filterForJS(files) {
        return files.filter(function (file) {
            return file.match(/\.js$/);
        });
    }

    /**
     * A utility function to get all app CSS sources.
     */
    function filterForCSS(files) {
        return files.filter(function (file) {
            return file.match(/\.css$/);
        });
    }

    /**
     * The index.html template includes the stylesheet and javascript sources
     * based on dynamic names calculated in this Gruntfile. This task assembles
     * the list into variables for the template to use and then runs the
     * compilation.
     */
    grunt.registerMultiTask('index', 'Process index.html template', function () {
        var dirRE = new RegExp('^(' + grunt.config('build_dir') + '|' + grunt.config('compile_dir') + ')\/', 'g');

        var jsFiles = filterForJS(this.filesSrc).map(function (file) {
            return file.replace(dirRE, '');
        });

        var cssFiles = filterForCSS(this.filesSrc).map(function (file) {
            return file.replace(dirRE, '');
        });

        grunt.file.copy('src/index.html', this.data.dir + '/index.html', {
            process: function (contents, path) {
                if (appContext[appContext.length-1] !== '/') {
                    appContext = appContext + '/';
                }

                return grunt.template.process(contents, {
                    data: {
                        scripts: jsFiles,
                        styles: cssFiles,
                        appContext: appContext,
                        version: grunt.config('pkg.version')
                    }
                });
            }
        });
    });

    /**
     * Generate a simple web.xml so that we can build a war file from our build directory
     */
    grunt.registerTask('createWarXML', 'Creates the War XML File', function () {
        var xml = '<?xml version="1.0"?>\n';
        xml += '<web-app version="2.4" xmlns="http://java.sun.com/xml/ns/j2ee" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://java.sun.com/xml/ns/j2ee http://java.sun.com/xml/ns/j2ee/web-app_2_4.xsd">\n';
        xml += '</web-app>\n';
        grunt.file.write(grunt.config('build_dir') + '/WEB-INF/web.xml', xml);
    });
    grunt.registerTask('getNiceComponents', 'Copy Nice Components into the build directory', function () {
        commonFunctions.getNiceComponents(grunt);
    });
};
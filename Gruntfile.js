module.exports = function( grunt ) {

  'use strict';

  grunt.initConfig({
    paths: {
      src: {
        root: 'src',
        www: '<%= paths.src.root %>/www',
        ios: '<%= paths.src.root %>/ios',
        android: '<%= paths.src.root %>/android'
      },
      lib: {
        atnotate: 'libs/atnotate'
      },
      tmp: {
        root: 'tmp',
        www: '<%= paths.tmp.root %>/www',
        ios: '<%= paths.tmp.root %>/ios',
        android: '<%= paths.tmp.root %>/android'
      },
      cordovaInit: {
        root: 'init',
        www: '<%= paths.cordovaInit.root %>/src/www',
        cordovaConfig: '<%= paths.src.www %>/config.xml',
        cordovaConfigDest: '<%= paths.cordovaInit.www %>/config.xml'
      },
      build: {
        root: 'build',
        www: '<%= paths.build.root %>/www',
        ios: '<%= paths.build.root %>/platforms/ios',
        android: '<%= paths.build.root %>/platforms/android'
      },
      asset: {
        ios: '<%= paths.build.ios %>/www',
        android: '<%= paths.build.android %>/assets/www'
      },
      out: {
        index: 'index.html',
        css: 'css/app/app.min.css',
        js: 'js/app.min.js',
        cordova: 'cordova.js'
      },
      'package': {
        root: 'pkg',
        android: '<%= paths.package.root %>/<%= package.name %>.apk',
        ios: '<%= paths.package.root %>/<%= package.name %>.ipa'
      },
      doc: 'doc',
      copy: {
        www: [
          '<%= paths.out.index %>',
          '<%= paths.out.css %>',
          '<%= paths.out.js %>',
          'configs/**/*',
          'assets/**/*',
          'messages/**/*',
          'config.xml'
        ]
      }
    },

    'package': grunt.file.readJSON('package.json'),

    clean: {
      tmp: ['<%= paths.tmp.root %>'],
      build: ['<%= paths.build.root %>'],
      'package': ['<%= paths.package.root %>'],
      cordova: ['<%= paths.src.www %>'],
      init: ['<%= paths.cordovaInit.root %>']
    },

    uglify: {
      all: {
        options: {
          banner: '/*! <%= package.title %> v<%= package.version %> | License: <%= package.license %> */\n'
        },
        files: [
          {
            src: '<%= paths.tmp.www %>/<%= paths.out.js %>',
            dest: '<%= paths.tmp.www %>/<%= paths.out.js %>'
          }
        ]
      }
    },

    preprocess: {
      www: {
        options: {
          locals: {
            css: '<link rel="stylesheet" type="text/css" href="<%= paths.out.css %>" />\n',
            js: '<script src="<%= paths.out.js %>"></script>\n'
          }
        },
        files: [{
          src: '<%= paths.tmp.www %>/<%= paths.out.index %>',
          dest: '<%= paths.build.www %>/<%= paths.out.index %>'
        }]
      },
      ios: {
        options: {
          locals: {
            css: '<%= preprocess.www.options.locals.css %>',
            js: (function() {
              return [
                '<%= paths.out.cordova %>',
                '<%= paths.out.js %>'
              ]
                .map(function(file) {
                  return '<script src="' + file + '"></script>';
                })
                .join('\n') + '\n';
            })()
          }
        },
        files: [{
          src: '<%= paths.tmp.www %>/<%= paths.out.index %>',
          dest: '<%= paths.asset.ios %>/<%= paths.out.index %>'
        }]
      },
      android: {
        options: {
          locals: {
            css: '<%= preprocess.www.options.locals.css %>',
            js: '<%= preprocess.ios.options.locals.js %>'
          }
        },
        files: [{
          src: '<%= paths.tmp.www %>/<%= paths.out.index %>',
          dest: '<%= paths.asset.android %>/<%= paths.out.index %>'
        }]
      }
    },

    less: {
      build: {
        options: {
          compress: true
        },
        files: [
          {
            src: '<%= paths.tmp.www %>/css/app/app.less',
            dest: '<%= paths.tmp.www %>/<%= paths.out.css %>'
          }
        ]
      },
      src: {
        options: {
          compress: false
        },
        files: [
          {
            src: '<%= paths.src.www %>/css/app/app.less',
            dest: '<%= paths.src.www %>/<%= paths.out.css %>'
          }
        ]
      }
    },

    jasmine: {
      all: ['test/runner.html'],
      options: {
        junit: {
          path: 'log/tests',
          consolidate: true
        }
      }
    },



    'amd-test': {
      mode: 'jasmine',
      files: 'test/unit/**/*.js'
    },

    jshint: {
      src: {
        options: {
          jshintrc: '<%= paths.src.www %>/js/.jshintrc'
        },
        files: {
          src: '<%= paths.src.www %>/js/**/*.js'
        }
      },
      test: {
        options: {
          jshintrc: 'test/unit/.jshintrc'
        },
        files: {
          src: 'test/unit/**/*.js'
        }
      }
    },

    server: {
      local: {
        options: {
          port: 8080,
          vhost: 'localhost',
          base: 'src/www',
          apiPrefix: '/api',
          apiBaseUrl: 'configure-to-specific-api',
          proxyPort: '80',// change to 443 for https
          proxyProtocol: 'http'//change to https if ssl is required
        }
      },
      prod: {
        options: {
          port: 8080,
          vhost: 'localhost',
          base: 'build/www',
          apiPrefix: '/api*'
        }
      },
      doc: {
        options: {
          port: 8080,
          vhost: 'localhost',
          base: 'doc'
        }
      }
    },

    copy: {
      tmp: {
        files: [
          {
            expand: true,
            cwd: '<%= paths.src.root %>',
            src: '**/*',
            dest: '<%= paths.tmp.root %>/'
          },
          {
            expand: true,
            cwd: '<%= paths.src.root %>',
            src: '.cordova/**',
            dest: '<%= paths.tmp.root %>/'
          }
        ]
      },
      cordovaInit: {
        files: [
          {
            expand: true,
            cwd: '<%= paths.src.root %>',
            src: '**/*',
            dest: '<%= paths.cordovaInit.root %>/src'
          }
        ]
      },
      configLavaca: {
        files: [
          {
            expand: true,
            cwd: '<%= paths.cordovaInit.root %>/src/www',
            src: '**/*',
            dest: '<%= paths.src.root %>/www'
          }
        ]
      },
      cordova: {
        files: [
          {
            expand: true,
            cwd: '<%= paths.tmp.root %>',
            src: ['.cordova/**'],
            dest: '<%= paths.build.root %>/'
          },
          {
            expand: true,
            cwd: '<%= paths.tmp.root %>',
            src: ['merges/**'],
            dest: '<%= paths.build.root %>/'
          },
          {
            expand: true,
            cwd: '<%= paths.tmp.root %>',
            src: ['platforms/**'],
            dest: '<%= paths.build.root %>/'
          },
          {
            expand: true,
            cwd: '<%= paths.tmp.root %>',
            src: ['plugins/**'],
            dest: '<%= paths.build.root %>/'
          }
        ]
      },
      www: {
        files: [
          {
            expand: true,
            cwd: '<%= paths.tmp.www %>/',
            src: '<%= paths.copy.www %>',
            dest: '<%= paths.build.www %>/'
          }
        ]
      }
    },

    pkg: {
      ios: {
        options: {
          identity: 'iPhone Distribution: Mutual Mobile'
        },
        files: [
          {
            src: '<%= paths.build.ios %>',
            dest: '<%= paths.package.ios %>'
          }
        ]
      },
      android: {
        options: {
          targetSdk: undefined
        },
        files: [
          {
            src: '<%= paths.build.android %>',
            dest: '<%= paths.package.android %>'
          }
        ]
      }
    },

    'amd-check': {
      files: [
        '<%= paths.src.www %>/js/**/*.js',
        'test/unit/**/*.js'
      ]
    },

    'amd-dist': {
      all: {
        options: {
          standalone: true
        },
        files: [
          {
            src: [
              '<%= paths.tmp.www %>/js/libs/require.js',
              '<%= paths.tmp.www %>/js/app/boot.js',
              '<%= paths.tmp.www %>/js/templates.js'
            ],
            dest: '<%= paths.tmp.www %>/<%= paths.out.js %>'
          }
        ]
      }
    },

    blueprint: {
      options: {
        dest: '<%= paths.src.www %>/js/app',
        appName: 'app'
      },
      lavaca:{
        options:{
          map:{
            View: 'ui/views/View',
            PageView: 'ui/views/pageviews/PageView',
            Model: 'models/Model',
            Collection: 'collections/Collection',
            Controller: 'net/Controller',
            Control: 'ui/views/controls/Control'
          }
        }
      }
    },

    requirejs: {
      baseUrl: '<%= paths.src.www %>/js',
      mainConfigFile: '<%= paths.src.www %>/js/app/boot.js',
      optimize: 'none',
      keepBuildDir: true,
      locale: "en-us",
      useStrict: false,
      skipModuleInsertion: false,
      findNestedDependencies: false,
      removeCombined: false,
      preserveLicenseComments: false,
      logLevel: 0
    },

    yuidoc: {
      compile: {
        name: '<%= pkg.name %>',
        description: '<%= pkg.description %>',
        version: '<%= pkg.version %>',
        url: '<%= pkg.homepage %>',
        options: {
          paths: '<%= paths.src.www %>/js',
          outdir: '<%= paths.doc %>',
          exclude: '<%= paths.src.www %>/js/libs',
          linkNatives: true,
          themedir: 'libs/yuidoc/themes/default'
        }
      }
    },

    watch: {
      scripts: {
        files: ['src/www/**/*.js'],
        tasks: ['yuidoc']
      },
      css: {
        files: ['!<%= paths.src.www %>/<%= paths.out.css %>','src/www/css/**/*.less'],
        tasks: ['less:src']
      }
    },

    buildProject: {
      local: {
        options: {
          tasks: ['less', 'amd-dist', 'uglify', 'preprocess']
        }
      },
      staging: {
        options: {
          tasks: ['less', 'amd-dist', 'uglify', 'preprocess']
        }
      },
      production: {
        options: {
          tasks: ['yuidoc', 'less', 'amd-dist', 'uglify', 'preprocess']
        }
      }
    },

    initCordova: {
      init: {
        options: {
          appName: 'App',
          id: 'com.mm.App'
        }
      }
    },

    initPlatforms: {
      init: {
        options: {
          platforms: ['ios', 'android']
        }
      }
    },

    chmod: {
      build: {
        options: {
          mode: '775'
        },
        src: ['build/**/*']
      }
    },

    concurrent: {
      target: {
        tasks: ['server', 'watch:css'],
        options: {
          logConcurrentOutput: false
        }
      }
    }

  });

  grunt.loadTasks('tasks/server');
  grunt.loadTasks('tasks/pkg');
  grunt.loadTasks('tasks/preprocess');
  grunt.loadTasks('tasks/blueprint');
  grunt.loadTasks('tasks/build');
  grunt.loadTasks('tasks/buildProject');
  grunt.loadTasks('tasks/initCordova');
  grunt.loadTasks('tasks/initPlatforms');
  grunt.loadTasks('tasks/configLavaca');
  grunt.loadTasks('tasks/cordovaBuild');
  grunt.loadTasks('tasks/cordovaInit');
  grunt.loadTasks('tasks/initLavaca');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-amd-dist');
  grunt.loadNpmTasks('grunt-amd-test');
  grunt.loadNpmTasks('grunt-amd-check');
  grunt.loadNpmTasks('grunt-contrib-yuidoc');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-chmod');
  grunt.loadNpmTasks('grunt-concurrent');

  grunt.registerTask('default', 'starts local server and watches', ['concurrent']);

  grunt.registerTask('test', 'generates runner and runs the tests', ['amd-test', 'jasmine']);

  grunt.registerTask('doc', 'compiles documentation and starts a server', ['yuidoc', 'server:doc']);

};

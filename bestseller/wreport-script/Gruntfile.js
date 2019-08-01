// Generated on 2015-08-10 using generator-ionic 0.7.1
'use strict';

var yeomanConfig = require('./config.js');


module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);


  // Define the configuration for all the tasks
  //console.dir(yeomanConfig);
  grunt.initConfig({

    // Project settings
    yeoman: yeomanConfig,

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.temp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.temp'
    },

    autoprefixer: {
      options: {
        browsers: ['> 1%', 'last 2 versions']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.temp/<%= yeoman.styles %>/',
          src: '{,*/}*.css',
          dest: '.temp/<%= yeoman.styles %>/'
        }]
      }
    },


    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: ['<%= yeoman.app %>/index.html'],
      options: {
        dest: '<%= yeoman.dist %>',
        staging: '.temp',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/**/*.html'],
      css: ['<%= yeoman.dist %>/<%= yeoman.styles %>/**/*.css'],
      options: {
        assetsDirs: ['<%= yeoman.dist %>']
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    //cssmin: {
    //  options: {
    //    //root: '<%= yeoman.app %>',
    //    noRebase: true
    //  }
    //},
    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          collapseBooleanAttributes: false,
          removeCommentsFromCDATA: true,
          removeOptionalTags: false
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },
    //image min,
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    //svg min
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '<%= yeoman.images %>/**/*.{png,jpg,jpeg,gif,webp,svg}',
            '*.html',
            '<%= yeoman.styles %>/fonts/*',
            '<%= yeoman.styles %>/libs/fonts/*',
            '<%= yeoman.styles %>/common/*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= yeoman.data %>/**',
            '<%= yeoman.app %>/dialog/*',
            '!<%= yeoman.app %>/util/worker.js'
          ]
        }, {
          expand: true,
          cwd: '.temp/<%= yeoman.images %>',
          dest: '<%= yeoman.dist %>/<%= yeoman.images %>',
          src: ['generated/*']
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/<%= yeoman.styles %>',
        dest: '.temp/<%= yeoman.styles %>/',
        src: ['{,*/}*.css',
        '!changeColor.css'
        ]
      },
      fonts: {
        expand: true,
        cwd: 'app/bower_components/ionic/release/fonts/',
        dest: '<%= yeoman.app %>/fonts/',
        src: '*'
      },
      app: {
        expand: true,
        cwd: '<%= yeoman.app %>',
        dest: '<%= yeoman.dist %>/',
        src: [
          '**/*',
          '!**/*.(scss,sass,css)',
        ]
      },
      tmp: {
        expand: true,
        cwd: '.temp',
        dest: '<%= yeoman.dist %>/',
        src: '**/*'
    },
      last: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '<%= yeoman.app %>/util/worker.js',
            '<%= yeoman.styles %>/common/changeColor.css',
          ]
        }]
      }
    },


    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/<%= yeoman.styles %>/main.css': [
    //         '.temp/<%= yeoman.styles %>/**/*.css',
    //         '<%= yeoman.app %>/<%= yeoman.styles %>/**/*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/<%= yeoman.scripts %>/scripts.js': [
    //         '<%= yeoman.dist %>/<%= yeoman.scripts %>/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    // ngAnnotate tries to make the code safe for minification automatically by
    // using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.temp/concat/<%= yeoman.scripts %>',
          src: '*.js',
          dest: '.temp/concat/<%= yeoman.scripts %>'
        }]
      }
    },
    //修改文件名
    filerev: {
      options: {
        encoding: 'utf8',
        algorithm: 'md5',
        length: 8
      },
      js: {
        src: [
          '<%= yeoman.dist %>/<%= yeoman.styles %>/{,*/}*.css',
          '<%= yeoman.dist %>/<%= yeoman.scripts %>/{,*/}*.js'
        ]
      }
    },
    ngtemplates: {
      //options: {
      //  module: 'atomic'
      //  // url: function(templateString) {
      //  //     return '/' + templateString;
      //  // }
      //},
      'wreport.app': {
        cwd: '<%= yeoman.app %>',
        src: [
          '<%= yeoman.scripts %>/**/*.html',
          'libs/**/*.html'
        ],
        dest: '.temp/templates.js',
        options: {
          htmlmin:
          { collapseWhitespace: true,
            collapseBooleanAttributes: false, //省略布尔属性的值
            removeCommentsFromCDATA: true,
            removeOptionalTags: false
          },
          usemin: '<%= yeoman.scripts %>/main.js' // <~~ This came from the <!-- build:js --> block
        }
      },
    },
    cdnify: {
      dist: {
        options: {
          base: '//static.ezhenduan.com/static/baoxian/app/'
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    }
  });


  grunt.registerTask('compress', [
    'clean',
    'useminPrepare',
    'copy:styles',
    'autoprefixer',
    'ngtemplates',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'htmlmin',
    //'imagemin',
    'svgmin',
    'copy:last'
  ]);

  grunt.registerTask('build', function (target) {

    if (target === 'cdn') {
      return grunt.task.run(['compress','cdnify']);
    }
    grunt.task.run(['compress']);
  });


  grunt.registerTask('default', [
    'compress'
  ]);

};

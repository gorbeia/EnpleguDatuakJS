module.exports = function(grunt) {

  var rename = function(dest, src) {
    var f = src.substr(0, src.lastIndexOf('.'));
    return dest + f + '.min.js';
  };
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: ["build", "dist"],
    copy: {
      libs: {
        external_libs: 'build/js/lib/',
        files: [
          {expand: true, flatten: true, src: ['public_html/assets/data/*.json'], dest: 'dist/assets/data/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['public_html/js/libs/**/*.js', '!public_html/js/libs/**/*.min*.js'], dest: '<%= copy.libs.external_libs %>', filter: 'isFile'}
        ]
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      js: {
        src: ['public_html/assets/js/**/*.js'],
        dest: 'build/js/app/<%= pkg.name %>.js'
      },
      css: {
        options: {
          separator: '\n',
        },
        src: ['public_html/assets/css/**/*.css'],
        dest: 'build/css/app/<%= pkg.name %>.css'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: [
          {expand: true, flatten: true, src: ['<%= copy.libs.external_libs %>/*.js'], dest: 'dist/js/', rename: rename, filter: 'isFile'},
          {expand: true, flatten: true, src: ['<%= concat.js.dest %>'], dest: 'dist/js/', rename: rename, filter: 'isFile'}
        ]
      }
    },
    cssmin: {
      combine: {
        files: {
          'dist/css/<%= pkg.name %>.min.css': ['<%= concat.css.dest %>']
        }
      }
    },
    targethtml: {
      dist: {
        files: {
          'dist/index.html': 'public_html/index.html',
          'dist/council.html': 'public_html/council.html'
        }
      }
    },
    jshint: {
      files: ['gruntfile.js', 'public_html/assets/js/**/*.js', 'test/unit/**/*.js'],
      options: {
        globalstrict: true,
        jQuery: true,
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true,
          globalstrict: true
        }
      }
    },
    jasmine: {
      pivotal: {
        src: ['public_html/js/libs/**/*.js', 'public_html/assets/**/*.js'],
        options: {
          specs: 'test/unit/**/*.js',
          helpers: 'spec/*Helper.js'
        }
      }
    },
    connect: {
      dist: {
        options: {
          port: 9001,
          base: 'dist'
        }
      }
    },
    deploy: grunt.file.readJSON('../deploy.json'),
    rsync: {
      deploy: {
        src: "dist/",
        dest: "<%=deploy.dest%>",
        host: "<%=deploy.host%>",
//        port: "1234", // Use the rsyncwrapper port option to set a non-standard ssh port if required.
        recursive: true,
        syncDest: true
      }
    },
    'gh-pages': {
      options: {
        base: 'dist'
      },
      src: ['**/*']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-targethtml');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-rsync');
  grunt.loadNpmTasks('grunt-gh-pages');

  grunt.registerTask('test', ['jshint', 'jasmine']);
  grunt.registerTask('default', ['jshint', 'jasmine', 'concat:js', 'uglify']);
  grunt.registerTask('build', ['clean', 'copy:libs', 'concat:js', 'uglify', 'concat:css', 'cssmin', 'targethtml:dist']);
  grunt.registerTask('deploy', ['build', 'gh-pages']);

};
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // Configure a mochaTest task
    mochaTest:{
      test: {
         options: {
          reporter: 'spec'
        },
        src: ['js/tests/testBall.js','js/tests/testPlayer.js']
      }
    },
    uglify: {
      options: {
        banner: '/*! Copyright 2014, Gregor Meyenberg <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      my_target:{
        files: {
         'js/<%= pkg.name %>.min.js':['js/src/class/Ball.js',
                                        'js/src/class/ComputerPlayer.js',
                                        'js/src/class/HumanPlayer.js',
                                        'js/src/class/Player.js',
                                        'js/src/plugin.js']
        }
      }
    }
  });

  // Add the grunt-mocha-test tasks.
  grunt.loadNpmTasks('grunt-mocha-test');

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['mochaTest','uglify']);

};
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
        src: ['tests/testBall.js','tests/testPlayer.js']
      }
    },
    uglify: {
      options: {
        banner: '/*! Copyright 2014, Gregor Meyenberg <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      my_target:{
        files: {
         'public/js/<%= pkg.name %>.min.js':[  'src/class/Player.js',
                                        'src/class/Ball.js',
                                        'src/class/ComputerPlayer.js',
                                        'src/class/HumanPlayer.js',
                                        'src/plugin.js']
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
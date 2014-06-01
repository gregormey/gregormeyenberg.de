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
        src: ['tests/client/testBall.js','tests/client/testPlayer.js']
      }
    },
    uglify: {
      options: {
        banner: '/*! Copyright 2014, Gregor Meyenberg <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      my_target:{
        files: {
         'public/js/<%= pkg.name %>.min.js':[  'src/client/class/Player.js',
                                        'src/client/class/Ball.js',
                                        'src/client/class/ComputerPlayer.js',
                                        'src/client/class/HumanPlayer.js',
                                        'src/client/class/RemotePlayer.js',
                                        'src/client/class/YagsClient.js',
                                        'src/client/plugin.js']
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
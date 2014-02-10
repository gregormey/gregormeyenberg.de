module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
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

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['uglify']);

};
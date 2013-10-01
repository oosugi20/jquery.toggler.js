module.exports = (grunt) ->

  grunt.task.loadNpmTasks 'grunt-contrib-concat'
  grunt.task.loadNpmTasks 'grunt-contrib-uglify'

  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')

    banner: """
/*! <%= pkg.name %> (<%= pkg.repository.url %>)
 * lastupdate: <%= grunt.template.today("yyyy-mm-dd") %>
 * version: <%= pkg.version %>
 * author: <%= pkg.author %>
 * License: MIT
 */

"""

    concat:
      banner:
        options:
          banner: '<%= banner %>'
        files: [
          'jquery.toggler.js': 'src/jquery.toggler.js'
        ]

    uglify:
      main:
        options:
          banner: '<%= banner %>'
        files: [
          'jquery.toggler.min.js': 'src/jquery.toggler.js'
        ]


  grunt.registerTask 'build', [
    'concat'
    'uglify'
  ]

  grunt.registerTask 'default', [
    'build'
  ]

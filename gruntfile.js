module.exports = function(grunt) {

	grunt.initConfig({

		watch: {
			default: {
				files: [ 'public/src/*', 'public/src/**/*'],
				tasks: ['sass','jade','copy'],
				options: {
					spawn: false,
					livereload: true
				}
			}
		},
		connect: {
			server: {
				options: {
					port: 8000,
					livereload: true,
					open: {
						target: 'http://localhost:8000/public/dist/index.html'
					}
				}
			}
		},
		jade: {
			//Build Files
			default: {
				options: {
					data: {
						debug: true
					},
					pretty: true
				},
				files: [
					{
						expand: true,
						cwd: 'public/src',
						src: '*.jade',
						dest: 'public/dist/',
						flatten: true,
						ext: '.html'
					}
				]
			},
			views: {
				options: {
					data: {
						debug: true
					},
					pretty: true
				},
				files: [
					{
						expand: true,
						cwd: 'public/src/views',
						src: '*.jade',
						dest: 'public/dist/views',
						flatten: true,
						ext: '.tpl.html'
					}
				]
			}
		},
		sass: {
			default: {
				files: [
					{
						expand: true,
						cwd: 'public/src/css',
						src: '*.sass',
						dest: 'public/dist/css',
						ext: '.css'
					}
				],
				options: {
					sourcemap: 'none'
				}
			}
		},
		copy: {
			default: {
				files: [
					{
						expand: true,
						cwd: 'public/src/js',
						src: '*.js',
						dest: 'public/dist/js',
						ext: '.js'
					}
				],
			},
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	//grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-sass');
	//grunt.loadNpmTasks('grunt-uncss');
	grunt.loadNpmTasks('grunt-contrib-copy');	
	grunt.registerTask('default', ['jade','sass','copy','connect','watch'])

};







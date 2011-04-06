
# Bring in Rocco tasks
require 'rocco/tasks'
Rocco::make 'docs/', 'lib/**/*.js', :language => 'js'

desc 'Build documentation'
task :docs => :rocco
directory 'docs/'

require 'rake/clean'
CLEAN.include 'docs'

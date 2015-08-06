gulp = require('gulp')
gCoffee = require('gulp-coffee')
gUtil = require('gulp-util')
gClean = require('gulp-clean')
gMocha = require('gulp-spawn-mocha')
gLazy = require('lazypipe')
gMirror = require('gulp-mirror')
gUmd = require('gulp-umd')
gConcat = require('gulp-concat')
gSourceMaps = require('gulp-sourcemaps')
gRename = require('gulp-rename')
gUglify = require('gulp-uglify')
gCoffeeLint = require('gulp-coffeelint')

pipeCoffee = gLazy()
.pipe(gUmd, {
  templateSource: '''
  <%= contents %>
  module.exports = <%= exports %>
  '''
  exports: (file) ->
    'ToJson'
})

pipeNode = gLazy()
.pipe(gUmd,{
  templateName: 'node',
  exports: (file) ->
    'ToJson'
  namespace: (file) ->
    'toJson'
})
.pipe(gRename, {
    suffix: '-node'
})

pipeBrowser = gLazy()
.pipe(gUmd,{
  templateName: 'amdWeb',
  exports: (file) ->
    'ToJson'
  namespace: (file) ->
    'toJson'
})
.pipe(gRename, {
  suffix: '-web'
})

pipeUmd = gLazy()
.pipe(gUmd,{
  templateName: 'amdNodeWeb',
  exports: (file) ->
    'ToJson'
  namespace: (file) ->
    'toJson'
})
.pipe(gRename, {
  suffix: '-umd'
})

createUglifyPipe = (pipe) ->
  pipe
  .pipe(gUglify, {
      preserveComments: 'some'
  })
  .pipe(
    gRename,
    (path) ->
      path.extname = '.min' + path.extname
      return
  )

gulp.task('clean', () ->
  gulp
  .src(['lib/', 'coverage/'], { read: false })
  .pipe(gClean())
)

gulp.task('build', ['clean'], () ->
  gulp
  .src([
    'src/to-json.coffee',
    'src/to-json-with-path-map.coffee'
    'src/to-json-with-path-tree.coffee'
    'src/to-json-with-data-map.coffee'
    'src/to-json-with-data-tree.coffee'
  ])
  .pipe(gConcat('to-json.coffee', {newLine: '\r\n'}))
  .pipe(gCoffeeLint())
  .pipe(gCoffeeLint.reporter())
  .pipe(gMirror(
    pipeCoffee(),
    (
      gLazy()
      .pipe(gSourceMaps.init)
      .pipe(gConcat, 'to-json.coffee')
      .pipe(gCoffee, { bare: true })
      .pipe(
        gMirror,
        pipeNode(),
        pipeBrowser(),
        pipeUmd(),
        createUglifyPipe(pipeBrowser)(),
        createUglifyPipe(pipeUmd)()
      )
      .pipe(gSourceMaps.write)
    )()
  ))
  .pipe(gulp.dest('lib'))
  #.on('error', gUtil.log)

)

gulp.task('test', ['build'], () ->
  gulp
  .src(
    [
      'test/coverage.coffee'
    ],
    {
      read: false
    }
  )
  .pipe(gMocha({
    debugBrk: false
    r: 'test/setup.js'
    R: 'spec'
    u: 'tdd'
    istanbul: true
  }))
)

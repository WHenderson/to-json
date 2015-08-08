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
gCoverageEnforcer = require("gulp-istanbul-enforcer");

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
    suffix: '.node'
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
  suffix: '.web'
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
  suffix: '.umd'
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

gulpClean = () ->
  gulp
  .src(['dist/', 'coverage/'], { read: false })
  .pipe(gClean())

gulpBuild = () ->
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
  .pipe(gulp.dest('dist'))

gulpTestCoverage = () ->
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
    r: 'test/coverage-setup.js'
    R: 'spec'
    u: 'tdd'
    istanbul: {

    }
  }))
  .pipe(gCoverageEnforcer({
    thresholds : {
      statements : 100,
      branches : 100,
      lines : 100,
      functions : 100
    },
    coverageDirectory : 'coverage',
    rootDirectory : ''
  }))

gulpTestExamples = () ->
  gulp
  .src(
    [
      'test/examples.coffee'
    ],
    {
      read: false
    }
  )
  .pipe(gMocha({
    debugBrk: false
    r: 'test/examples-setup.js'
    R: 'spec'
    u: 'tdd'
    istanbul: false
  }))

gulp.task('discrete-clean', () ->
  gulpClean()
)

gulp.task('discrete-build', () ->
  gulpBuild()
)

gulp.task('discrete-test-coverage', () ->
  gulpTestCoverage()
)

gulp.task('discrete-test-examples', () ->
  gulpTestExamples()
)

gulp.task('chained-clean', () ->
  gulpClean()
)
gulp.task('chained-build', ['chained-clean'], () ->
  gulpBuild()
)
gulp.task('chained-test-coverage', ['chained-build'], () ->
  gulpTestCoverage()
)
gulp.task('chained-test-examples', ['chained-test-coverage'], () ->
  gulpTestExamples()
)
gulp.task('chained-complete', ['chained-test-examples'], (cb) ->
  cb()
)

gulp.task('test', ['chained-test-examples'], (cb) ->
  cb()
)

gulp.task('dist', (taskCb) -> #['chained-complete'], (cb) ->
  fs = require('fs')
  git = require('git-cli')

  cfgNpm = require('./package.json')
  cfgBower = require('./bower.json')
  cfgBower.version = cfgNpm.version

  fs.writeFileSync('./bower.json', JSON.stringify(cfgBower, null, '  '))

  git.Repository.init('./', (err, repo) ->
    repo.add(['bower.json'], (err) ->
      repo.add(
        [
          'dist/to-json.coffee',
          'dist/to-json.node.js',
          'dist/to-json.umd.js',
          'dist/to-json.umd.min.js',
          'dist/to-json.web.js',
          'dist/to-json.web.min.js'
        ],
        { f: true },
        (err) ->
          repo.commit("Version #{cfgBower.version} for distribution", (err) ->
            taskCb()
          )
      )
    )
  )



  #console.log('To publish, run:');
  #console.log('    git add bower.json');
  #console.log('    git add -f ' + distConfig.debug);
  #console.log('    git add -f ' + distConfig.min);
  #console.log('    git checkout head');
  #console.log('    git commit -m \'Version ' + version + ' for distribution\'');
  #console.log('    git tag -a v' + version + ' -m \'Add tag v' + version + '\'');
  #console.log('    git checkout master');
  #console.log('    git push origin --tags');

  #cb()
  return
)

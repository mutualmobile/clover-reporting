Clover Dasboard - Reporting App
======

# Getting Started

## Setup Local Environment

1. __Get the code__

```bash
$ mkdir [clover_app] && cd [clover_app]
$ git clone https://stash.r.mutualmobile.com/scm/clov/clover.git .
```

2. __Install grunt-cli globally__

Note: this may require sudo

```bash
$ npm install -g grunt-cli
```

3. __Install dev dependencies for our tasks to work__

```bash
$ npm install
```

4. __Start Development Server__

```bash
$ grunt
```
Your application should now be running on `localhost:8080`.

## Deploying to Production

1. __Install NodeJS__

Instructions: https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager#ubuntu-mint

2. __Get the code__

```bash
$ mkdir var/node/[clover_app] && cd var/node/[clover_app]
$ git clone https://stash.r.mutualmobile.com/scm/clov/clover.git .
```

3. __Install grunt-cli globally__

Note: this may require sudo

```bash
$ npm install -g grunt-cli
```

4. __Install dev dependencies for our tasks to work__

```bash
$ npm install
```

5. __Build Production__

```bash
$ npm build:production
```

6. __Install Forever for Production Server__

```bash
$ npm install -g forever
```

7. __Run Production Server__

```bash
$ forever start index.js
```

## Grunt Tasks

Below is a list of grunt tasks to aid development and facilitate deployment.

### Default

A task that concurrently runs a static server for local development and watches less files. Server defaults to run on `localhost:8080` with `src` being the root directory.

- __Run the default static server and watch less__

```bash
$ grunt
```

### Server

A task that simply runs a static server for local development and testing. Defaults to run on `localhost:8080` with `src` being the root directory.

- __Run the default static server__

```bash
$ grunt server
```

### Build

Precompiles LESS and Dust templates, concats and minifies all CSS and JavaScript files, and builds all related files to `www`, `android/assets/www` and `ios/www` directories. 

- __Build with local config__

```bash
$ grunt build
```

- __Build with staging config__ (a copy of the build will be available in `www` folder)

```bash
$ grunt build:staging
```

- __Build with production config__ (a copy of the build will be available in `www` folder)

```bash
$ grunt build:production
```

### Test

Runs unit tests defined in `test/unit` directory with [Jasmine](http://pivotal.github.com/jasmine/) in a headless instance of Webkit using [PhantomJS](http://phantomjs.org/).

- __Run unit tests from `test/unit`__

```bash
$ grunt test
```

### Docs

Generates JavaScript documentation using [yuidoc](https://github.com/gruntjs/grunt-contrib-yuidoc). The resulting documentation is outputed to the `doc` folder.

- __Generate JavaScript Documentation__

```bash
$ grunt yuidoc
```
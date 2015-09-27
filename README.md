React + Babel Boilerplate
=========================

<div align="center">
<img src="http://i.imgur.com/PGH5x3y.png">
</div>

**Eaisly and quickly create:**

 * Web applications with React, Babel, and Hot Module Replacement
 * Electron apps with React and Babel

---

I love React, especially in conjunction with Babel for ES2015+ features and webpack for dealing with all my client-side asset issues, but getting set up on a new project, especially when I just want to toy with an idea, always feels like more work than it should be. This project provides some boilerplate to set up what **I** consider to be a common and useful starter project.

Instructions
------------

**IMPORTANT**: These operations are **destructive**. They will create, modify, and move files around. Take care if you're running them with uncommitted changes!

 1. Clone this repo, `cd` into it
 2. Run `./setup/install.sh`
 3. **[OPTIONAL]** If you want to build an [Electron](http://electron.atom.io/) app instead of a vanilla web app, run `./setup/electron/install.sh`. **This will delete `client` and `public`.** You still need to have run the previous step.
 4. Run `npm start` to start your new app

Don't forget to delete the `.git` folder and run your own `git init` so the history is reset!

What does it do?
----------------

### `./setup/install.sh`

This script sets up the basic project structure. You must run this even if you want to make an Electron app (below).

 1. Creates a new `package.json` file via `npm init -y` (accepts defaults)
 2. Installs and `--save`s the latest stable versions of the following packages:
    * [babel](https://npmjs.com/package/babel)
    * [babel-loader](https://npmjs.com/package/babel-loader)
    * [babel-runtime](https://npmjs.com/package/babel-runtime)
    * [babel-core](https://npmjs.com/package/babel-core)
    * [core-decorators](https://npmjs.com/package/core-decorators)
    * [webpack](https://npmjs.com/package/webpack)
    * [react](https://npmjs.com/package/react) (currently installs 0.14.0-rc1)
    * [react-dom](https://npmjs.com/package/react-dom) (currently installs 0.14.0-rc1)
 3. Installs and `--save-dev`s the latest stable versions of the following packages:
    * [webpack-dev-server](https://npmjs.com/package/webpack-dev-server)
    * [babel-plugin-react-transform](https://npmjs.com/package/babel-plugin-react-transform)
    * [react-transform-hmr](https://npmjs.com/package/react-transform-hmr)
 4. Adds a `start` script that starts `webpack-dev-server` with hot module replacement enabled and inlined
 5. Sets `private` to `true` inside `package.json` (to prevent accidental publishes)

### `./setup/electron/install.sh`

This script is optional, and **destructively** converts the project into a starter Electron app. It can only be run after `./setup/install.sh` is finished.

**You will lose all unsaved data from `client` and `public` by running this command.**

 1. Installs and `--save-dev`s the latest stable versions of the following packages:
    * [electron-prebuilt](https://npmjs.com/package/electron-prebuilt)
    * [electron-rebuild](https://npmjs.com/package/electron-rebuild)
 2. Changes `package.json` so that:
    1. Running `npm install` will automatically rebuild native modules so they work with Electron
    2. Running `npm start` will start the Electron app
 3. **Deletes** the `client` and `folder` folders
 4. Creates a new `app` folder with starter files for a working Electron app

### `.babelrc`

A `.babelrc` file is included that sets options for *both* the basic install *and* the Electron app install.

* Builds with [stage 2](https://babeljs.io/docs/usage/experimental/) options
    * Also enables the following additional features:
        * Decorators (`es7.decorators`)
* In development:
    * Enables `react-transform`, using the `react-transform-hmr` transform
* In production:
    * Enables the following Babel optimizations:
        * Constant elements (extracts `createElement` calls into constants if possible)
        * Inline elements (transform `createElement` calls into objects)

### webpack config

The webpack config is *only* used in the basic install (*not* the Electron install).

* `process.env.NODE_ENV` is defined client-side to be the same as server-side, defaulting to `"development"`
* `__DEV__` is defined as a `true`/`false` value reflecting whether `NODE_ENV` is `"development"` or not, useful for wrapping debug tools, etc. in `if (__DEV__)`
* Loads an entry from `./client/index.js`
* Loads static content from `./public`
* Builds to `./public/bundle.js`
* In development, it also:
    * Enables fast source maps
* In production, it also:
    * Enables minification via `UglifyJsPlugin`
    * Enables `DedupePlugin`

With the basic install, as you edit the JS file that ships with the repo, the page should update immediately. Syntax errors should show up in your browser console.

### Isn't this basically just like \<insert boilerplate generator here\>?

This project is designed to generate a very small number of files, with very little magic. Most of the complexity lives in the number of modules installed and the relatively complex Babel/webpack configuration.

The generator is small and simple enough that you can just delete the `setup` directory after you run the initial setup to clean up all non-essential code.

Shopify Theme Scaffold
======================

## Fork of Shopify Theme Scaffold
This is a variaton on the original. Changes include:

* Using Gulp instead of Grunt
* Added .editorconfig file based on syntax of current files
* Added sections directory
* Use of [Theme Kit][] instead of [Theme gem][]
* Browsers automatically updated on theme changes with [Browsersync][]

This repository provides a suggested directory structure and [Gulp][]
configuration for making the Shopify theme development process as smooth as
possible. It's closely modelled on the setup used at [Disco][] when building
Shopify themes.

It ships with a few sample theme files, mostly empty, that demonstrate how the
scaffold works. You should be able to slot any number of existing themes or
theme frameworks in. If you're starting off with a new theme, some of the
open-source options you have are:

- [Timber][], Shopify's new official theme framework;
- [Skeleton Theme][], Shopify's older bare-bones theme framework;
- [Bootstrapify][], an open-source Bootstrap-based framework by Lucid Design;
- [Shopify Theme Framework][], an open-source Foundation-based framework by Cam Gould.

You also have (shameless plug alert) a non-open-source, paid option in the form of [Bootstrap for Shopify][].

[Disco]: https://www.discolabs.com
[Gulp]: http://gulpjs.com
[Timber]: http://shopify.github.io/Timber/
[Skeleton Theme]: https://github.com/Shopify/skeleton-theme
[Bootstrapify]: https://github.com/luciddesign/bootstrapify
[Shopify Theme Framework]: https://github.com/Cam/Shopify-Theme-Framework
[Bootstrap for Shopify]: http://bootstrapforshopify.com/?utm_source=github&utm_medium=github&utm_content=readme&utm_campaign=shopify-theme-scaffold
[Theme Kit]: https://github.com/Shopify/themekit
[Theme gem]: https://github.com/Shopify/shopify_theme
[Browsersync]: https://www.browsersync.io/docs/gulp


## Dependencies and Setup
You're going to need `nodejs` and `npm` in order to run:

```shell
npm install
```

from the base directory, which should do the rest.


## Development Builds
Running `gulp` command will compile all of your files into the `.build`
directory in the directory structure expected by Shopify.

If you're familiar with the [Theme Kit][] command line tool, just add your theme
configuration details to a `config.yml` file in the `.build` directory, then
run `theme watch` in that directory. Subsequent builds of your theme that alter
files in the `theme` directory will have their changes automatically uploaded
to Shopify.

You can provide an optional `--nofity` argument with a file path that
you want to have updated when the workers have gone idle. So watching
changes on this file we can reload the page with [Browsersync][].
_(Default gulp command watches all of your files for changes.)_

```
theme watch --notify=/tmp/theme.update
````

In `serve` task set the URL of your shopify store in `proxy` property:

```js
gulp.task('serve', ['scripts', 'sass', 'copy'], function() {
  browserSync.init({
    proxy: 'https://your-store.myshopify.com',
    injectChanges: false,
  });
  // Do stuff
});
```

## Production Builds
The `gulp build` command assumes a production environment. It will build a
"production" version of your theme, with minified assets and optimised images.

You can run `gulp dist` to additionally generate a `.zip` file, packaging these
files up for direct upload through the Shopify Admin interface.

We highly recommend using [DeployBot][] to deploy Shopify themes in production.
Their new build server functionality is a perfect match for a Gulp-driven
theme build process.

[DeployBot]: https://deploybot.com


## Directory Structure

Here's a breakdown of the default directory structure that ships with the
scaffold:

#### theme/assets/js
Any Javascript files you'd like concatenated and (in production) minified
should go in here.

In `scripts` task `gulp.src` points to all scripts you'd like to use in
your theme:

```js
gulp.task('scripts', function() {
  return gulp.src(['theme/assets/js/script-*.js'])
  // Do stuff
});
```

#### theme/assets/scss
Any stylesheets you'd like to be precompiled and (in production) minified
should go in here.

In `sass` task `gulp.src` points to only one source file `theme/assets/scss/styles.scss`,
manifest that includes other sass partials.

```js
gulp.task('sass', function() {
  return gulp.src('theme/assets/scss/styles.scss')
  // Do stuff
});
```

#### theme/assets/static
Add any static assets that don't require preprocessing here - for example
images, font files, and pre-minified third-party Javascript libraries. Unlike
Shopify's `/assets` directory, you can nest your files here in subdirectories.
Just be aware that the directory structure is flattened in the build process,
so files with the same name will conflict. This shouldn't be an issue if you
use a simple nesting structure (for example, one subdirectory for each asset
type).

Image files (PNG, GIF, JPG) will be optimised using
`gulp-imagemin` before being output to the `.build` directory.

#### theme/layout
All `.liquid` files in `theme/layout` are copied directly into
`.build/layout` on compilation.

#### theme/locales
All `.json` files in `theme/locales` are copied directly into `.build/locales`
on compilation.

#### theme/config
The `settings_schema.json` file will be copied from `theme/config` to
`.build/config` on compilation.

#### theme/snippets
All `.liquid` files in `theme/snippets` are copied directly into
`.build/templates` on compilation.

#### theme/sections
All `.liquid` files in `theme/sections` are copied directly into
`.build/sections` on compilation.

#### theme/templates
All `.liquid` files in `theme/templates` are copied directly into
`.build/templates` on compilation. Customer templates in
`theme/templates/customers` are copied to `.build/templates/customers`.


## Contributions
Contributions are very much welcome! Just open a pull request, or raise an
issue to discuss a proposed change.

---

#### About the Author

[Gavin Ballard][] is a developer at [Disco][], specialising in Shopify
development. Related projects:

- [Cart.js][]
- [Bootstrap for Shopify][]
- [Mastering Shopify Themes][]

[Cart.js]: http://cartjs.org/?utm_source=github&utm_medium=readme&utm_campaign=shopify-theme-scaffold
[Bootstrap for Shopify]: http://bootstrapforshopify.com/?utm_source=github&utm_medium=readme&utm_campaign=shopify-theme-scaffold
[Mastering Shopify Themes]: http://gavinballard.com/mastering-shopify-themes/?utm_source=github&utm_medium=readme&utm_campaign=shopify-theme-scaffold
[Gavin Ballard]: http://gavinballard.com/?utm_source=github&utm_medium=readme&utm_campaign=shopify-theme-scaffold
[Disco]: http://discolabs.com/?utm_source=github&utm_medium=readme&utm_campaign=shopify-theme-scaffold

<p align="center">
    <img width="128" src=".github/logo.png" alt="Logo" />
</p>

<h1 align="center">Exoticicon</h1>

<blockquote align="center">
    Easy-to-use CLI tool to generate to generate icon web-font kits from SVG files!
</blockquote>

<div style="margin-top: 20px;" align="center">
    <p align="center">
        <img src="https://github.com/epycsolutions/exoticicon/workflows/Test/badge.svg" alt="workflow test">
        <img src="https://github.com/epycsolutions/exoticicon/workflows/Release/badge.svg" alt="workflow release">
    </p>
    <p align="center">
        <img src="https://img.shields.io/npm/dm/exoticicon.svg" alt="npm monthly downloads" />
    </p>
</div>

### Intro

Icon font generation, easy to use and highly configurable!

It also generated TS, JSON maps if the generated code-points, allowing for a gread deal of
different usages, e.g. integrating with React type-safe icon components or integration on
mobile apps by just combining TTF and JSON generation.

### Install

```bash
npm install -g exoticicon
```

## Use

### Quick usage

```bash
exoticicon custom-icons -o icon-dist
```

### Command-line

**Note**: Not all options can be specified through the command line, `formatOptions`, `pathOptions`, `getIconId`
and `templates` use a [configuration file](#configuration-file) or the JS [API](#api).

```
Usage: exoticicon [options] [input-dir]

Options:
-V, --version                   ouput the version number
-c, --config <value>            custom config path (default: .exoticicon | exoticicon | .exoticion.json | exoticicon.json | .exoticicon.js | exoticicon.js)

-o, ---output <value>           specify output directory
-n, --name <value>              base name of the font set used both as default asset name (default: icons)
-t, --font-types <value...>     specify font formats to generate (default: eot, woff2, woff - available: eot, woff2, woff, ttf, svg)
-g, --asset-types <value...>    specify other asset types to generate (default: css, html, json, js - available: css, scss, sass, html, json, ts)
-h, --font-height <value>       the output font height (icons will be scaled so the highest has this height) (default: 300)
--descent <value>               the font descent
--normalize [bool]              normalize icons by scaling them to the height of the highest icon
-r, --round [bool]              setup the SVG path rounding [10e12]
--selector <value>              use a CSS selector instead of 'tag + prefix' (default: null)
-p, --prefix <value>            CSS class prefix (default: icon)
--tag <value>                   CSS vbase tag for icons (default: i)
-u, --fonts-url <value>         public URL to the fonts directory (used in the generated CSS)

--debug                         display errors stack trace (default: false)
--silent                        run with no logs (default: false)
--help                          display help for command
```

### Configuration file

Some options (specifically, `formatOptions`, `pathOptions` and `getIconId`) cannot be passed to the CLI directly.

To have more control and better readability, you can create a simple configuration file.

By default `exoticicon` will look for one of following files in the working directory:

```
.exoticicon | exoticicon | .exoticion.json | exoticicon.json | .exoticicon.js | exoticicon.js
```

You can specify a custom `--config` option with your configuration file path.

Here's an example `exoticicon.js`

```js
module.exports = {
    inputDir: './icons', // required
    outputDir: './dist', // required
    fontTypes: ['ttf', 'woff', 'woff2'],
    assetTypes: ['ts', 'css', 'json', 'html'],
    fontsUrl: '/static/fonts',
    formatOptions: {
        woff: {
            // WOFF extended metadata block - see https://w3.org/TR/WOFF/#Metadata
            metadata: '...'
        },
        json: {
            indent: 2
        },
        ts: {
            // select what kind of types you want to generate (default `['enum', 'constant', 'literalId', 'literalKey']`)
            types: ['constant', 'literalId'],
            // render the types with `'` instead of `"` (default is `"`)
            singleQuotes: true,
            // customise names used for the generated types and constants
            enumName: 'MyIconType',
            constantName: 'MY_CODEPOINTS'
            // literalIdName: 'IconId',
            // literalKeyName: 'IconKey'
        }
    },
    // Use a custom Handlebars template
    templates: {
        css: './my-custom.css.hbs'
    },
    pathOptions: {
        ts: './src/types/icon-types.ts',
        json: './misc/icon-codepoints.json'
    },
    codepoints: {
        'chevron-left': 57344, // decimal representation of 0xe000
        'chevron-right': 57445,
        'thumbs-up': 57358,
        'thumbs-down': 57359
    },
    // Customize generated icon IDs (unavailable with `.json` config file)
    getIconId: ({
        basename, // `string` - Example: 'foo';
        relativeDirPath, // `string` - Example: 'sub/dir/foo.svg'
        absoluteFilePath, // `string` - Example: '/var/icons/sub/dir/foo.svg'
        relativeFilePath, // `string` - Example: 'foo.svg'
        index // `number` - Example: `0`
    }) => [index, basename].join('_') // '0_foo'
};
```

### API

#### Simple usage

```js
import { generateFonts } from 'exoticicon';

generateFonts().then(results => console.log('Done', results));
```

#### Options

```js
import { generateFonts } from 'exoticicon';

generateFonts({
    name: 'icons',
    fontTypes: [FontAssetType.EOT, FontAssetType.WOFF2, FontAssetType.WOFF],
    assetTypes: [
        OtherAssetType.CSS,
        OtherAssetType.HTML,
        OtherAssetType.JSON,
        OtherAssetType.TS
    ],
    formatOptions: { json: { indent: 2 } },
    templates: {},
    pathOptions: {},
    codepoints: {},
    fontHeight: 300,
    round: undefined, // --
    descent: undefined, // Will use `svgicons2svgfont` defaults
    normalize: undefined, // --
    selector: null,
    tag: 'i',
    prefix: 'icon',
    fontsUrl: null
}).then(results => console.log(results));
```

#### Organising icons

Icon names and className will be generated from a slug of the relative path + basename of each `.svg` file found in the input directory.

This allows arranging your icons in namespaces, which can be useful if a project uses a large number of icons.

Considering the following `./icons` input directory:

```
icons
├── logo.svg
├── social
│   ├── facebook.svg
│   └── twitter.svg
└── symbol
    └── chevron
        ├── left.svg
        └── right.svg
```

Running `exoticicon ./icons -o dist` will generate a font-set with the following Icon IDs / CSS selectors:
And the generated icon IDs would be:

| Icon ID                | CSS selector                 |
| ---------------------- | ---------------------------- |
| `social-facebook`      | `.icon.icon-social-facebook` |
| `social-twitter`       | `.icon.icon-social-twitter`  |
| `symbol-chevron-left`  | `.icon.icon-chevron-left`    |
| `symbol-chevron-right` | `.icon.icon-chevron-right`   |

You can provide a `getIconId` function via the configuration file to customize how the icon IDs / CSS selectors are derived from the filepath.
The function will receive relative paths to the icon and the input directory as arguments, and must return a unique string to be used as the ID.

<blockquote style="margin-top: 40px;" align="center">
    Copyright (c) 2023 Epyc Solutions. - Released under the <a href="/LICENSE">MIT license</a>
</blockquote>

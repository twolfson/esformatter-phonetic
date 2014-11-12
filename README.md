# esformatter-phonetic [![Build status](https://travis-ci.org/twolfson/esformatter-phonetic.png?branch=master)](https://travis-ci.org/twolfson/esformatter-phonetic)

[Esformatter][`esformatter`] plugin that renames variables and functions to pronounceable names

This was built to make reading obfuscated scripts easier (e.g. expand a single character variable to a full name, `a` -> `apple`). It was inspired by [`beautify-with-words`][] but we wanted to leverage other [`esformatter`][] plugins.

[`beautify-with-words`]: https://github.com/zertosh/beautify-with-words
[`esformatter`]: https://github.com/millermedeiros/esformatter

## Getting Started
Install the module with: `npm install esformatter-phonetic`

Then, register it as a plugin and format your JS:

```js
// Load and register our plugin
var esformatter = require('esformatter');
var esformatterPhonetic = require('esformatter-phonetic');
esformatter.register(esformatterPhonetic);

// Format our code
esformatter.format([
  'function hello() {',
    'var a = \'hello\';',
    'console.log(a);',
  '}'
].join('\n'));
/*
function hello() {
  var kusoce = 'hello';
  console.log(kusoce);
}
*/
```

Alternatively, load it via `format` or `.esformatter`:

```js
{
  plugins: [
    'esformatter-phonetic'
  ]
}
```

## Documentation
`esformatter-phonetic` exposes `exports.transform` for consumption by `esformatter`.

### Options
We allow for options via a `phonetic` key in your `esformatter` options.

- Any option provided by [`phonetic`][] (e.g. `syllables`, `phoneticSimplicity`)
- baseSeed `String|Number` - Starting point for generating phonetic names.
    - If specified, we will start here and add `1` to the value (i.e. for numbers, it will increment. for strings, it will concatenate).

[`phonetic`]: https://github.com/TomFrost/node-phonetic

### `esformatterPhonetic.transform(ast)`


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint via [grunt](https://github.com/gruntjs/grunt) and test via `npm test`.

## Donating
Support this project and [others by twolfson][gratipay] via [gratipay][].

[![Support via Gratipay][gratipay-badge]][gratipay]

[gratipay-badge]: https://cdn.rawgit.com/gratipay/gratipay-badge/2.x.x/dist/gratipay.png
[gratipay]: https://www.gratipay.com/twolfson/

## Unlicense
As of Nov 03 2014, Todd Wolfson has released this repository and its contents to the public domain.

It has been released under the [UNLICENSE][].

[UNLICENSE]: UNLICENSE

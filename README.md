# esformatter-phonetic [![Build status](https://travis-ci.org/twolfson/esformatter-phonetic.png?branch=master)](https://travis-ci.org/twolfson/esformatter-phonetic)

Esformatter plugin that renames variables and functions to pronounceable names

**Progress on this project has been halted. I thought it would be a simple problem but there are a lot of hard parts. For the time being, please use `beautify-with-words`.**

Problems:

- Don't rename undeclared globals (e.g. `console`)
- Figure out what to do in a `with`
- Rename properties consistently across (e.g. `a.b`, `c.b` -> `hello.world`, `goodbye.moon`)
    - Technically we don't need `b` to change between definitions but we need to keep track since `with` might cause issues... never mind it wouldn't.
    - TODO: Delete this point

## Getting Started
Install the module with: `npm install esformatter-phonetic`

```js
var esformatter_phonetic = require('esformatter-phonetic');
esformatter_phonetic.awesome(); // "awesome"
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

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

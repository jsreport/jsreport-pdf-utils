**⚠️ This repository has been moved to the monorepo [jsreport/jsreport](https://github.com/jsreport/jsreport)**
--

# jsreport-pdf-utils
[![NPM Version](http://img.shields.io/npm/v/jsreport-pdf-utils.svg?style=flat-square)](https://npmjs.com/package/jsreport-pdf-utils)
[![Build Status](https://travis-ci.org/jsreport/jsreport-pdf-utils.png?branch=master)](https://travis-ci.org/jsreport/jsreport-pdf-utils)

> jsreport extension providing pdf operations like merge or concatenation

See https://jsreport.net/learn/pdf-utils

## Installation

```bash
npm install jsreport-pdf-utils
```

## jsreport-core
You can apply this extension also manually to [jsreport-core](https://github.com/jsreport/jsreport-core)

```js
var jsreport = require('jsreport-core')()
jsreport.use(require('jsreport-pdf-utils')())
```

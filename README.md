Mongoose-erd-generator
===============================

NodeJS Buffer interface provides a way to manipulate bytes, but what if we needed to manipulate bits?

This library was created to address the gap of a built-in bit interface.

[![Build Status](https://travis-ci.org/jodevsa/node-bitview.svg?branch=master)](https://travis-ci.org/jodevsa/node-bitview)
[![bitHound Dependencies](https://www.bithound.io/github/jodevsa/node-bitview/badges/dependencies.svg)](https://www.bithound.io/github/jodevsa/node-bitview/master/dependencies/npm)
![bitHound Overall Score](https://www.bithound.io/github/jodevsa/node-bitview/badges/score.svg)
![issues](https://img.shields.io/github/issues/jodevsa/node-bitview.svg)
![stars](https://img.shields.io/github/stars/jodevsa/node-bitview.svg)
![license](https://img.shields.io/github/license/jodevsa/node-bitview.svg)

Installation
-----

`npm install bitview --save`

Initializing a view
-----
    new BitView(Length)
    new BitView(buffer)
    new BitView(buffer, byteOffset, length);
    Buffer.from(arg)

##### Parameters:
    length: length in bits
    buffer: use an existing buffer
    arg: Another interface to create a new BitView instance
    arg could be an array of bits [1,0,1] or a string '1010' or a buffer.
    byteOffset: default 0, starting offset of the bitview.

Methods
-----    
### .flip(pos)
    flips the value of the bit at location pos
### .get(pos)
    Returns the value of the bit at location pos  (0 or 1)
### .set(pos,v)
    Sets the value of a bit at location pos to v
### .toString()
      Returns a string representation of the BitView.
### .toBuffer()
    Returns the buffer used by the view.
Properties
-----
### .length
    Returns length in bits.

Usage:

```javascript
const BitView = require("bitview")

const view= new BitView(10);

view.set(0,true);
console.log(view.get(0)); // true
view.flip(0)
console.log(view.get(0)); // false

const view2=BitView.from('101010');
console.log(view2.get(2)); // true

const view3=BitView.from([1, 0, 1]);
console.log(view3.get(1)); // false
console.log(view3.get(2)); // true
```
Implementation
----------------------
BitView uses bitwise operations to manipulate each bit in a buffer (Low Complexity)

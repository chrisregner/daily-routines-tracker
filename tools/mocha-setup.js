import { JSDOM } from 'jsdom'
import chai, { expect } from 'chai'
import { shallow, mount } from 'enzyme'
import chaiEnzyme from 'chai-enzyme'
import td from 'testdouble'
import Chance from 'chance'

/* Setup virtual DOM */

const jsdom = new JSDOM('<!doctype html><html><body></body></html>')
const { window } = jsdom
const copyProps = (src, target) => {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .map(prop => Object.getOwnPropertyDescriptor(src, prop))

  Object.defineProperties(target, props)
}

global.window = window
global.document = window.document
global.navigator = { userAgent: 'node.js' }

copyProps(window, global)

// TODO: find out if you need to override non-js requires

/* eslint-disable node/no-deprecated-api */
import { JSDOM } from 'jsdom'

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

/* Override non-JS requires cause Node.js can't and shouldn't understand them */

process.env.NODE_ENV = 'test'

function noop () {
  return null
}

require.extensions['.css'] = noop
require.extensions['.scss'] = noop
require.extensions['.md'] = noop
require.extensions['.png'] = noop
require.extensions['.svg'] = noop
require.extensions['.jpg'] = noop
require.extensions['.jpeg'] = noop
require.extensions['.gif'] = noop

/**
 * Temporary fix for chai
 * https://github.com/chaijs/type-detect/pull/91
 */
global.HTMLElement = window.HTMLElement

import { h } from '../../lib/guide-mini-vue.esm.js'
import { Foo } from './Foo.js';

window.self = null
export const App = {
  name: 'App',
  render() {
    window.self = this

    return h('div', {
      id: 'root',
      class: ['red', 'hard'],
      onClick() {
        console.log('root clicked')
      },
      onMousedown() {
        console.log('root mousedown')
      }
    },
      [
        h('div', {}, 'hi, ' + this.msg),
        h(Foo, {
          count: 1
        })
      ]
      // "hi, " + this.msg
      //   [
      //   h('p', { class: 'red' }, 'hi'),
      //   h('p', { class: 'blue' }, 'mini-vue'),
      //   ]
    )
  },

  setup() {

    return {
      msg: 'mini-vue 111'
    }
  }
}

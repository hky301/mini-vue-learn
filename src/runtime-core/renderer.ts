import { effect } from '../reactivity/effect';
import { ShapeFlags } from '../shared/ShapeFlags';
import { EMPTY_OBJ, isObject } from './../shared/index';
import { createComponentInstance, setupComponent } from "./component";
import { createAppAPI } from './createApp';
import { Fragment, Text } from './vnode';


export function createRenderer(options) {

  const { createElement: hostCreateElement, patchProp: hostPatchProp, insert: hostInsert } = options;


  function render(vnode, container) {

    patch(null, vnode, container, null);
  }

  function patch(n1, n2, container, parentComponent) {

    const { type, shapeFlag } = n2

    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent)
        break;
      case Text:
        processText(n1, n2, container)
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent)
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, parentComponent);
        }
        break;
    }

  }

  function processText(n1, n2, container) {
    const { children } = n2
    const textNode = (n2.el = document.createTextNode(children))
    container.append(textNode)
  }

  function processFragment(n1, n2, container, parentComponent) {
    mountChildren(n2, container, parentComponent)
  }

  function processElement(n1, n2: any, container: any, parentComponent) {
    if (!n1) {

      mountElement(n2, container, parentComponent)
    } else {
      patchElement(n1, n2, container)
    }
  }
  function patchElement(n1, n2, container) {
    console.log('patchElement');
    console.log('n1: ', n1);
    console.log('n2: ', n2);

    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;

    const el = (n2.el = n1.el);

    patchProps(el, oldProps, newProps)

  }




  function patchProps(el, oldProps, newProps) {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        const prevProp = oldProps[key];
        const nextProp = newProps[key];

        if (prevProp !== nextProp) {
          hostPatchProp(el, key, prevProp, nextProp);
        }
      }

      if (oldProps !== EMPTY_OBJ) {

        for (const key in oldProps) {
          if (!(key in newProps)) {
            hostPatchProp(el, key, oldProps[key], null);
          }
        }
      }
    }
  }


  function mountElement(n2: any, container: any, parentComponent) {
    const el = (n2.el = hostCreateElement(n2.type));

    const { children, props, shapeFlag } = n2

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children

    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(n2, el, parentComponent)
    }

    for (const key in props) {
      const val = props[key]
      hostPatchProp(el, key, null, val)
    }

    hostInsert(el, container)
  }

  function mountChildren(vnode, container, parentComponent) {
    vnode.children.forEach(v => {
      patch(null, v, container, parentComponent)
    })
  }


  function processComponent(n1, n2, container, parentComponent) {
    mountComponent(n2, container, parentComponent);
  }

  function mountComponent(initinalVNode, container, parentComponent) {
    const instance = createComponentInstance(initinalVNode, parentComponent)

    setupComponent(instance);

    setupRenderEffect(instance, initinalVNode, container)
  }


  function setupRenderEffect(instance, initinalVNode, container) {
    effect(() => {
      if (!instance.isMounted) {
        const { proxy } = instance
        const subTree = (instance.subTree = instance.render.call(proxy))

        patch(null, subTree, container, instance)

        initinalVNode.el = subTree.el
        instance.isMounted = true
      } else {
        console.log('update');

        const { proxy } = instance
        const subTree = instance.render.call(proxy)
        const prevSubTree = instance.subTree
        instance.subTree = subTree

        console.log('currentTree', subTree);
        console.log('prevTree', prevSubTree);


        patch(prevSubTree, subTree, container, instance)

      }
    })

  }

  return {
    createApp: createAppAPI(render),
  }

}

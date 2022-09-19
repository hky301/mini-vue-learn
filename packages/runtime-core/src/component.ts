import { proxyRefs, shallowReadonly } from "@mini-vue/reactivity";
import { emit } from "./componentEmit";
import { initProps } from "./componentProps";
import { PublicInstanceProxyHandlers } from "./componentPublicInstance";
import { initSlots } from "./componentSlot";

export function createComponentInstance(vnode, parent) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    slots: {},
    provides: parent ? parent.provides : {},
    parent,
    isMounted: false,
    subTree: {},
    emit: () => { }
  }

  component.emit = emit.bind(null, component) as any

  return component
}


export function setupComponent(instance) {

  // TODO:
  initProps(instance, instance.vnode.props)
  initSlots(instance, instance.vnode.children)


  setupStateComponent(instance);
}

function setupStateComponent(instance: any) {
  const component = instance.type;

  const { setup } = component

  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers)

  if (setup) {
    setCurrentInstance(instance)
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit,
    })
    setCurrentInstance(null)

    handleSetupResult(instance, setupResult)
  }
}

function handleSetupResult(instance, setupResult) {

  if (typeof setupResult === 'object') {
    instance.setupState = proxyRefs(setupResult)
  }

  finishComponentSetup(instance)
}

function finishComponentSetup(instance) {
  const Component = instance.type

  if (compiler && !Component.render) {
    if (Component.template) {
      Component.render = compiler(Component.template)
    }
  }

  instance.render = Component.render
}

let currentInstance: any = null

export function getCurrentInstance() {
  return currentInstance
}


export function setCurrentInstance(instance) {
  currentInstance = instance
}


let compiler

export function registerRuntimeCompiler(_compiler) {
  compiler = _compiler
}

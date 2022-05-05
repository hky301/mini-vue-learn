import { shallowReadonly } from "../reactivity/reactive";
import { emit } from "./componentEmit";
import { initProps } from "./componentProps";
import { PublicInstanceProxyHandlers } from "./componentPublicInstance";
import { initSlots } from "./componentSlot";

export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    slots: {},
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
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit,
    })

    handleSetupResult(instance, setupResult)
  }
}

function handleSetupResult(instance, setupResult) {

  if (typeof setupResult === 'object') {
    instance.setupState = setupResult
  }

  finishComponentSetup(instance)
}

function finishComponentSetup(instance) {
  const component = instance.type


  if (component.render) {
    instance.render = component.render
  }
}

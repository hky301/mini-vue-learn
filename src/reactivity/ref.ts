import { isObject } from './../shared/index';
import { hasChanged } from "../shared";
import { isTracking, trackEffects, triggerEffect } from "./effect";
import { reactive } from './reactive';


class RefImpl {
  private _value: any;
  private _rawValue: any;
  public dep;
  constructor(value) {
    this._rawValue = value
    this._value = convert(value)
    this.dep = new Set()
  }

  get value() {
    trackRefValue(this)
    return this._value
  }
  set value(newValue) {
    if (!hasChanged(this._rawValue, newValue)) return
    this._value = convert(newValue)
    this._rawValue = newValue
    triggerEffect(this.dep)
  }
}

function convert(value) {
  return isObject(value) ? reactive(value) : value
}

function trackRefValue(ref) {
  if (isTracking()) {
    trackEffects(ref.dep)
  }
}

export function ref(value) {
  return new RefImpl(value)
}

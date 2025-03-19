// lib/emitter.ts
import { EventEmitter } from 'events';
import { nanoid } from 'nanoid';

const globalAny = global as any;
export const emitterSalt = globalAny.emitterSalt || nanoid();
export const emitter = globalAny.emitter || new EventEmitter();
globalAny.emitterSalt = emitterSalt;
globalAny.emitter = emitter;

// 如何利用 globalThis 来单例
export const emitterSalt2 = (globalThis as { emitterSalt2?: string }).emitterSalt2 || nanoid();
export const emitter2 = (globalThis as { emitter2?: EventEmitter }).emitter2 || new EventEmitter();
(globalThis as { emitterSalt2?: string }).emitterSalt2 = emitterSalt;
(globalThis as { emitter2?: EventEmitter }).emitter2 = emitter2;

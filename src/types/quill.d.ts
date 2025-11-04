/**
 * Type definitions for Quill 2.0.3
 * Provides TypeScript support for Quill editor
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */

declare module 'quill' {
  export interface QuillOptions {
    theme?: string
    modules?: Record<string, any>
    formats?: string[]
    placeholder?: string
    readOnly?: boolean
    bounds?: HTMLElement | string
    debug?: string | boolean
    scrollingContainer?: HTMLElement | string | null
    registry?: any
  }

  export interface QuillModule {
    quill: Quill
  }

  export interface Range {
    index: number
    length: number
  }

  export interface Delta {
    ops?: any[]
    insert?: any
    delete?: number
    retain?: number
    attributes?: Record<string, any>
  }

  export interface StringMap {
    [key: string]: any
  }

  export interface Sources {
    api: 'api'
    user: 'user'
    silent: 'silent'
  }

  export type Source = 'api' | 'user' | 'silent'

  export interface Clipboard extends QuillModule {
    addMatcher(
      selectorOrNodeType: string | number,
      callback: (node: any, delta: Delta) => Delta
    ): void
    dangerouslyPasteHTML(html: string, source?: Source): void
    dangerouslyPasteHTML(index: number, html: string, source?: Source): void
  }

  export interface Keyboard extends QuillModule {
    addBinding(key: any, callback: any): void
    addBinding(key: any, context: any, callback: any): void
  }

  export interface History extends QuillModule {
    clear(): void
    cutoff(): void
    undo(): void
    redo(): void
  }

  export interface Toolbar extends QuillModule {
    addHandler(format: string, handler: Function): void
  }

  export default class Quill {
    constructor(container: HTMLElement | string, options?: QuillOptions)

    // Content API
    deleteText(index: number, length: number, source?: Source): Delta
    getContents(index?: number, length?: number): Delta
    getLength(): number
    getText(index?: number, length?: number): string
    insertEmbed(index: number, type: string, value: any, source?: Source): Delta
    insertText(index: number, text: string, source?: Source): Delta
    insertText(
      index: number,
      text: string,
      formats: StringMap,
      source?: Source
    ): Delta
    setContents(delta: Delta, source?: Source): Delta
    setText(text: string, source?: Source): Delta
    updateContents(delta: Delta, source?: Source): Delta

    // Formatting API
    format(name: string, value: any, source?: Source): Delta
    formatLine(index: number, length: number, source?: Source): Delta
    formatLine(
      index: number,
      length: number,
      format: string,
      value: any,
      source?: Source
    ): Delta
    formatLine(
      index: number,
      length: number,
      formats: StringMap,
      source?: Source
    ): Delta
    formatText(index: number, length: number, source?: Source): Delta
    formatText(
      index: number,
      length: number,
      format: string,
      value: any,
      source?: Source
    ): Delta
    formatText(
      index: number,
      length: number,
      formats: StringMap,
      source?: Source
    ): Delta
    getFormat(range?: Range): StringMap
    getFormat(index: number, length?: number): StringMap
    removeFormat(index: number, length: number, source?: Source): Delta

    // Selection API
    getBounds(
      index: number,
      length?: number
    ): {
      bottom: number
      height: number
      left: number
      right: number
      top: number
      width: number
    }
    getSelection(focus?: boolean): Range | null
    setSelection(index: number, length?: number, source?: Source): void
    setSelection(range: Range, source?: Source): void

    // Editor API
    blur(): void
    disable(): void
    enable(enabled?: boolean): void
    focus(options?: { preventScroll?: boolean }): void
    hasFocus(): boolean
    update(source?: Source): void

    // Events API
    on(eventName: string, handler: (...args: any[]) => void): Quill
    once(eventName: string, handler: (...args: any[]) => void): Quill
    off(eventName: string, handler?: (...args: any[]) => void): Quill

    // Modules API
    getModule(name: 'clipboard'): Clipboard
    getModule(name: 'keyboard'): Keyboard
    getModule(name: 'history'): History
    getModule(name: 'toolbar'): Toolbar
    getModule(name: string): any

    // Extension API
    static debug(level: string | boolean): void
    static find(node: Node, bubble?: boolean): any
    static import(path: string): any
    static register(
      path: string | StringMap,
      target?: any,
      overwrite?: boolean
    ): void

    // Properties
    root: HTMLDivElement
    container: HTMLElement
    scroll: any
    theme: any

    // Additional methods
    getSemanticHTML(index?: number, length?: number): string
  }

  export { Quill }
}

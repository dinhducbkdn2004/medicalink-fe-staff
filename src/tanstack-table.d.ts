/* eslint-disable */
import '@tanstack/react-table'

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    className?: string
    tdClassName?: string
    thClassName?: string
  }
}

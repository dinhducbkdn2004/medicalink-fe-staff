/**
 * Data Table Context Menu
 * Right-click context menu for table rows
 */

import * as React from 'react'
import { type Row } from '@tantml:react-table'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'

type Action = {
  label: string
  icon?: React.ComponentType<{ className?: string }>
  onClick: () => void
  variant?: 'default' | 'destructive'
  separator?: boolean
}

type DataTableContextMenuProps<TData> = {
  row: Row<TData>
  actions: Action[]
  children: React.ReactNode
}

/**
 * Context menu component for table rows
 * 
 * @example
 * ```tsx
 * <DataTableContextMenu
 *   row={row}
 *   actions={[
 *     { label: 'View', icon: Eye, onClick: handleView },
 *     { label: 'Edit', icon: Edit, onClick: handleEdit },
 *     { label: 'Delete', icon: Trash, onClick: handleDelete, variant: 'destructive', separator: true },
 *   ]}
 * >
 *   <TableRow>...</TableRow>
 * </DataTableContextMenu>
 * ```
 */
export function DataTableContextMenu<TData>({
  row,
  actions,
  children,
}: DataTableContextMenuProps<TData>) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className='w-48'>
        <ContextMenuGroup>
          {actions.map((action, index) => (
            <React.Fragment key={index}>
              {action.separator && <ContextMenuSeparator />}
              <ContextMenuItem
                onClick={(e) => {
                  e.preventDefault()
                  action.onClick()
                }}
                className={
                  action.variant === 'destructive'
                    ? 'text-destructive focus:text-destructive'
                    : ''
                }
              >
                {action.icon && <action.icon className='mr-2 h-4 w-4' />}
                <span>{action.label}</span>
              </ContextMenuItem>
            </React.Fragment>
          ))}
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  )
}


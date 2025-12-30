
import { Skeleton } from './skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table'

interface TableSkeletonProps {
  
  columnCount?: number

  
  rowCount?: number

  
  showCheckbox?: boolean

  
  showActions?: boolean

  
  className?: string
}

export function TableSkeleton({
  columnCount = 5,
  rowCount = 10,
  showCheckbox = true,
  showActions = true,
  className = '',
}: TableSkeletonProps) {
  
  const actualColumnCount =
    columnCount + (showCheckbox ? 1 : 0) + (showActions ? 1 : 0)

  return (
    <div className={`overflow-hidden rounded-md border ${className}`}>
      <Table>
        <TableHeader>
          <TableRow className='hover:bg-transparent'>
            {showCheckbox && (
              <TableHead className='w-12'>
                <Skeleton className='h-4 w-4' />
              </TableHead>
            )}
            {Array.from({ length: columnCount }).map((_, index) => (
              <TableHead key={`header-${index}`}>
                <Skeleton className='h-4 w-full' />
              </TableHead>
            ))}
            {showActions && (
              <TableHead className='w-20'>
                <Skeleton className='h-4 w-full' />
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rowCount }).map((_, rowIndex) => (
            <TableRow key={`row-${rowIndex}`} className='hover:bg-transparent'>
              {showCheckbox && (
                <TableCell>
                  <Skeleton className='h-4 w-4' />
                </TableCell>
              )}
              {Array.from({ length: columnCount }).map((_, colIndex) => (
                <TableCell key={`cell-${rowIndex}-${colIndex}`}>
                  <Skeleton className='h-4 w-full' />
                </TableCell>
              ))}
              {showActions && (
                <TableCell>
                  <Skeleton className='h-8 w-8 rounded-md' />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

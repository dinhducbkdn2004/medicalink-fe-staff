
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

interface CollapsibleSectionProps {
  title: string
  description?: string
  defaultOpen?: boolean
  children: React.ReactNode
}

export function CollapsibleSection({
  title,
  description,
  defaultOpen = true,
  children,
}: CollapsibleSectionProps) {
  return (
    <Collapsible defaultOpen={defaultOpen}>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div className='flex-1'>
              <CardTitle className={description ? 'text-base' : 'text-sm'}>
                {title}
              </CardTitle>
              {description && (
                <CardDescription className='text-xs'>{description}</CardDescription>
              )}
            </div>
            <CollapsibleTrigger asChild>
              <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                <ChevronDown className='h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180' />
                <span className='sr-only'>Toggle {title}</span>
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className='pt-0'>{children}</CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}


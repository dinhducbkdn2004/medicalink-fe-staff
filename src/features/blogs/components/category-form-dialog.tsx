import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { BlogCategory } from '@/api/services/blog.service'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { CategoryFormValues, categorySchema } from '../data/schema'
import {
  useCreateBlogCategory,
  useUpdateBlogCategory,
} from '../data/use-blog-categories'

interface CategoryFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: BlogCategory | null
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
}: CategoryFormDialogProps) {
  const { mutate: createCategory, isPending: isCreating } =
    useCreateBlogCategory()
  const { mutate: updateCategory, isPending: isUpdating } =
    useUpdateBlogCategory()

  const isPending = isCreating || isUpdating

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        description: category.description || '',
      })
    } else {
      form.reset({
        name: '',
        description: '',
      })
    }
  }, [category, form, open])

  const onSubmit = (values: CategoryFormValues) => {
    if (category) {
      updateCategory(
        { id: category.id, data: values },
        {
          onSuccess: () => onOpenChange(false),
        }
      )
    } else {
      createCategory(values, {
        onSuccess: () => onOpenChange(false),
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            {category ? 'Edit Category' : 'Create Category'}
          </DialogTitle>
          <DialogDescription>
            {category
              ? 'Make changes to the category here.'
              : 'Add a new category for your blog posts.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter category name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Enter category description'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isPending}>
                {isPending ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

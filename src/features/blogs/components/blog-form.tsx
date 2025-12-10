import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import type { Blog, BlogCategory } from '@/api/services/blog.service'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { ImageUpload } from '@/components/ui/image-upload'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useBlogCategories } from '../data/use-blog-categories'
import { useCreateBlog, useUpdateBlog } from '../data/use-blogs'
import { RichTextEditor } from './editor'

const blogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  categoryId: z.string().min(1, 'Category is required'),
  thumbnailUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  content: z.string().min(1, 'Content is required'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
})

type BlogFormValues = z.infer<typeof blogSchema>

interface BlogFormProps {
  initialData?: Blog
}

export function BlogForm({ initialData }: BlogFormProps) {
  const navigate = useNavigate()
  const { data: categoriesData } = useBlogCategories({ limit: 100 })
  const { mutate: createBlog, isPending: isCreating } = useCreateBlog()
  const { mutate: updateBlog, isPending: isUpdating } = useUpdateBlog()

  const categories = Array.isArray(categoriesData)
    ? (categoriesData as BlogCategory[])
    : (categoriesData as { data: BlogCategory[] })?.data || []

  const isPending = isCreating || isUpdating

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: '',
      categoryId: '',
      thumbnailUrl: '',
      content: '',
      status: 'DRAFT',
    },
  })

  useEffect(() => {
    if (initialData) {
      // Determine the correct category ID from available fields
      const categoryId =
        initialData.categoryId || initialData.category?.id || ''

      form.reset({
        title: initialData.title,
        categoryId,
        thumbnailUrl: initialData.thumbnailUrl || '',
        content: initialData.content,
        status: initialData.status,
      })
    }
  }, [initialData, form])

  const onSubmit = (values: BlogFormValues) => {
    if (initialData) {
      updateBlog(
        { id: initialData.id, data: values },
        {
          onSuccess: () => navigate({ to: '/blogs/list' }),
        }
      )
    } else {
      const { status, ...createData } = values
      createBlog(createData, {
        onSuccess: () => navigate({ to: '/blogs/list' }),
      })
    }
  }

  // Helper to determine what to show in the SelectValue
  const getSelectedCategoryName = (currentValue: string) => {
    // 1. Try to find in the loaded categories list
    const found = categories.find((c) => c.id === currentValue)
    if (found) return found.name

    // 2. If valid initialData matches current value, use initialData name
    const initialId = initialData?.categoryId || initialData?.category?.id
    if (initialId && initialId === currentValue) {
      return initialData?.category?.name
    }

    // 3. Fallback
    return 'Select a category'
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-4'>
        <h1 className='text-2xl font-bold tracking-tight'>
          {initialData ? 'Edit Blog Post' : 'Create Blog Post'}
        </h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <div className='grid gap-6 md:grid-cols-2'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder='Blog title' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='categoryId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    // Removed disabled={isLoadingCategories} to allow interaction/visibility
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a category'>
                          {field.value
                            ? getSelectedCategoryName(field.value)
                            : 'Select a category'}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name='thumbnailUrl'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thumbnail (Optional)</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {initialData && (
            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select status' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='DRAFT'>Draft</SelectItem>
                      <SelectItem value='PUBLISHED'>Published</SelectItem>
                      <SelectItem value='ARCHIVED'>Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name='content'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    className='h-[75vh]'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex justify-end gap-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => navigate({ to: '/blogs/list' })}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isPending}>
              {isPending ? 'Saving...' : 'Save Blog Post'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

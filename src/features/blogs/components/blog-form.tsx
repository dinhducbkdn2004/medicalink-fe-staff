import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import type { Blog, BlogCategory } from '@/api/services/blog.service'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
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
import { RichTextEditor } from '@/features/doctors/components/rich-text-editor'
import { useBlogCategories } from '../data/use-blog-categories'
import {
  useCreateBlog,
  useUpdateBlog,
  useUpdateBlogAsDoctor,
} from '../data/use-blogs'

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
  const { accessToken, user } = useAuthStore()
  const { data: categoriesData } = useBlogCategories({ limit: 100 })
  const { mutate: createBlog, isPending: isCreating } = useCreateBlog()
  const { mutate: updateBlog, isPending: isUpdating } = useUpdateBlog()
  const { mutate: updateBlogAsDoctor, isPending: isUpdatingAsDoctor } =
    useUpdateBlogAsDoctor()

  const categories = Array.isArray(categoriesData)
    ? (categoriesData as BlogCategory[])
    : (categoriesData as { data: BlogCategory[] })?.data || []

  const isDoctor = user?.role === 'DOCTOR'
  const isPending = isCreating || isUpdating || isUpdatingAsDoctor

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
    if (initialData && categories.length > 0) {
      
      const categoryId =
        initialData.categoryId || initialData.category?.id || ''

      form.reset({
        title: initialData.title,
        categoryId,
        thumbnailUrl: initialData.thumbnailUrl || '',
        content: initialData.content,
        status: initialData.status || 'DRAFT',
      })
    }
  }, [initialData, categories.length, form])

  const onSubmit = (values: BlogFormValues) => {
    if (initialData) {
      
      if (isDoctor) {
        
        const doctorData = {
          title: values.title,
          content: values.content,
        }
        updateBlogAsDoctor(
          { id: initialData.id, data: doctorData },
          {
            onSuccess: () => navigate({ to: '/blogs/list' }),
          }
        )
      } else {
        updateBlog(
          { id: initialData.id, data: values },
          {
            onSuccess: () => navigate({ to: '/blogs/list' }),
          }
        )
      }
    } else {
      const { status, ...createData } = values
      createBlog(createData, {
        onSuccess: () => navigate({ to: '/blogs/list' }),
      })
    }
  }

  return (
    <div className='relative pb-24'>
      {}
      <div className='mb-6 flex items-center justify-between'>
        <h1 className='text-2xl font-bold tracking-tight'>
          {initialData ? 'Edit Blog Post' : 'Create Blog Post'}
        </h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          {}
          <div className='bg-card rounded-lg border p-6 shadow-sm'>
            <h2 className='mb-4 text-lg font-semibold'>Basic Information</h2>

            <div className='grid gap-6 lg:grid-cols-3'>
              {}
              <div className='space-y-4 lg:col-span-2'>
                {}
                <FormField
                  control={form.control}
                  name='title'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Enter blog title...'
                          className='text-base'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {}
                <div className='grid gap-4 sm:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='categoryId'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          key={`category-${field.value}`}
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select category' />
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

                  {}
                  {initialData && !isDoctor && (
                    <FormField
                      control={form.control}
                      name='status'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            key={`status-${field.value}`}
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger
                                className={cn(
                                  'w-[120px] text-xs font-medium',
                                  field.value === 'PUBLISHED' &&
                                    'bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-900/30 dark:text-green-400',
                                  field.value === 'ARCHIVED' &&
                                    'bg-red-100 text-red-800 hover:bg-red-100/80 dark:bg-red-900/30 dark:text-red-400',
                                  field.value === 'DRAFT' &&
                                    'bg-gray-100 text-gray-800 hover:bg-gray-100/80 dark:bg-gray-800 dark:text-gray-300'
                                )}
                              >
                                <SelectValue placeholder='Select status' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value='DRAFT'>DRAFT</SelectItem>
                              <SelectItem value='PUBLISHED'>
                                PUBLISHED
                              </SelectItem>
                              <SelectItem value='ARCHIVED'>ARCHIVED</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>

              {}
              <div className='lg:col-span-1'>
                <FormField
                  control={form.control}
                  name='thumbnailUrl'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thumbnail</FormLabel>
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
              </div>
            </div>
          </div>

          {}
          <div className='bg-card rounded-lg border p-6 shadow-sm'>
            <h2 className='mb-4 text-lg font-semibold'>Content</h2>
            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                      accessToken={accessToken || ''}
                      placeholder='Write your blog content here...'
                      toolbarOptions='full'
                      enableImageUpload={true}
                      enableVideoUpload={true}
                      enableSyntax={true}
                      enableFormula={true}
                      size='large'
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {}
          <div className='bg-background/95 supports-backdrop-filter:bg-background/60 fixed inset-x-0 bottom-0 z-50 border-t backdrop-blur'>
            <div className='container flex h-16 items-center justify-between'>
              <div className='text-muted-foreground text-sm'>
                {isPending ? 'Saving changes...' : 'All changes are autosaved'}
              </div>
              <div className='flex gap-3'>
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
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

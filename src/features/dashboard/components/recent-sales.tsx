import { useRevenueByDoctorStats } from '@/hooks/use-stats'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function RecentSales() {
  const { data: topDoctors } = useRevenueByDoctorStats()

  return (
    <div className='space-y-6'>
      {topDoctors?.map((item) => (
        <div key={item.doctorId} className='flex items-center gap-4'>
          <Avatar className='h-9 w-9'>
            <AvatarImage
              src={item.doctor?.avatarUrl}
              alt={item.doctor?.fullName || 'Unknown'}
            />
            <AvatarFallback>
              {item.doctor?.fullName?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-1 flex-wrap items-center justify-between'>
            <div className='space-y-1'>
              <p className='text-sm leading-none font-medium'>
                {item.doctor?.fullName || 'Bác sĩ đã xóa'}
              </p>
              <p className='text-muted-foreground text-sm'>
                {item.doctor?.isActive ? 'Hoạt động' : 'Ngừng hoạt động'}
              </p>
            </div>
            <div className='font-medium'>
              {item.total.VND
                ? new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(item.total.VND)
                : item.total['$']
                  ? new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(item.total['$'])
                  : '0 ₫'}
            </div>
          </div>
        </div>
      ))}
      {(!topDoctors || topDoctors.length === 0) && (
        <div className='flex h-full min-h-[100px] flex-col items-center justify-center text-center'>
          <p className='text-muted-foreground text-sm'>
            Không có dữ liệu doanh thu của bác sĩ trong tháng này.
          </p>
        </div>
      )}
    </div>
  )
}

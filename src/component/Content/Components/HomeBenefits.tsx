import { Headphones, RefreshCcw, ShieldCheck, Truck, WalletCards } from 'lucide-react'

const benefits = [
      { icon: Truck, title: 'Freeship toàn quốc', sub: 'Nhiều ưu đãi vận chuyển' },
      { icon: ShieldCheck, title: 'Hàng chính hãng', sub: 'Cam kết chất lượng' },
      { icon: RefreshCcw, title: 'Đổi trả dễ dàng', sub: 'Hỗ trợ theo chính sách' },
      { icon: WalletCards, title: 'Thanh toán đa dạng', sub: 'Nhiều phương thức' },
      { icon: Headphones, title: 'Hỗ trợ nhanh chóng', sub: 'Sẵn sàng khi bạn cần' },
]

const HomeBenefits = () => {
      return (
            <section className='grid grid-cols-2 overflow-hidden rounded-2xl border border-[var(--border-color-input)] bg-color-section-theme text-text-theme shadow-sm sm:grid-cols-3 xl:grid-cols-5'>
                  {benefits.map(({ icon: Icon, title, sub }, index) => (
                        <div key={title} className={`flex min-h-[88px] items-center gap-3 px-4 py-4 ${index ? 'xl:border-l xl:border-[var(--border-color-input)]' : ''}`}>
                              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10'>
                                    <Icon size={20} />
                              </div>
                              <div className='min-w-0'>
                                    <p className='text-[13px] font-semibold'>{title}</p>
                                    <p className='mt-1 text-[11px] text-slate-500 dark:text-slate-400'>{sub}</p>
                              </div>
                        </div>
                  ))}
            </section>
      )
}

export default HomeBenefits

import React from 'react'
import { ArrowRight } from 'lucide-react'

type AccountProtectionCardProps = {
  onActivate?: () => void
  imageSrc?: string
}

export default function AccountProtectionCard({
  onActivate,
  imageSrc = '/images/security-shield.png',
}: AccountProtectionCardProps) {
  return (
    <section className="relative isolate w-full max-w-[390px] overflow-hidden rounded-[20px] border border-blue-100/70 bg-gradient-to-br from-[#f8fbff] via-[#f1f6ff] to-[#e9f1ff] p-5 shadow-[0_10px_30px_rgba(37,99,235,0.08)]">
      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-10 h-36 w-36 rounded-full bg-white/80 blur-2xl" />

      <div className="relative z-10 flex min-h-[158px] items-center gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-[18px] font-bold leading-6 text-slate-900">
            Bảo vệ tài khoản của bạn
          </h3>

          <p className="mt-2 max-w-[220px] text-[14px] leading-6 text-slate-600">
            Kích hoạt xác thực 2 lớp để tăng cường bảo mật cho tài khoản.
          </p>

          <button
            type="button"
            onClick={onActivate}
            className="group mt-4 inline-flex h-42 items-center gap-3 rounded-xl border border-blue-300 bg-white/70 px-4 py-2.5 text-[14px] font-semibold text-blue-600 shadow-sm backdrop-blur transition hover:border-blue-500 hover:bg-white hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-100"
          >
            Kích hoạt ngay
            <ArrowRight
              size={17}
              strokeWidth={2.2}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>

        <div className="relative flex w-[125px] shrink-0 items-center justify-center self-stretch">
          <span className="absolute left-1 top-8 h-1.5 w-1.5 rotate-45 rounded-[1px] bg-blue-300" />
          <span className="absolute right-1 top-4 text-xl text-amber-400">✦</span>
          <span className="absolute right-4 top-11 h-1.5 w-1.5 rotate-45 rounded-[1px] bg-blue-300" />

          <img
            src={imageSrc}
            alt="Bảo mật tài khoản"
            className="relative z-10 w-[120px] select-none object-contain drop-shadow-[0_12px_15px_rgba(37,99,235,0.16)]"
            draggable={false}
          />
        </div>
      </div>
    </section>
  )
}

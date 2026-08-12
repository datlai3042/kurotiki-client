import { useState } from 'react'
import { Mail, Copy, Check, Terminal } from 'lucide-react'

export default function DatDeveloper() {
      const [copied, setCopied] = useState(false)
      const email = 'datlai304@gmail.com'

      const handleCopy = () => {
            navigator.clipboard.writeText(email).catch(() => {})
            setCopied(true)
            setTimeout(() => setCopied(false), 1800)
      }

      return (
            <div className='w-full h-full flex  justify-center  bg-[#0d1117] rounded-md'>
                  <div
                        className='relative w-full max-w-md rounded-xl border border-[#21262d] bg-[#0d1117] overflow-hidden shadow-[0_0_0_1px_rgba(247,223,30,0.05)]'
                        style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
                  >
                        {/* fake title bar */}
                        <div className='flex items-center gap-2 px-4 py-2.5 bg-[#161b22] border-b border-[#21262d]'>
                              <span className='w-2.5 h-2.5 rounded-full bg-[#ff5f56]' />
                              <span className='w-2.5 h-2.5 rounded-full bg-[#ffbd2e]' />
                              <span className='w-2.5 h-2.5 rounded-full bg-[#27c93f]' />
                              <span className='ml-2 text-[11px] text-[#6e7681] tracking-wide'>author.jsx</span>
                        </div>

                        <div className='px-6 py-7'>
                              {/* avatar + name row */}
                              <div className='flex items-center gap-4'>
                                    <div className='relative shrink-0'>
                                          <div className='w-14 h-14 rounded-full bg-gradient-to-br from-[#F7DF1E] to-[#e0b800] flex items-center justify-center text-[#0d1117] text-xl font-bold'>
                                                Đ
                                          </div>
                                          <span className='absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#27c93f] border-2 border-[#0d1117]' />
                                    </div>
                                    <div className='min-w-0'>
                                          <p className='text-[#e6edf3] font-semibold text-base leading-tight'>Đạt JS Dev</p>
                                          <p className='text-[#7d8590] text-xs mt-1'>Fullstack Developer</p>
                                    </div>
                              </div>

                              {/* terminal-style intro line */}
                              <div className='mt-5 flex items-start gap-2 text-[13px] leading-relaxed'>
                                    <Terminal size={14} className='text-[#F7DF1E] mt-[3px] shrink-0' />
                                    <p className='text-[#8b949e]'>
                                          <span className='text-[#F7DF1E]'>$</span> website này được phát triển bởi{' '}
                                          <span className='text-[#e6edf3] font-medium'>Đạt Javascript Dev</span>
                                          <span className='inline-block w-[7px] h-[14px] bg-[#F7DF1E] align-middle ml-1 animate-pulse' />
                                    </p>
                              </div>

                              {/* divider */}
                              <div className='my-5 h-px bg-[#21262d]' />

                              {/* email row */}
                              <button
                                    onClick={handleCopy}
                                    className='w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg bg-[#161b22] border border-[#21262d] hover:border-[#F7DF1E]/40 transition-colors group'
                              >
                                    <span className='flex items-center gap-2.5 min-w-0'>
                                          <Mail size={15} className='text-[#7d8590] shrink-0' />
                                          <span className='text-[#c9d1d9] text-[13px] truncate'>{email}</span>
                                    </span>
                                    <span className='shrink-0 text-[#7d8590] group-hover:text-[#F7DF1E] transition-colors'>
                                          {copied ? <Check size={15} className='text-[#27c93f]' /> : <Copy size={15} />}
                                    </span>
                              </button>

                              {copied && <p className='mt-2 text-[11px] text-[#27c93f]'>Đã sao chép email vào bộ nhớ tạm</p>}
                        </div>
                  </div>
            </div>
      )
}

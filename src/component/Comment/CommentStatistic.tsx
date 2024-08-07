import { Rate } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { DetailComment } from '../../apis/product.api'

type TProps = {
      avg: number
      totalComment: number
      detailComment: DetailComment
}

const CommentStatistic = (props: TProps) => {
      const { avg, totalComment, detailComment } = props
      const lineRef = useRef<HTMLDivElement>(null)
      const [width, setWidth] = useState<number>(0)

      useEffect(() => {
            if (lineRef.current) {
                  const width = lineRef.current.getBoundingClientRect().width
                  setWidth(width)
            }
      }, [avg, totalComment, detailComment])
      //console.log(([^)]+))

      return (
            <div className='w-[300px] h-max flex items-center py-[16px] px-[20px]'>
                  <div className='w-full min-h-[100px] h-max flex flex-col gap-[20px]'>
                        <div className=''>
                              <span className='text-[15px] text-slate-800 font-extrabold'>Khách hàng đánh giá</span>
                        </div>
                        <div className=''>
                              <span className='text-[14px] text-slate-700 font-semibold'>Tổng quan</span>
                        </div>
                        <div className='w-full min-h-[70px] h-max flex flex-col gap-[2px] '>
                              <div className='flex items-center gap-[8px] flex-1'>
                                    <span className='text-[28px] text-slate-900 font-semibold'>{avg.toFixed(1)}</span>
                                    <Rate disabled allowHalf value={avg} className='' />
                              </div>
                              <div className='h-max text-[16px] text-slate-500'>({totalComment} đánh giá)</div>
                        </div>
                        <div className='w-full min-h-[60px] h-max flex flex-col gap-[6px]'>
                              {detailComment.map((comment) => (
                                    <div className='w-full flex items-center gap-[16px]' key={comment._id}>
                                          <Rate disabled defaultValue={comment._id} className='text-[10px] xl:text-[12px]' />
                                          <div className='w-[30%] xl:w-[50%] h-[10px] rounded-lg bg-[rgb(245_245_250)] ' ref={lineRef}>
                                                <div
                                                      style={{ width: (width / totalComment) * comment.comment_count }}
                                                      className=' h-[10px] rounded-lg bg-blue-600'
                                                ></div>
                                          </div>
                                          <span>{comment.comment_count}</span>
                                    </div>
                              ))}
                        </div>
                  </div>
            </div>
      )
}

export default CommentStatistic

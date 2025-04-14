import { Comment } from '../../types/comment.type'
import { Rate } from 'antd'
import { convertDateToStringFull } from '../../utils/date.utils'
import { Link } from 'react-router-dom'

type TProps = {
      comment: Comment
}

const OrderCommentItem = (props: TProps) => {
      const { comment } = props

      return (
            <Link to={`/product/${comment.comment_product_id._id}#comment_me`} className=' w-full h-[600px] xl:min-h-[200px] xl:h-max  '>
                  <div className='w-[calc(100%+60px)] h-[1px] ml-[-30px] my-[16px] bg-slate-100 '></div>
                  <div className=' w-full h-[40%] xl:h-full flex flex-col xl:flex-row items-center gap-[20px] xl:gap-[30px]'>
                        <div className='w-full xl:w-[40%] h-full p-[10px] xl:p-[20px] flex flex-col gap-[20px]    '>
                              <img
                                    src={comment.comment_product_id.product_thumb_image.secure_url}
                                    alt='comment'
                                    className=' w-[200px] border-[1px] object-contain  border-[var(--border-color-input)] rounded p-[8px] border-[1px] border-slate-700'
                              />
                              <div style={{lineHeight: 1.6}} className='min-w-[150px] w-[200px] xl:w-[300px] h-[30px] break-words '>
                                    Sản phẩm: {comment.comment_product_id.product_name}
                              </div>
                        </div>
                        <div className='w-full xl:w-[50%] h-full p-[10px] xl:p-[20px] flex flex-col gap-[20px] '>
                              <div className='w-full h-[80px] flex gap-[16px] '>
                                    <img
                                          src={comment.comment_user_id.avatar?.secure_url || comment.comment_user_id.avatar_url_default}
                                          className='w-[80px] h-[80px] rounded-full bg-gray-400'
                                          alt='comment'
                                    />
                                    <div className='w-[40%] xl:w-[70%] flex flex-col justify-center gap-[8px] '>
                                          <p className='h-[36%] w-full'>
                                                {comment.comment_user_id.fullName ||
                                                      comment.comment_user_id.nickName ||
                                                      comment.comment_user_id.email ||
                                                      ''}
                                          </p>
                                          <div className='h-[36%] w-full '>
                                                <Rate allowHalf disabled defaultValue={comment.comment_vote} />
                                          </div>
                                    </div>
                              </div>
                              <div className=' min-h-[10px] h-max w-full '>Nội dung: {comment.comment_content}</div>
                              <img src={comment.comment_image[0]?.secure_url} className='w-[100px] h-[100px]  bg-gray-400' alt='comment' />
                              <p className='w-full h-[20px] '>Thời gian: {convertDateToStringFull(comment.comment_date)}</p>
                        </div>
                  </div>
            </Link>
      )
}

export default OrderCommentItem

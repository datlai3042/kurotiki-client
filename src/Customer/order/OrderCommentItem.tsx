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
                  <div className=' w-full h-[40%] xl:h-full flex flex-col xl:flex-row gap-[20px] xl:gap-[30px]'>
                        <div className='w-full xl:w-[20%] h-full p-[10px] xl:p-[20px] flex flex-col gap-[20px]    '>
                              <img
                                    src={comment.comment_product_id.product_thumb_image.secure_url}
                                    alt='comment'
                                    className=' w-[200px]object-contain  rounded p-[8px]'
                              />
                        </div>
                        <div className='w-full xl:w-[50%] h-full p-[10px] xl:p-[20px] flex flex-col gap-[8px] '>
                              <div style={{ lineHeight: 1.6 }} className='min-w-[150px] w-[200px] xl:w-[300px]  break-words '>
                                    Sản phẩm: {comment.comment_product_id.product_name}
                              </div>
                             

                               <div className='h-[36%] w-full '>
                                                <Rate allowHalf disabled defaultValue={comment.comment_vote} />
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

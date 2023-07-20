import React, { Fragment, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import style from './buy.module.css'
import { checkLabel, checkVote, getPriceAndPromote } from './HandleData'
import Rating from '@mui/material/Rating'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import Location from '../../../Main/localtion/Location'
// import Shipper from './Shipper/Shipper'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getProduct } from '../../../../apis/getProduct'
import Shipper from './Shipper/Shipper'
import ButtonQualityProducts from './Button/ButtonQuantityProducts'
import { useDispatch, useSelector } from 'react-redux'
import { cartSlice } from '../../../../Redux/reducer'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import GoiYHomNay from '../GoiYHomNay/GoiYHomNay'
import DanhSachSanPham from '../DanhSachSanPham/DanhSachSanPham'
import MoTaSanPham from './MoTaSanPham'

let productInitial = {
  name: '',
  ship: '',
  isPrice: 0,
  isPricePromote: 0,
  quantity: 0,
  bought: 0,
}

export default function Buy() {
  const { id } = useParams()
  const [product, setProduct] = useState(productInitial)
  const [quantity, setQuantity] = useState(1)
  const [ship, setShip] = useState('')
  const dispatch = useDispatch()
  const [btnTop, setBtnTop] = useState(0)
  const [btnBottom, setBtnBottom] = useState(0)
  const [wrapperTop, setWrapperTop] = useState(0)
  const [wrapperBottom, setWrapperBottom] = useState(0)
  const [hide, setHide] = useState(true)
  const list = useSelector((state) => state.cartList.cartList)
  const targetDIV = useRef(null)
  // console.log(list)

  const { data, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id),
  })
  let textGB, giveGB, valueOfGiveGB, checkNumberVoteGB, promoteGB

  useEffect(() => {
    if (!isLoading) {
      document.title = `Mua ${data.data[0].name}`
      const { text, give, valueOfGive } = checkLabel(data && data)
      let checkNumberVote = checkVote(data && data)
      let promote = getPriceAndPromote(data && data)
      textGB = text
      giveGB = give
      valueOfGiveGB = valueOfGive
      checkNumberVoteGB = checkNumberVote
      promoteGB = promote
      // console.log('useEffect')
      let math = Math.round(Number(Number(data.data[0]?.isPromote[1]?.promote) * -1))
      // console.log(math)
      setProduct((prev) => ({
        ...prev,
        id: data?.data[0].id,
        name: data?.data[0].name,
        image: data?.data[0].hinhAnh,
        bought: data?.data[0].isBought,
        promote: data?.data[0]?.isPromote[1]?.promote ? data?.data[0]?.isPromote[1]?.promote : 0,
        isPrice: Number(data?.data[0].isPrice),
        quantity: quantity,
        check: false,
        methodShip: '',
        isPricePromote:
          Number(
            Number(
              data?.data[0].isPrice - (data?.data[0].isPrice / 100) * Number(data?.data[0]?.isPromote[1]?.promote) * -1,
            ),
          ) || 0,
      }))
    }
  }, [isLoading, quantity])

  const checkPromote = promoteGB !== undefined ? true : false

  //giá - (gia / 100) * promote
  let tile = product.promote ? product.promote * -1 : 1
  let giamGia = product.promote ? product?.isPrice - (product?.isPrice / 100) * tile : ''
  let image = product.image
  const handleQuantity = (quantity) => {
    // console.log(`số lượng sản phẩm mua:  ${quantity}`)
    // console.log('quantity', Number.isInteger(product.quantity))
    setQuantity(quantity)
    setProduct((prev) => ({
      ...prev,
      quantity: quantity,
    }))
  }

  const handleMethodShip = (nameShip) => {
    console.log(`Chọn phương thức giao hàng là: ${nameShip}`)
    setShip(nameShip)
    setProduct((prev) => ({
      ...prev,
      methodShip: nameShip,
    }))
  }

  useEffect(() => {
    if (btnTop - 165 < wrapperBottom) {
      console.log('Đã vượt qua')
      console.log('ẩn')

      setHide(false)
    } else {
      console.log('hiện')
      setHide(true)
    }
    console.log('hide: ', hide)
    console.log('  ')
    console.log('  ')
    console.log('  ')
  }, [btnTop, btnBottom, wrapperBottom, wrapperTop])

  const handleAddProduct = () => {
    // console.log('quantity', typeof product.quantity)
    // console.log('isPrice', typeof product.isPrice)

    // console.log(Number(product.isPrice) * Number(product.quantity))
    // alert(`Tên sản phẩm ${product.name} - ${product.isPrice} - ${product.quantity} -${giamGia}`)
    let productFinal = {
      id: product.id,
      name: product.name,
      image: image,
      isPrice: product.isPrice,
      quantity: product.quantity,
      isPriceWithPromote: giamGia,
      promote: product.promote !== 0 ? product.promote * -1 : 0,
      methodShip: product.methodShip,
      check: product.check,
    }
    console.log('Sẵn sàng dispatch')
    // dispatch(addProduct(productFinal))
    toast.success('Thêm vào giỏ hàng thành công', {
      autoClose: 1000,
    })
    console.log(productFinal)
    dispatch(cartSlice.actions.addProduct(productFinal))
  }

  const handlePositionButton = (posTop, posBottom) => {
    console.log(`tọa độ top btn / ${posTop}`)
    setBtnTop(posTop)
    setBtnBottom(posBottom)
  }

  const handlePositionDivSticky = (posBottom, posTop) => {
    console.log(`tọa độ top divSticky / ${posBottom}`)
    setBtnBottom(posBottom)
    setWrapperTop(posTop)
  }

  // const backToTop = (value) => {
  //   console.log(typeof value)
  //   if (value) {
  //     targetDIV.current.scrollIntoView({
  //       behavior: 'smooth',
  //       block: 'start',
  //     })
  //     console.log(`quay lại đầu trang ${value}`)
  //   }
  // }

  useEffect(() => {
    // Thực hiện cuộn lên đầu trang khi component được render
    // window.scrollTo(0, 0);

    // Hoặc có thể sử dụng cú pháp này:
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth', // Nếu muốn có hiệu ứng cuộn mượt
    })
  }, [])

  return (
    <div ref={targetDIV} name='target'>
      {isLoading && (
        <div className='absolute right-1/2 bottom-1/2  transform translate-x-1/2 translate-y-1/2 '>
          <div className='border-t-transparent border-solid animate-spin  rounded-full border-blue-400 border-8 h-60 w-60' />
        </div>
      )}
      {!isLoading && (
        <div className={style.buy} id='succes'>
          <div className={style.wrapperBuy}>
            <div className={style.pathTitle}>
              <Link to='/' className={style.back}>
                Trang chủ
              </Link>

              <ArrowForwardIosIcon className={style.icon} fontSize='12px'></ArrowForwardIosIcon>
              <span className={style.current} title={data.data[0]?.name}>
                {data.data[0]?.name}
              </span>
            </div>
            <div className={style.products}>
              <div className={style.productsImg}>
                <img src={require(`../DanhSachSanPham/${data.data[0].hinhAnh.slice(1)}`)} alt='' />
              </div>
              <div className={style.border_top}></div>
              <div className={style.productsInfo}>
                <div className={style.officalNameVoteBought}>
                  <div className={style.offical}>
                    {' '}
                    {textGB ? (
                      <span>
                        Thương hiệu
                        <span className={style.label}> {textGB}</span>
                      </span>
                    ) : (
                      ''
                    )}
                  </div>
                  <div className={style.name}>
                    <span className={style.nameStyle} title={data.data[0]?.name}>
                      {data.data[0]?.name}
                      {data.data[0].isVote[0].vote}
                    </span>
                  </div>
                  <div className={style.vote}>
                    {data.data[0].isVote[0].checkVote === true ? (
                      <Rating
                        className={style.rank}
                        size='small'
                        name='half-rating-read'
                        defaultValue={Number(data.data[0].isVote[1].vote)}
                        precision={0.5}
                        readOnly
                      />
                    ) : (
                      ''
                    )}
                    <p>{data.data[0].isVote[0].checkVote}</p>
                    <span
                      style={{ width: 1, height: 12, margin: '0 8px', backgroundColor: 'rgb(199, 199, 199)' }}
                    ></span>
                    <span className={checkNumberVoteGB ? style.bought : `${style.bought} ${style.boughtFix}`}>
                      {data.data[0].isBought > 0 ? `Đã bán ${data.data[0].isBought}` : ''}
                    </span>
                  </div>
                </div>
                <div className={style.products_down}>
                  <div className={style.products_down_wrapper}>
                    {/**Giá */}
                    <div className={style.pricePromoteGiveAstra}>
                      <div className={style.wrapperPriceAstra}>
                        <div
                          className={
                            checkPromote ? style.wrapperPrice : `${style.wrapperPrice} ${style.wrapperPriceFake}`
                          }
                        >
                          <span className={style.price}>{data.data[0]?.isPrice}</span>
                          <span className={style.vnd}>đ</span>
                          <span
                            className={style.priceReal}
                            style={{ color: 'red', textDecorationColor: 'red', fontWeight: '700', fontSize: '16' }}
                          >
                            {promoteGB === undefined
                              ? data.data[0]?.isPromote[1]?.promote
                                ? data.data[0]?.isPromote[1]?.promote + '%'
                                : ''
                              : ''}
                          </span>
                          <span>
                            {data.data[0].isPromote[0].checkPromote === false
                              ? ''
                              : data.data[0].isPrice -
                                (data.data[0].isPrice / 100) *
                                  Math.round(Number(Number(data.data[0].isPromote[1].promote) * -1)) +
                                ' đ'}
                          </span>
                        </div>
                        <div className={!checkPromote ? style.astra : `${style.astra} ${style.astraPromote}`}>
                          <img
                            src={require(`../DanhSachSanPham/img/desciption/iconAstra.png`)}
                            alt=''
                            width={13}
                            height={16}
                            className={style.astraHinhAnh}
                          />
                          <span>Thưởng</span>
                          <span>{giveGB} ASA </span>
                          <span>(≈ {valueOfGiveGB})</span>
                          <img
                            className={style.iconNew}
                            src={require(`../DanhSachSanPham/img/desciption/new.gif`)}
                            alt=''
                            width={42}
                            height={20}
                          />
                        </div>
                      </div>
                    </div>
                    <div className={style.border_down}></div>
                    <div className={style.location_wrapper}>
                      <span
                        style={{
                          marginRight: '3px',
                        }}
                      >
                        Giao đến
                      </span>
                      <Location />{' '}
                      <span
                        style={{
                          fontSize: '13px',
                          marginLeft: '3px',
                        }}
                      >
                        -
                      </span>
                      {'  '}
                      <div className={style.location_a}>
                        <Link
                          to={'/changeAddress'}
                          style={{
                            color: 'rgb(11, 116, 229)',
                            textDecoration: 'none',
                            fontWeight: '600',
                          }}
                        >
                          Đổi địa chỉ
                        </Link>
                      </div>
                    </div>
                    <div className={style.wrapperShipper}>
                      <Shipper getMethodShip={handleMethodShip} />
                    </div>
                    <div className={style.border_down}></div>
                    <div className={style.moneyFreeShip}>
                      <img
                        src={require('../DanhSachSanPham/img/desciption/iconLoa.png')}
                        width={18}
                        height={18}
                        alt=''
                      />
                      <p>
                        Bạn sẽ được Freeship 15.000 <span>đ</span>
                      </p>
                      <p>
                        cho đơn hàng từ 149000 <span>đ</span>
                      </p>
                    </div>
                    <div className={style.border_down}></div>
                    <ButtonQualityProducts getQuantity={handleQuantity} />
                    <div className='mt-6 mb-6'>
                      <button className='w-full mb-[60px] h-full'>
                        <a
                          href='#succes'
                          onClick={handleAddProduct}
                          className='flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700'
                        >
                          Mua
                        </a>
                      </button>
                    </div>
                  </div>

                  {/**Right */}
                  <div className={style.distributor}>
                    <div className={style.distributorInfo}>
                      <img
                        src={require('./logoTiki.webp')}
                        className='w-12 h-12'
                        style={{
                          borderRadius: '50%',
                        }}
                        alt=''
                      />
                      <div className={style.distributorText}>
                        <h1 className='text-slate-950	font-medium'>Tiki Trading</h1>
                        <img
                          src={require('../DanhSachSanPham/img/desciption/offical.png')}
                          className='w-13a h-4 rounded'
                          alt=''
                        />
                      </div>
                    </div>
                    <div className={style.distributorInfoNumber}>
                      <div className={style.distributorStartFollow}>
                        <div className={style.distributorStartText}>
                          <div>
                            <span className='text-slate-950	font-medium'>4.7 / </span>
                            <FontAwesomeIcon
                              icon={faStar}
                              style={{
                                color: '#fdd863',
                              }}
                            />
                          </div>
                          <span className='text-slate-950	font-medium'>478.4+</span>
                        </div>
                        <div className='flex px-8 justify-between text-xs text-slate-400'>
                          <span>{`5.4tr+`}</span>
                          <span>Theo dõi</span>
                        </div>
                      </div>
                    </div>
                    <div className='flex gap-2 h-8 justify-between'>
                      <button className='flex-1 border-2 border-soild border-sky-600 rounded-md'>
                        <div className='flex justify-center items-center flex-row'>
                          <img src={require('./iconHome.png')} className='w-5 h-5' alt='' />
                          <span className='text-sky-500 font-medium'>Xem shop</span>
                        </div>
                      </button>
                      <button className='flex-1  border-2 border-soild border-sky-600 rounded-md'>
                        <div className='flex justify-center items-center flex-row'>
                          <img src={require('./iconIncrease.png')} className='w-5 h-5' alt='' />
                          <span className='text-sky-500 font-medium'>Theo dõi</span>
                        </div>
                      </button>
                    </div>
                    <hr />
                    <div className='flex flex-1 gap-3 justify-between'>
                      <div className='flex flex-col gap-1 items-center justify-center'>
                        <img src={require('./check.png')} className='w-8 h-8' alt='' />
                        <p className='flex-1 text-sm  justify-center  break-words'>
                          Hoàn toàn <span className='text-slate-950'>111%</span> nếu là hàng giả
                        </p>
                      </div>
                      <div className='flex flex-col gap-1 items-center justify-center'>
                        <img src={require('./like.png')} className='w-8 h-8' alt='' />
                        <p className='flex-1 text-sm  justify-center  break-words'>Mở hộp kiểm tra nhận hàng</p>
                      </div>
                      <div className='flex flex-col gap-1 items-center justify-center'>
                        <img src={require('./return.png')} className='w-8 h-8' alt='' />
                        <p className='flex-1 text-sm justify-center   break-words'>
                          Đổi trả trong <span className='text-slate-950'>30 ngày</span> nếu sp lỗi
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <MoTaSanPham isLoading={isLoading} name={data?.data[0].name} />

      <div className={style.hideModuleDesktop}>
        <GoiYHomNay handlePositionDivSticky={handlePositionDivSticky} hide={hide} />
        <DanhSachSanPham handlePositionButton={handlePositionButton}/>
      </div>

      <ToastContainer />
    </div>
  )
}

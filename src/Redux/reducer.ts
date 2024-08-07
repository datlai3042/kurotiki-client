import { createSlice, current } from '@reduxjs/toolkit'

let initCart = {
      cartList: [],
      soLuong: 0,
      cartListPaid: [],
      tongTien: 0,
      isSelectAll: false,
}

export const cartSlice = createSlice({
      name: 'cartList',
      initialState: localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')!) : initCart,
      reducers: {
            addProduct: (state, action) => {
                  if (state.cartList.length === 0) {
                        state.cartList.push(action.payload)
                        state.soLuong += 1
                        // const cartSetLocalStorage = JSON.stringify(state)
                        // localStorage.setItem('cart', cartSetLocalStorage)
                        return
                  }

                  if (state.cartList.length !== 0) {
                        let find = state.cartList.findIndex((product: any) => {
                              if (product.id === action.payload.id) {
                                    // const cartSetLocalStorage = JSON.stringify(state)
                                    // localStorage.setItem('cart', cartSetLocalStorage)
                                    return (product.quantity += action.payload.quantity)
                              }
                        })
                        console.log(find)
                        if (find === -1) {
                              state.cartList.push(action.payload)
                              state.soLuong += 1
                        }
                  }
                  console.log(current(state))
            },
            deleteProduct: (state, action) => {
                  console.log('x')
                  let idSanPhamBiXoa = action.payload
                  let indexSanPhamTrongCartList = state.cartList.findIndex((product: any) => product.id === idSanPhamBiXoa)
                  if (indexSanPhamTrongCartList !== -1) {
                        state.cartList.splice(indexSanPhamTrongCartList, 1)
                        let idProductCartPaid = state.cartListPaid.findIndex((product: any) => product.id === idSanPhamBiXoa)
                        if (idProductCartPaid !== -1) {
                              state.cartListPaid.splice(idProductCartPaid, 1)
                        }
                        state.soLuong -= 1
                        // const cartSetLocalStorage = JSON.stringify(state)
                        // localStorage.setItem('cart', cartSetLocalStorage)
                  }
            },

            increaseProduct: (state, action) => {
                  let idSanPham = state.cartList.findIndex((product: any) => product.id === action.payload)
                  if (idSanPham !== -1) {
                        state.cartList[idSanPham].quantity += 1
                  }
                  // const cartSetLocalStorage = JSON.stringify(state)
                  // localStorage.setItem('cart', cartSetLocalStorage)
            },
            decreaseProduct: (state, action) => {
                  let idSanPham = state.cartList.findIndex((product: any) => product.id === action.payload)
                  console.log(idSanPham)
                  if (idSanPham !== -1) {
                        if (state.cartList[idSanPham].quantity > 1) {
                              state.cartList[idSanPham].quantity -= 1
                              console.log('a', state.cartList[idSanPham].quantity)
                        }
                  }
                  // const cartSetLocalStorage = JSON.stringify(state)
                  // localStorage.setItem('cart', cartSetLocalStorage)
            },

            addProductPair: (state, action) => {
                  // tìm id thay đổi checkbox

                  //Trời ơi Đạt tui mất gần 1 tiếng cho cái công thức này
                  // đầu tiên là lấy lọc lấy index phần tử trong mảng cartList[] nhá
                  // làm vậy để checkbox thay đổi true, false còn cập nhập theo được kkk
                  let indexCart = state.cartList.findIndex((product: any) => product.id === action.payload.productObj.id)
                  // sửa lại phần tử index có giá trị check mới tinh mà action.payload truyền vào nè
                  state.cartList[indexCart].check = action.payload.productObj.check

                  state.cartListPaid = state.cartList.filter((product: any) => product.check === true)
                  //   if (state.cartList[indexCart].check) {
                  //     if (state.cartListPaid.length === 0) {
                  //       state.cartListPaid.push(action.payload.productObj)
                  //     } else {
                  //       if (checkListPaid !== -1) {
                  //         state.cartListPaid.push(action.payload.productObj)
                  //       } else {
                  //         const cartSetLocalStorage = JSON.stringify(state)
                  //         localStorage.setItem('cart', cartSetLocalStorage)
                  //         return
                  //       }
                  //     }
                  //   }
                  //   if(!state.cartList[indexCart].check) {
                  //     state.cartListPaid.splice(checkListPaid,1)
                  //   }
                  // }

                  // const cartSetLocalStorage = JSON.stringify(state)
                  // localStorage.setItem('cart', cartSetLocalStorage)
            },
            actionPaid: (state, action) => {
                  console.log(action.payload)
                  state.cartList = state.cartList.filter((product: any) => {
                        if (!product.check) {
                              return true
                        }
                        state.soLuong -= 1
                        return false
                  })

                  // const cartSetLocalStorage = JSON.stringify(state)
                  // localStorage.setItem('cart', cartSetLocalStorage)
            },
            doIsSelectAll: (state, action) => {
                  console.log('alo', action.payload)
                  if (action.payload) {
                        state.cartList.forEach((product: any) => {
                              console.log(current(product))
                              product.check = true
                        })
                  }
                  if (action.payload === false) {
                        state.cartList.forEach((product: any) => {
                              product.check = false
                        })
                  }
                  // const cartSetLocalStorage = JSON.stringify(state)
                  // localStorage.setItem('cart', cartSetLocalStorage)
            },

            clearCart: (state) => {
                  state.cartList = []
                  state.soLuong = 0
            },
      },
})

export const { addProduct, deleteProduct, increaseProduct, decreaseProduct, addProductPair, actionPaid, doIsSelectAll, clearCart } =
      cartSlice.actions
export default cartSlice.reducer

// import { createReducer } from "@reduxjs/toolkit";
// import { createAction } from "@reduxjs/toolkit";

// export const add = createAction('product/add')

// export const cart = createReducer([], (builder) => {
//   builder.addCase(add, (state,action) => {
//     state.push(action.payload)
//   })

//   builder.addDefaultCase((state,action) => {
//     console.log('default')
//     state.push(10)
//   })
// })

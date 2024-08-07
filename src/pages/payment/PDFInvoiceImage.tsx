import { Document, Font, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import React from 'react'
import { CartProduct } from '../../types/cart.type'
import { convertDateToStringFull } from '../../utils/date.utils'

import Roboto from './Fonts/Roboto-Medium.ttf'
import { renderStringAddressDetailV2 } from '../../utils/address.util'

type TProps = {
      products: CartProduct[]
      orderTotal: number
      orderTime: Date
}

export const PDFInvoiceImage = (props: TProps) => {
      const { orderTime, orderTotal, products } = props

      Font.register({ family: 'Poppins', src: Roboto })

      const styles = StyleSheet.create({
            main: {
                  width: 600,
                  margin: '0 auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 40,
                  minHeight: 300,
                  height: 'max-content',
                  padding: '30px',
                  fontFamily: 'Poppins',
                  border: '1px solid #000000',
                  fontSize: 18,
            },
            header: { display: 'flex', width: '100%', flexDirection: 'column', gap: 16, alignItems: 'center' },
            body: { width: '100%', display: 'flex', flexDirection: 'column', gap: 32, fontSize: 12, padding: '0px 24px' },
            bodyItem: {
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  justifyContent: 'space-between',
                  // alignItems: 'center',
                  gap: 16,
            },
            footer: { width: '100%', textAlign: 'right', fontSize: 20, display: 'flex', gap: '6px', paddingLeft: 12 },
      })

      return (
            <Document>
                  <Page size={'A4'} style={styles.main}>
                        <View style={styles.header}>
                              <Text style={{ fontSize: 18 }}>Thông tin hóa đơn</Text>
                              <Text style={{ fontSize: 13 }}>Ngày xuất hóa đơn: {convertDateToStringFull(orderTime)}</Text>
                        </View>

                        <View style={styles.body}>
                              {products.map((product, index) => (
                                    <View key={product.product_id._id} style={styles.bodyItem}>
                                          <Text>Tên cửa hàng: {product.shop_id.shop_name}</Text>
                                          <View
                                                style={{
                                                      display: 'flex',
                                                      flexDirection: 'row',
                                                      gap: 8,
                                                      justifyContent: 'space-between',
                                                }}
                                          >
                                                <Text>Tên sản phẩm: {product.product_id.product_name}</Text>
                                                <View
                                                      style={{
                                                            width: 15,
                                                            height: 15,
                                                            borderRadius: '50%',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            backgroundColor: '#000000',
                                                            color: '#ffffff',
                                                      }}
                                                >
                                                      <Text>{index + 1}</Text>
                                                </View>
                                          </View>

                                          <View
                                                style={{
                                                      display: 'flex',
                                                      flexDirection: 'row',
                                                      gap: 8,
                                                      justifyContent: 'space-between',
                                                }}
                                          >
                                                <Text>Giá: {product.quantity}</Text>
                                                <Text>Số lượng: {product.quantity}</Text>
                                                <Text style={{ textAlign: 'right' }}>
                                                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                                                            .format(product.product_id.product_price * product.quantity)
                                                            .replace('₫', '')}
                                                </Text>
                                          </View>

                                          <View
                                                style={{
                                                      display: 'flex',
                                                      flexDirection: 'row',
                                                      gap: 8,
                                                      justifyContent: 'space-between',
                                                }}
                                          >
                                                <Text>Địa chỉ nhận hàng: {renderStringAddressDetailV2(product.cart_address)}</Text>
                                          </View>

                                          <Text style={{ width: '100%', height: 1, backgroundColor: 'gray', opacity: 0.5 }}></Text>
                                    </View>
                              ))}
                        </View>
                        <View style={styles.footer}>
                              <Text>Tổng tiền của hóa đơn:</Text>
                              <Text>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                                          .format(orderTotal)
                                          .replace('₫', '')}
                              </Text>
                        </View>
                  </Page>
            </Document>
      )
}

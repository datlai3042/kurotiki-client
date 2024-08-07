import { Document, Font, PDFViewer, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
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

export const PDFInvoice = (props: TProps) => {
      const { orderTime, orderTotal, products } = props

      Font.register({ family: 'Poppins', src: Roboto })

      const styles = StyleSheet.create({
            main: {
                  width: 600,
                  margin: '0 auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 30,
                  minHeight: 300,
                  height: 'max-content',
                  padding: '30px',
                  fontFamily: 'Poppins',
                  border: '1px solid #000000',
            },
            header: { display: 'flex', width: '100%', flexDirection: 'column', gap: 16, alignItems: 'center' },
            body: { width: '100%', display: 'flex', flexDirection: 'column', gap: 24, marginTop: 24 },
            bodyItem: {
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  justifyContent: 'space-between',
                  // alignItems: 'center',
                  gap: 24,
            },
            footer: { width: '100%', textAlign: 'right', fontSize: '24px' },
      })


      console.log({products})

      return (
            <PDFViewer showToolbar={false} width={600} height={700}>
                  <Document>
                        <Page size={'A4'} style={styles.main}>
                              <View style={styles.header}>
                                    <Text style={{ fontSize: 18 }}>Thông tin hóa đơn</Text>
                                    <Text style={{ fontSize: 13 }}>Ngày xuất hóa đơn: {convertDateToStringFull(orderTime)}</Text>
                              </View>

                              <View style={styles.body}>
                                    {products.map((product) => (
                                          <View key={product.product_id._id} style={styles.bodyItem}>
                                                <View
                                                      style={{
                                                            display: 'flex',
                                                            flexDirection: 'row',
                                                            gap: 8,
                                                            justifyContent: 'space-between',
                                                      }}
                                                >
                                                      <Text>Tên sản phẩm: {product.product_id.product_name}</Text>
                                                      <Text>Tên cửa hàng: {product.shop_id.shop_name}</Text>
                                                </View>

                                                <View
                                                      style={{
                                                            display: 'flex',
                                                            flexDirection: 'row',
                                                            gap: 8,
                                                            justifyContent: 'space-between',
                                                      }}
                                                >
                                                      <Text>Giá: {product.product_id.product_price}</Text>
                                                      <Text>Số lượng: {product.quantity}</Text>
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
                                                <Text style={{ textAlign: 'right' }}>
                                                      Thành tiền: {product.product_id.product_price * product.quantity}
                                                </Text>
                                                <Text style={{ width: '100%', height: 1, backgroundColor: 'gray', opacity: 0.5 }}></Text>
                                          </View>
                                    ))}
                              </View>
                              <Text style={styles.footer}>Tổng tiền: {orderTotal}</Text>
                        </Page>
                  </Document>
            </PDFViewer>
      )
}

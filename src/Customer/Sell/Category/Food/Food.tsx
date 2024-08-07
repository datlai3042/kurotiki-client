import { Select } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { Controller, useFormContext } from 'react-hook-form'
import { ProductFoodType } from '../../../../types/product/product.food.type'
import InputText from '../../components/InputText'

const optionSelect: { label: string; value: ProductFoodType }[] = [
      {
            label: 'Thức ăn nhanh',
            value: 'Fast food',
      },
      {
            label: 'Đồ đóng hộp',
            value: 'Canned Goods',
      },
      {
            label: 'Nước uống giải khát',
            value: 'Drinks',
      },
]

const optionSelectUnit: { label: string; value: 'Kilogram' | 'Box' }[] = [
      {
            label: 'Kilogram',
            value: 'Kilogram',
      },
      {
            label: 'Hộp / thùng',
            value: 'Box',
      },
]

const Food = () => {
      const form = useFormContext()
      const errors = form.formState.errors
      return (
            <div className='flex flex-col gap-[16px]'>
                  <InputText
                        FieldName={'attribute.product_food_Manufacturers_Name'}
                        LabelMessage='Tên xưởng sản xuất'
                        placehorder='Nhập xưởng sản xuất'
                  />
                  <InputText
                        FieldName={'attribute.product_food_origin'}
                        LabelMessage='Nguồn gốc / xuất xứ'
                        placehorder='Nguồn gốc / xuất sứ'
                  />

                  <Controller
                        name={'attribute.type'}
                        control={form.control}
                        render={({ field }) => {
                              return <Select placeholder={'Chọn loại thực phẩm'} options={optionSelect} onChange={field.onChange} />
                        }}
                  />
                  <Controller
                        name={'attribute.product_food_unit'}
                        control={form.control}
                        render={({ field }) => {
                              return <Select placeholder={'Chọn đơn vị'} options={optionSelectUnit} onChange={field.onChange} />
                        }}
                  />
                  <Controller
                        name={'attribute.description'}
                        control={form.control}
                        render={({ field }) => <TextArea {...field} maxLength={10000} rows={80} />}
                  />

                  {errors?.attribute && (
                        <span className='text-red-700 text-[12px] w-[250px] '>{(errors.attribute as any)['description']?.message}</span>
                  )}
            </div>
      )
}

export default Food

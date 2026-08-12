import * as z from 'zod'

export const addressSchemaForm = z.object({
      address_receiver_name: z
            .string()
            .trim()
            .min(1, 'Tên người nhận là bắt buộc')
            .max(50, 'Tên người nhận tối đa 50 ký tự'),

      address_receiver_tel: z
            .string()
            .trim()
            .min(1, 'Số điện thoại người nhận là bắt buộc')
            .regex(
                  /^(0|\+84)[0-9]{9}$/,
                  'Số điện thoại không đúng định dạng',
            ),

      address_email_vat: z
            .string()
            .trim()
            .email('Email nhận VAT không đúng định dạng')
            .or(z.literal('')),

      // address_type: z.string().min(1),

      address_street: z
            .string()
            .trim()
            .min(1, 'Tên đường là bắt buộc'),

      address_ward: z
            .string()
            .min(1, 'Phường/xã là bắt buộc'),

      address_district: z
            .string()
            .min(1, 'Quận/huyện là bắt buộc'),

      address_province: z
            .string()
            .min(1, 'Tỉnh/Thành phố là bắt buộc'),
})

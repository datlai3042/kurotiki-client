export type Address = {
      address_street: string,
      address_receiver_name: string,
      address_receiver_tel: string,
      address_email_vat?: string,
      address_ward: {
            code: string
            text: string
      }
      address_district: {
            code: string
            text: string
      }
      address_province: {
            code: string
            text: string
      }
      address_text: string
      _id?:string
      type: 'Home' | 'Company' | 'Private'
}

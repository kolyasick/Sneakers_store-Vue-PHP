export interface IProductsStore {
   id: number
   title: string
   content: string
   description: string
   price: number
   oldPrice: number
   category_id: number
   img: string
   is_offer: number
   isAdded: boolean
   quantity: number
}

export interface ICategories {
   id: number
   title: string
   description: string
   parentId: number
}

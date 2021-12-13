export interface Material {
    id:string,
    quantity:number
}
export interface RecipeItem {
    id:string
    name: string,
    imgUrl: string,
 
    des: string,
    materials: Material[]
}
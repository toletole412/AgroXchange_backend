import {
  Authorized,
  JsonController,
  Param,
  BadRequestError,
  NotFoundError,
  Get,
  Body,
  Patch,
  Delete,
  HttpCode,
  Post,
  HeaderParam,
  UploadedFile,
  CurrentUser,
  QueryParam
} from 'routing-controllers'
import { Order } from '../orders/entity'
import { Code } from '../codes/entity'
import { Product } from '../products/entity'
import { Validate } from 'class-validator'
import {User} from '../users/entity'
import { Profile } from '../profiles/entity'
import {FILE_UPLOAD_OPTIONS} from '../uploadConfig'
import { getConnection, getRepository } from 'typeorm'
import {baseUrl} from "../constants";

@JsonController()
export default class ProductController {

  //@Authorized() //TODO: activate once testing is over
  @Get('/profiles/:id([0-9]+)/products')
  @HttpCode(200)
  async getProducts(
    @Param('id') id: number,
    @CurrentUser() currentUser: User
  ) {
      const profile = await Profile.findOneById(id)
      if(!profile) throw new BadRequestError("no user")
      return Product.find({
      where: {seller: profile}
    })

}

@Get('/search/products')
@HttpCode(200)
async seacrhProducts(
    @Body() {country, code}
)
{
  if (country && code){
    const list = await getRepository(Product)
    .createQueryBuilder("product")
    .innerJoin("product.seller", "profile")
    .where("profile.country = :country", {country: country})
    .innerJoin("product.code", "code")
    .andWhere("code.code = :code", {code: code})
    .getMany()
    return list
  }
  if (!country){
    const list = await getRepository(Product)
    .createQueryBuilder("product")
    .innerJoin("product.code", "code")
    .andWhere("code.code = :code", {code: code})
    .getMany()
    return list
  }
  if (!code){
    const list = await getRepository(Product)
    .createQueryBuilder("product")
    .innerJoin("product.seller", "profile")
    .where("profile.country = :country", {country: country})
    .getMany()
    return list
  }
    }

  @Get('/products')
  @HttpCode(200)
  getAllProducts(
  ) {
      return Product.find()
  }

  //@Authorized() //TODO: activate once testing is over
  @Get('/products/:id([0-9]+)')
  @HttpCode(200)

  getProductID(
    @CurrentUser() currentUser: User,
    @Param('id') id: number
  ) {
    const product = Product.findOneById(id)
    return product
  }

  //@Authorized() //TODO: activate once testing is over
  @Post('/products')
  @HttpCode(200)

  async addProduct(
    @Body() product: Partial <Product>,
    @CurrentUser() currentUser: User,
    @UploadedFile('productPhoto', {options: FILE_UPLOAD_OPTIONS}) file: any
  ) {
    const code = await Code.findOne({
      where: {code: product.code}
    })

    if(!currentUser.profile) throw new BadRequestError("Profile doesn't exist.")

    const test = await Product.create({
      photo: baseUrl + file.path.substring(6, file.path.length),
      volume: product.volume,
      price: product.price,
      description: product.description,
      expiration: product.expiration,
      currency: product.currency,
      harvested: product.harvested,
      certificate: product.certificate,
      seller: currentUser.profile,
      code: code
    }).save()
    return "Succesfully added new product"
  }
}

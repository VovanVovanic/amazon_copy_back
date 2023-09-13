import { OmitType } from "@nestjs/mapped-types";
import { ProductDto } from "./products.dto";

export class CreateProductDto extends OmitType(ProductDto, [
  "images",
] as const) {}

/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Put,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { Auth } from "src/decorators/auth.decorator";
import { CurrentUser } from "src/decorators/currentUser";
import { UserDto } from "./dto/updateUser.dto";
import { UserService } from "./user.service";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("profile")
  @Auth("user")
  async getProfile(@CurrentUser("id") id: number) {
    return await this.userService.getById(id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth("user")
  @Put("profile/update")
  async updateProfile(@CurrentUser("id") id: number, @Body() dto: UserDto) {
    return await this.userService.updateProfile(id, dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth("user")
  @Delete("profile/delete")
  async deleteProfile(@CurrentUser("id") id: number) {
    return await this.userService.deleteProfile(id);
  }

  @HttpCode(200)
  @Auth("user")
  @Patch("profile/favorites/:productId")
  async toggleFavorites(
    @CurrentUser("id") id: number,
    @Param("productId") productId: string
  ) {
    return await this.userService.toggleFavorites(id, productId);
  }
}

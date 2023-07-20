/* eslint-disable prettier/prettier */
import { Body, Controller, Get, HttpCode, Param, Patch, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { Auth } from 'src/decorators/auth.decorator';
import { CurrentUser } from 'src/decorators/currentUser';
import { UserDto } from './dto/updateUser.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) { }
   
  @Get('profile')
  @Auth()
  async getProfile(@CurrentUser('id') id:number) {
    return await this.userService.getById(id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put('profile/update')
  async updateProfile(@CurrentUser('id') id:number, @Body() dto: UserDto) {
    return await this.userService.updateProfile(id, dto);
  }

  @HttpCode(200)
  @Auth()
  @Patch('profile/favorites/:productId')
  async toggleFavorites(@CurrentUser('id') id:number, @Param("productId") productId:string) {
    return await this.userService.toggleFavorites(id, productId);
  }
}

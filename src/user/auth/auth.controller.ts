import {
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { GenerateProductDto, SigninDto, SignupDto } from '../dto/auth.dto';
import { UserType } from '@prisma/client';
import { UserInfo } from '../interceptors/user.interceptor';
import { User } from '../decorator/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // @Post('/signup')
  // signup(@Body() body: SignupDto) {
  //   return this.authService.signup(body);
  // }
  @Post('/signup/:userType')
  async signup(
    @Body() body: SignupDto,
    @Param('userType', new ParseEnumPipe(UserType)) userType: UserType,
  ) {
    if (userType !== UserType.BUYER) {
      if (!body.productKey) {
        throw new UnauthorizedException();
      }
      const validProductKey = `${body.email}-${userType}-${process.env.PRODUCT_KEY}`;
      const isValidProductKey = await bcrypt.compare(
        validProductKey,
        body.productKey,
      );
      if (!isValidProductKey) {
        throw new UnauthorizedException();
      }
    }
    return this.authService.signup(body, userType);
  }
  @Post('signin')
  signin(@Body() signinDto: SigninDto) {
    return this.authService.signin(signinDto);
  }
  @Post('/key')
  generateProductKey(@Body() { email, userType }: GenerateProductDto) {
    return this.authService.generateProductKey(email, userType);
  }
  @Get('/me')
  me(@User() user: UserInfo) {
    return user;
  }
}

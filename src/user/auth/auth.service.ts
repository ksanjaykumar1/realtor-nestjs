import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { SigninDto, SignupDto } from '../dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserType } from '@prisma/client';

interface JwtPayload {
  name: string;
  id: number;
}
@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}
  async signup(signupDto: SignupDto) {
    const { email, password, name, phone } = signupDto;
    const userExist = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (userExist) {
      throw new ConflictException();
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prismaService.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        user_type: UserType.BUYER,
      },
    });
    const token = await this.generateJwt({
      id: user.id,
      name,
    });
    return { token };
  }

  async signin(signinDto: SigninDto) {
    const { email, password } = signinDto;
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new HttpException('Invalid credentials', 400);
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new HttpException('Invalid credentials', 400);
    }
    const token = await this.generateJwt({ name: user.name, id: user.id });
    return { token };
  }
  private generateJwt(payload: JwtPayload) {
    return jwt.sign(payload, process.env.JSON_TOKEN_KEY, { expiresIn: 360000 });
  }
}

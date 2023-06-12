import { Controller, Get, NotFoundException, Param, ParseUUIDPipe } from "@nestjs/common";
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('/')
  getAll(): any {
    return this.userService.getAll();
  }
  @Get('/:id')
  async getById(@Param('id', new ParseUUIDPipe()) id: string) {
    const user = await this.userService.getById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}

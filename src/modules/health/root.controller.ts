import { Controller, Get } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';

@Controller()
@Public()
export class RootController {
  @Get()
  root() {
    return {
      ok: true,
      name: 'Familia em Conserva API',
      health: '/health',
    };
  }
}

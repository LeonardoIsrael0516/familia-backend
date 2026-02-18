import { Controller, Get, Header } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { PwaService } from './pwa.service';
import { ConfigService } from '@nestjs/config';

@Controller('pwa')
@Public()
export class PwaController {
  constructor(
    private readonly pwaService: PwaService,
    private readonly config: ConfigService,
  ) {}

  @Get('config')
  getConfig() {
    return this.pwaService.getConfig();
  }

  @Get('manifest')
  @Header('Content-Type', 'application/manifest+json')
  async getManifest(): Promise<Record<string, unknown>> {
    const origin = this.config.get<string>('cors.origin') || '';
    return this.pwaService.getManifest(origin);
  }
}

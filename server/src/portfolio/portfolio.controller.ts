import { Controller, Get } from '@nestjs/common';
import { PortfolioService } from './portfolio.service.js';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get()
  getAll() {
    return this.portfolioService.getAll();
  }
}

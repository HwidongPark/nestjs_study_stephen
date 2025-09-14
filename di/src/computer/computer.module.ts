import { Module } from '@nestjs/common';
import { ComputerController } from './computer.controller';
import { CpuModule } from 'src/cpu/cpu.module';
import { DiscModule } from 'src/disc/disc.module';

@Module({
  controllers: [ComputerController],
  imports: [CpuModule, DiscModule]
})
export class ComputerModule {}

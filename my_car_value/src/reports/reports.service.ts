import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from 'src/users/user.entity';
import { ApproveReportDto } from './dtos/approve-report.dto';

@Injectable()
export class ReportsService {

  constructor(@InjectRepository(Report) private reportsRepository: Repository<Report>) {

  }


  /**
   * report 생성
   * @param reportDto 
   * @param user 
   * @returns 
   */
  create(reportDto: CreateReportDto, user: User) {

    const report = this.reportsRepository.create(reportDto);
    report.user = user  //-> 관계 추가
    return this.reportsRepository.save(report);
  }



  /**
   * report를 approve하는 메서드
   * @param id 
   * @param approveDto 
   * @returns 
   */
  async changeApproval(id: number, approved: boolean) {

    const report = await this.reportsRepository.findOne({
      where: { id }
    });

    console.log(`report = `, report);

    if (!report) {
      throw new NotFoundException("Report Not Found");
    }

    report.approved = approved;
    return this.reportsRepository.save(report);
  }

}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from '../users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);
    report.user = user;

    return this.repo.save(report);
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.repo.findOne({
      where: {
        id: parseInt(id),
      },
    });

    if (!report) {
      throw new NotFoundException('report not found');
    }

    report.approved = approved;

    return this.repo.save(report);
  }

  createEstimate(estimateDto: GetEstimateDto) {
    // return this.repo.createQueryBuilder().select('*').getRawMany(); //поверне усі записи з таблиці reports
    return (
      this.repo
        .createQueryBuilder()
        // .select('*')
        .select('AVG(price)', 'price') //щоб повернути середню ціну
        //додаємо умови фільтрації
        .where('make = :make', { make: estimateDto.make })
        .andWhere('model = :model', { model: estimateDto.model }) // вдруге треба використовувавти endWhere тому що другий where перезапише перший
        .andWhere('lng = :lng BETWEEN -5 AND 5', { lng: estimateDto.lng })
        .andWhere('lat = :lat BETWEEN -5 AND 5', { lat: estimateDto.lat })
        .andWhere('year = :year BETWEEN -3 AND 3', { year: estimateDto.year })
        .andWhere('approved IS TRUE')
        .orderBy('ABS(mileage = :mileage)', 'DESC')
        .setParameter('mileage', estimateDto.mileage)
        .limit(3) //щоб узяти перші 3 записи
        .getRawMany()
    );
  }
}

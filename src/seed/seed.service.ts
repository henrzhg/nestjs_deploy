import { Injectable } from '@nestjs/common';
import { seedData } from 'db/seeds/data-seed';
import { DataSource } from 'typeorm';

@Injectable()
export class SeedService {
    constructor(private readonly connection: DataSource) {}


    async seed(): Promise<void> {
        console.log("start seeding data")

        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const manager = queryRunner.manager
            await seedData(manager);

            await queryRunner.commitTransaction();
        } catch (error) {
            console.log("An error occured during database seeding : ", error)
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release();
        }

    }
}
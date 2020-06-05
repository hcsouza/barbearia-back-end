import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from "typeorm";

export default class AlterProviderToProviderID1587677468242 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropColumn('appointments', 'provider');
      await queryRunner.addColumn('appointments',
                                  new TableColumn(
                                    { name: 'provider_id',
                                      type: 'uuid',
                                      isNullable: true
                                    }));

      await queryRunner.createForeignKey('appointments', new TableForeignKey({
        columnNames: ['provider_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        name: 'appointment_provider_fk'
      }))

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropForeignKey('appointments', 'appointment_provider_fk');
      await queryRunner.dropColumn('appointments', 'provider_id');
      await queryRunner.addColumn('appointments', new TableColumn({
        name: 'provider',
        type: 'varchar',
        isNullable: false,
      }))
    }

}

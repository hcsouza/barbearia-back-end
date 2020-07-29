import {MigrationInterface, QueryRunner, TableColumn , TableForeignKey} from "typeorm";

export class AddUserIdToAppointments1595373868269 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.addColumn('appointments',
                                  new TableColumn(
                                    { name: 'user_id',
                                      type: 'uuid',
                                      isNullable: true
                                    }));

      await queryRunner.createForeignKey('appointments', new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        name: 'appointment_user_fk'
      }))

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropForeignKey('appointments', 'appointment_user_fk');
      await queryRunner.dropColumn('appointments', 'user_id');
    }

}

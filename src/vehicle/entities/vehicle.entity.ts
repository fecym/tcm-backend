import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { InfoVehicleDto } from '../dto/info-vehicle.dto';
import { transformDateTime } from '../../utils';
import { VehicleMaintainEntity } from '../../vehicle-maintain/entities/vehicle-maintain.entity';

@Entity('vehicle')
export class VehicleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 100,
    unique: true,
    name: 'license_plate',
    comment: '车牌照',
  })
  licensePlate: string;

  @Column({ length: 24, comment: '车辆名称', default: '', nullable: true })
  name: string;

  @Column({ length: 24, comment: '车辆类型', name: 'vehicle_type_name' })
  vehicleTypeName: string;

  @Column({ length: 24, name: 'vehicle_owner_name' })
  vehicleOwnerName: string;

  @Column({ length: 11, name: 'vehicle_owner_tel' })
  vehicleOwnerTel: string;

  @Column({ length: 255, comment: '车辆介绍' })
  remark: string;

  @OneToMany(() => VehicleMaintainEntity, (meridian) => meridian.vehicle)
  maintainList: Array<VehicleMaintainEntity>; // 维修记录

  // 创建人
  @ManyToOne(() => UserEntity, (user) => user.nickname)
  createUser: UserEntity;

  @Column({
    name: 'create_time',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    transformer: { to: transformDateTime, from: transformDateTime },
  })
  createTime: Date;

  toResponseObject(): InfoVehicleDto {
    const obj: any = { ...this };
    if (this.createUser?.id) {
      obj.createUserId = this.createUser.id;
      obj.createUserName = this.createUser.nickname || this.createUser.username;
    }
    delete obj.createUser;
    return obj;
  }
}

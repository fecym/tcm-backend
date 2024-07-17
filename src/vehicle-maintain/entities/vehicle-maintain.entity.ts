import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { VehicleEntity } from '../../vehicle/entities/vehicle.entity';
import { transformDateTime } from '../../utils';
import { InfoVehicleDto } from '../../vehicle/dto/info-vehicle.dto';
import { YesNoEnum } from '../../enum';

@Entity('vehicle_maintain')
export class VehicleMaintainEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20, comment: '维修工单名称', unique: true })
  name: string;

  // 维修车辆
  @ManyToOne(() => VehicleEntity)
  vehicle: VehicleEntity;

  @Column({
    comment: '车辆形式距离',
    name: 'distance_traveled',
    type: 'decimal',
    default: 0,
  })
  distanceTraveled: number;

  @Column({ length: 10, comment: '维修人', name: 'maintain_user' })
  maintainUser: string;

  @Column({ length: 16, comment: '维修类型', name: 'maintain_type_name' })
  maintainTypeName: string;

  @Column({
    name: 'start_time',
    type: 'datetime',
    comment: '维修开始时间',
    transformer: { to: transformDateTime, from: transformDateTime },
  })
  startTime: Date;

  @Column({
    name: 'end_time',
    type: 'datetime',
    comment: '维修结束时间',
    transformer: { to: transformDateTime, from: transformDateTime },
  })
  endTime: Date;

  @Column({
    type: 'enum',
    enum: YesNoEnum,
    default: YesNoEnum.No,
    comment: '是否外出维修',
    name: 'is_out_repair',
  })
  isOutRepair: YesNoEnum;

  @Column({ length: 32, comment: '维修地点', name: 'repair_address' })
  repairAddress: string;

  @Column({
    comment: '车辆到店时间',
    name: 'store_entry_time',
    type: 'datetime',
    nullable: true,
    transformer: { to: transformDateTime, from: transformDateTime },
  })
  storeEntryTime: Date;

  @Column({
    comment: '车辆离店时间',
    name: 'store_exit_time',
    type: 'datetime',
    nullable: true,
    transformer: { to: transformDateTime, from: transformDateTime },
  })
  storeExitTime: Date;

  @Column({
    comment: '外出时间',
    name: 'out_repair_time',
    type: 'datetime',
    nullable: true,
    transformer: { to: transformDateTime, from: transformDateTime },
  })
  outRepairTime: Date;

  @Column({
    comment: '回来时间',
    name: 'back_repair_time',
    type: 'datetime',
    nullable: true,
    transformer: { to: transformDateTime, from: transformDateTime },
  })
  backRepairTime: Date;

  @Column({ length: 10, comment: '顾客姓名', name: 'customer_name' })
  customerName: string;

  @Column({
    length: 11,
    comment: '顾客电话',
    name: 'customer_tel',
    nullable: true,
  })
  customerTel: string;

  @Column({ comment: '维修金额', type: 'decimal' })
  amount: number;

  @Column({ length: 2000, comment: '维修说明' })
  remark: string;

  // 创建人
  @ManyToOne(() => UserEntity, (user) => user.nickname)
  @JoinColumn({ name: 'create_user_id' })
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
    if (this.vehicle?.id) {
      obj.vehicleId = this.vehicle.id;
      obj.vehicleName = this.vehicle.name;
      obj.vehicleLicensePlate = this.vehicle.licensePlate;
      obj.vehicleOwnerName = this.vehicle.vehicleOwnerName;
      obj.vehicleOwnerTel = this.vehicle.vehicleOwnerTel;
    }
    delete obj.createUser;
    delete obj.vehicle;
    return obj;
  }
}

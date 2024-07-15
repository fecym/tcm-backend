import {
  DateIntervalEnum,
  ExpenseTypeEnum,
  GenderEnum,
  PayTypeEnum,
  RelationshipEnum,
  RoleEnum,
  TransferTypeEnum,
} from './index';

export const ExpenseTypeDesc: { [key in ExpenseTypeEnum]: string } = {
  [ExpenseTypeEnum.DINING]: '餐饮美食',
  [ExpenseTypeEnum.TRANSPORT]: '交通出行',
  [ExpenseTypeEnum.SNACKS]: '零食饮料',
  [ExpenseTypeEnum.LIVING]: '生活用品',
  [ExpenseTypeEnum.BILLS]: '充值缴费',
  [ExpenseTypeEnum.CLOTHING]: '服饰鞋袜',
  [ExpenseTypeEnum.HOUSING]: '住房物业',
  [ExpenseTypeEnum.ENTERTAINMENT]: '休闲娱乐',
  [ExpenseTypeEnum.HOTEL]: '酒店旅游',
  [ExpenseTypeEnum.TRANSFER]: '转账红包',
  [ExpenseTypeEnum.OTHER]: '其他',
};

export const PayTypeDesc: { [key in PayTypeEnum]: string } = {
  [PayTypeEnum.ALIPAY]: '支付宝',
  [PayTypeEnum.WECHAT]: '微信',
  [PayTypeEnum.BANK_CARD]: '银行卡',
  [PayTypeEnum.OTHER]: '其他',
};

export const GenderDesc: { [key in GenderEnum]: string } = {
  [GenderEnum.MALE]: '男',
  [GenderEnum.FEMALE]: '女',
  [GenderEnum.OTHER]: '其他',
};

export const RoleDesc: { [key in RoleEnum]: string } = {
  [RoleEnum.super_admin]: '超级管理员',
  [RoleEnum.admin]: '管理员',
  [RoleEnum.author]: '作者',
  [RoleEnum.technician]: '技术员',
  [RoleEnum.tester]: '测试',
};

export const RelationshipDesc: {
  [key in RelationshipEnum]: string;
} = {
  [RelationshipEnum.PARTNER]: '伴侣',
  [RelationshipEnum.FRIEND]: '朋友',
  [RelationshipEnum.RELATIVE]: '亲戚',
  [RelationshipEnum.COLLEAGUE]: '同事',
  [RelationshipEnum.TEACHER_STUDENT]: '师生',
  [RelationshipEnum.OTHER]: '其他',
};

export const TransferTypeDesc: {
  [key in TransferTypeEnum]: string;
} = {
  [TransferTypeEnum.BORROW_MONEY]: '借钱',
  [TransferTypeEnum.RETURN_MONEY]: '还钱',
  [TransferTypeEnum.GIFT_MONEY]: '礼金',
  [TransferTypeEnum.REPAY_MONEY]: '还礼',
  [TransferTypeEnum.OTHER]: '其他',
};

export const DateIntervalDesc: {
  [key in DateIntervalEnum]: string;
} = {
  [DateIntervalEnum.DAY]: '日',
  [DateIntervalEnum.WEEK]: '周',
  [DateIntervalEnum.MONTH]: '月',
  [DateIntervalEnum.YEAR]: '年',
};

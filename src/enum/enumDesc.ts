import {
  ExpenseTypeEnum,
  GenderEnum,
  PayTypeEnum,
  RelationshipEnum,
  RoleEnum,
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
};

export const GenderDesc: { [key in GenderEnum]: string } = {
  [GenderEnum.MALE]: '男',
  [GenderEnum.FEMALE]: '女',
  [GenderEnum.OTHER]: '其他',
};

export const RoleDesc: { [key in RoleEnum]: string } = {
  [RoleEnum.root]: '超级管理员',
  [RoleEnum.author]: '文章作者',
  [RoleEnum.visitor]: '访问者|访客',
  [RoleEnum.repair]: '维修者',
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

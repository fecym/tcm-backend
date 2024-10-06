export enum RoleEnum {
  super_admin = '0',
  admin = '1',
  author = '2',
  technician = '3',
  tester = '4',
}

export enum YesNoEnum {
  Yes = 1,
  No = 0,
}

export enum GenderEnum {
  MALE = 1,
  FEMALE = 2,
  OTHER = 0,
}

export enum PayTypeEnum {
  ALIPAY = '1', // 支付宝
  WECHAT = '2', // 微信
  BANK_CARD = '3', // 银行卡
  OTHER = '4', // 银行卡
}

export enum ExpenseTypeEnum {
  DINING = '1', // 餐饮
  SNACKS = '2', // 零食
  ENTERTAINMENT = '3', // 娱乐
  TRANSPORT = '4', // 交通
  BILLS = '5', // 缴费
  LIVING = '6', // 生活
  CLOTHING = '7', // 服饰
  HOUSING = '8', // 住房
  HOTEL = '9', // 酒店
  TRANSFER = '10', // 转账
  MEDICAL = '11', // 医疗
  OTHER = '12', // 其他
}

export enum RelationshipEnum {
  PARTNER = '0',
  FRIEND = '1',
  RELATIVE = '2',
  COLLEAGUE = '3',
  TEACHER_STUDENT = '4',
  OTHER = '5',
}

export enum TransferTypeEnum {
  BORROW_MONEY = '0', // 借钱
  RETURN_MONEY = '1', // 还钱
  GIFT_MONEY = '2', // 礼金
  REPAY_MONEY = '3', // 还礼
  OTHER = '4', // 其他
}

export enum DateIntervalEnum {
  DAY = '1',
  WEEK = '2',
  MONTH = '3',
  YEAR = '4',
}

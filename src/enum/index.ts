export enum RoleEnum {
  super_admin,
  admin = 1,
  author = 2,
  technician = 3,
  tester = 4,
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
  TRANSPORT = '2', // 交通
  SNACKS = '3', // 零食
  LIVING = '4', // 生活
  BILLS = '5', // 缴费
  CLOTHING = '6', // 服饰
  HOUSING = '7', // 住房
  ENTERTAINMENT = '8', // 娱乐
  HOTEL = '9', // 酒店
  TRANSFER = '10', // 转账
  OTHER = '11', // 其他
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

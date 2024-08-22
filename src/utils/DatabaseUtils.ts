import { Repository } from 'typeorm';

export class DatabaseUtils {
  /**
   * 清理没有 id 的脏数据
   * @param repository - 要操作的实体的 repository
   * @returns 删除的记录数
   */
  static async cleanDirtyData<T>(repository: Repository<T>): Promise<number> {
    const deleteResult = await repository
      .createQueryBuilder()
      .delete()
      .from(repository.target)
      .where('id IS NULL OR id = :undefinedValue OR id = :emptyString', {
        undefinedValue: undefined,
        emptyString: '',
      })
      .execute();
    return deleteResult.affected || 0;
  }
}

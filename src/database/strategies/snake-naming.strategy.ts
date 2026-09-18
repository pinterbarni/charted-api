import { DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';
import { snakeCase } from 'typeorm/util/StringUtils.js';

/**
 * Custom TypeORM naming strategy, converts camelCase TypeScript property names to snake_case PostgreSQL column names.
 * @example
 * from **displayName** - to **display_name**
 */
export class SnakeNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
  /**
   * Converts camelCase prop name to snake_case for use as column name.
   * @param propertyName camelCase TypeScript property name
   * @param customName Optional custom column name set w. @Column decor.
   * @returns finished db-like snake_case column name to use in PostgreSQL
   */
  columnName(propertyName: string, customName: string): string {
    return customName ?? snakeCase(propertyName);
  }
}

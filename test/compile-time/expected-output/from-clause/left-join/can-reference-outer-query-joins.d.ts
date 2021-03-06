import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";
/**
 * You cannot reference outer query joins in MySQL 8.
 * You cannot reference outer query joins in MySQL 5.7.
 * You can reference outer query joins in PostgreSQL 9.4.
 * You can reference outer query joins in SQLite 3.26.
 *
 * The SQL standard allows it. MySQL just doesn't.
 */
export declare const fromClause: tsql.IFromClause<{
    outerQueryJoins: readonly tsql.Join<{
        tableAlias: "outerQueryTable";
        nullable: false;
        columns: {
            readonly outerQueryTableId: tsql.Column<{
                tableAlias: "outerQueryTable";
                columnAlias: "outerQueryTableId";
                mapper: tm.Mapper<unknown, bigint>;
            }>;
        };
        originalColumns: {
            readonly outerQueryTableId: tsql.Column<{
                tableAlias: "outerQueryTable";
                columnAlias: "outerQueryTableId";
                mapper: tm.Mapper<unknown, bigint>;
            }>;
        };
        primaryKey: undefined;
        candidateKeys: readonly [];
        deleteEnabled: true;
        mutableColumns: readonly [];
    }>[];
    currentJoins: readonly (tsql.Join<{
        tableAlias: "myTable";
        nullable: false;
        columns: {
            readonly myTableId: tsql.Column<{
                tableAlias: "myTable";
                columnAlias: "myTableId";
                mapper: tm.Mapper<unknown, bigint>;
            }>;
        };
        originalColumns: {
            readonly myTableId: tsql.Column<{
                tableAlias: "myTable";
                columnAlias: "myTableId";
                mapper: tm.Mapper<unknown, bigint>;
            }>;
        };
        primaryKey: undefined;
        candidateKeys: readonly [];
        deleteEnabled: true;
        mutableColumns: readonly [];
    }> | tsql.Join<{
        tableAlias: "otherTable";
        nullable: true;
        columns: {
            otherTableId: tsql.IColumn<{
                tableAlias: "otherTable";
                columnAlias: "otherTableId";
                mapper: tm.Mapper<unknown, bigint>;
            }>;
        };
        originalColumns: {
            otherTableId: tsql.IColumn<{
                tableAlias: "otherTable";
                columnAlias: "otherTableId";
                mapper: tm.Mapper<unknown, bigint>;
            }>;
        };
        primaryKey: undefined;
        candidateKeys: readonly [];
        deleteEnabled: false;
        mutableColumns: readonly [];
    }>)[];
}>;

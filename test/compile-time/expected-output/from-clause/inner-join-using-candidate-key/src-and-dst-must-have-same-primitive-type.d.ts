import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";
export declare const fromClause: tsql.IFromClause<{
    outerQueryJoins: undefined;
    currentJoins: readonly (tsql.Join<{
        tableAlias: "childTable";
        nullable: false;
        columns: {
            readonly userId: tsql.Column<{
                tableAlias: "childTable";
                columnAlias: "userId";
                mapper: tm.Mapper<unknown, bigint | null>;
            }>;
            readonly computerId: tsql.Column<{
                tableAlias: "childTable";
                columnAlias: "computerId";
                mapper: tm.Mapper<unknown, "hello" | null>;
            }>;
            readonly accessedAt: tsql.Column<{
                tableAlias: "childTable";
                columnAlias: "accessedAt";
                mapper: tm.Mapper<unknown, Date>;
            }>;
        };
        originalColumns: {
            readonly userId: tsql.Column<{
                tableAlias: "childTable";
                columnAlias: "userId";
                mapper: tm.Mapper<unknown, bigint | null>;
            }>;
            readonly computerId: tsql.Column<{
                tableAlias: "childTable";
                columnAlias: "computerId";
                mapper: tm.Mapper<unknown, "hello" | null>;
            }>;
            readonly accessedAt: tsql.Column<{
                tableAlias: "childTable";
                columnAlias: "accessedAt";
                mapper: tm.Mapper<unknown, Date>;
            }>;
        };
        primaryKey: undefined;
        candidateKeys: readonly [];
        deleteEnabled: true;
        mutableColumns: readonly [];
    }> | tsql.Join<{
        tableAlias: "myTable";
        nullable: false;
        columns: {
            readonly userId: tsql.Column<{
                tableAlias: "myTable";
                columnAlias: "userId";
                mapper: tm.Mapper<unknown, 1n | null>;
            }>;
            readonly computerId: tsql.Column<{
                tableAlias: "myTable";
                columnAlias: "computerId";
                mapper: tm.Mapper<unknown, string | null>;
            }>;
            readonly createdAt: tsql.Column<{
                tableAlias: "myTable";
                columnAlias: "createdAt";
                mapper: tm.Mapper<unknown, Date>;
            }>;
        };
        originalColumns: {
            readonly userId: tsql.Column<{
                tableAlias: "myTable";
                columnAlias: "userId";
                mapper: tm.Mapper<unknown, 1n | null>;
            }>;
            readonly computerId: tsql.Column<{
                tableAlias: "myTable";
                columnAlias: "computerId";
                mapper: tm.Mapper<unknown, string | null>;
            }>;
            readonly createdAt: tsql.Column<{
                tableAlias: "myTable";
                columnAlias: "createdAt";
                mapper: tm.Mapper<unknown, Date>;
            }>;
        };
        primaryKey: undefined;
        candidateKeys: readonly (readonly ("userId" | "computerId")[])[];
        deleteEnabled: true;
        mutableColumns: readonly [];
    }>)[];
}>;

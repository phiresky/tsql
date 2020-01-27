import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";
export declare const query: tsql.Query<{
    fromClause: tsql.IFromClause<{
        outerQueryJoins: undefined;
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
            tableAlias: "myOtherTable";
            nullable: true;
            columns: {
                readonly myOtherTableId: tsql.Column<{
                    tableAlias: "myOtherTable";
                    columnAlias: "myOtherTableId";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
            };
            originalColumns: {
                readonly myOtherTableId: tsql.Column<{
                    tableAlias: "myOtherTable";
                    columnAlias: "myOtherTableId";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
            };
            primaryKey: undefined;
            candidateKeys: readonly [];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }>)[];
    }>;
    selectClause: [{
        readonly myTable: {
            readonly myTableId: tsql.Column<{
                tableAlias: "myTable";
                columnAlias: "myTableId";
                mapper: tm.Mapper<unknown, bigint>;
            }>;
        };
        readonly myOtherTable: {
            readonly myOtherTableId: tsql.Column<{
                tableAlias: "myOtherTable";
                columnAlias: "myOtherTableId";
                mapper: tm.Mapper<unknown, bigint | null>;
            }>;
        };
    }];
    limitClause: undefined;
    compoundQueryClause: undefined;
    compoundQueryLimitClause: undefined;
    mapDelegate: tsql.MapDelegate<never, never, Promise<{
        x4: {
            x: bigint;
            myTable: {
                readonly myTableId: bigint;
            };
            myOtherTable?: {
                readonly myOtherTableId: bigint;
            } | undefined;
        };
        x3: bigint;
    }>>;
    groupByClause: undefined;
}>;

import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";
export declare const myQuery: tsql.Query<{
    fromClause: tsql.IFromClause<{
        outerQueryJoins: undefined;
        currentJoins: readonly tsql.Join<{
            tableAlias: "myTable";
            nullable: false;
            columns: {
                readonly myColumn: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "myColumn";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly myTableId: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "myTableId";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly myColumn2: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "myColumn2";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly stringColumn: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "stringColumn";
                    mapper: tm.Mapper<unknown, string>;
                }>;
            };
            originalColumns: {
                readonly myColumn: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "myColumn";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly myTableId: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "myTableId";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly myColumn2: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "myColumn2";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly stringColumn: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "stringColumn";
                    mapper: tm.Mapper<unknown, string>;
                }>;
            };
            primaryKey: undefined;
            candidateKeys: readonly [];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }>[];
    }>;
    selectClause: [tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, bigint | null>;
        tableAlias: "$aliased";
        alias: "value";
        usedRef: tsql.IUsedRef<never>;
        isAggregate: false;
    }>];
    limitClause: undefined;
    compoundQueryClause: undefined;
    compoundQueryLimitClause: undefined;
    mapDelegate: undefined;
    groupByClause: undefined;
}>;
export declare const fetchedRow: tsql.ExecutionUtil.FetchOnePromise<{
    readonly value: bigint | null;
}>;

import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntSigned(),
        createdAt : tm.mysql.dateTime(),
    });

const otherTable = tsql.table("otherTable")
    .addColumns({
        otherTableId : tm.mysql.bigIntSigned().orNull(),
    });

const fromClause = tsql.FromClauseUtil.crossJoin(
    tsql.FromClauseUtil.from(
        tsql.FromClauseUtil.newInstance(),
        myTable
    ),
    otherTable
);

export const selectClause = tsql.SelectClauseUtil.select(
    fromClause,
    undefined,
    undefined,
    columns => [
        tsql.eq(columns.myTable.myTableId, columns.myTable.myTableId).as("eq")
    ]
);

export const groupByClause = tsql.GroupByClauseUtil.groupBy(
    fromClause,
    undefined,
    columns => [
        columns.otherTable.otherTableId,
        columns.myTable.createdAt,
        //columns.$aliased.eq,
    ]
);

export const groupByClause2 = tsql.GroupByClauseUtil.groupBy(
    fromClause,
    groupByClause,
    columns => [
        columns.otherTable.otherTableId,
        columns.myTable.createdAt,
        //columns.$aliased.eq,
    ]
);

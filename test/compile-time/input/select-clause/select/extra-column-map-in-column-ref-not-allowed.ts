import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntSigned(),
        createdAt : tm.mysql.dateTime(),
    })

const otherTable = tsql.table("otherTable")
    .addColumns({
        otherTableId : tm.mysql.bigIntSigned().orNull(),
    });

const extra = tsql.table("extra")
    .addColumns({
        myTableId : tm.mysql.bigIntSigned(),
        createdAt : tm.mysql.dateTime(),
        extra : tm.mysql.dateTime(),
    })

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
    columns => [
        {
            otherTable : columns.otherTable,
            myTable : columns.myTable,
            extra : extra.columns,
        }
    ]
)
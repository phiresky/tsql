import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myColumn : tm.mysql.boolean(),
    });

export const query = tsql.QueryUtil.newInstance()
    .from(myTable)
    .groupBy(columns => [columns.myColumn])
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ))
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ));

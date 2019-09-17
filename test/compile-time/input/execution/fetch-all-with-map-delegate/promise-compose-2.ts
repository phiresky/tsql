import * as tm from "type-mapping";
import * as tsql from "../../../../../dist";

const test = tsql.table("test")
    .addColumns({
        testId : tm.mysql.bigIntUnsigned(),
        testVal : tm.mysql.bigIntUnsigned(),
    });

const other = tsql.table("other")
    .addColumns({
        testId : tm.mysql.bigIntUnsigned(),
        otherVal : tm.mysql.bigIntUnsigned(),
    })
    .setPrimaryKey(columns => [columns.testId]);

export const resultSet = tsql.ExecutionUtil.fetchAll(
    tsql.from(test)
        .innerJoinUsingPrimaryKey(
            tables => tables.test,
            other
        )
        .select(columns => [columns])
        .orderBy(columns => [
            columns.test.testId.desc(),
        ])
        .map(async (row) => {
            return {
                test : row.test,
                other2 : row.other,
                total : row.test.testVal + row.other.otherVal,
            };
        })
        .map(async (row) => {
            return {
                ...row,
                hello : "hi",
            };
        })
        .map(async (row) => {
            return {
                root : row,
            };
        }),
    null as any
);

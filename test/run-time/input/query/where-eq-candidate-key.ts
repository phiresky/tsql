import * as tape from "tape";
import * as tm from "type-mapping";
import * as tsql from "../../../../dist";
import {compareSqlPretty} from "../../../compare-sql-pretty";

tape(__filename, t => {
    const myTable = tsql.table("myTable")
        .addColumns({
            myBoolColumn : tm.mysql.boolean(),
            myDoubleColumn : tm.mysql.double(),
            myDateTimeColumn : tm.mysql.dateTime(3),
        })
        .addCandidateKey(columns => [columns.myDoubleColumn, columns.myDateTimeColumn]);

    const query = tsql.from(myTable)
        .select(c => [c.myBoolColumn])
        .whereEqCandidateKey(
            tables => tables.myTable,
            {
                myDoubleColumn : 3.141,
                myDateTimeColumn : new Date("2010-02-03T23:34:45.456Z"),
            }
        )
        .whereEqCandidateKey(
            tables => tables.myTable,
            {
                /**
                 * This column does not belong here!
                 * But it should get ignored.
                 */
                myBoolColumn : false,
                myDoubleColumn : 3.141,
                myDateTimeColumn : new Date("2010-02-03T23:34:45.456Z"),
                /**
                 * This column does not belong here!
                 * But it should get ignored.
                 */
                DOES_NOT_EXIST : false,
            } as any
        );

    compareSqlPretty(__filename, t, query);

    t.end();
});

import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        userId : tm.mysql.bigIntSigned().orNull(),
        computerId : tm.mysql.varChar().orNull(),
        createdAt : tm.mysql.dateTime(),
    })
    .addCandidateKey(c => [c.userId, c.computerId]);

const childTable = tsql.table("childTable")
    .addColumns({
        userId : tm.mysql.bigIntSigned().orNull(),
        /**
         * Realistically, will this ever be a thing?
         */
        computerId : tm.mysql.varChar().orNull().or(tm.mysql.boolean()),
        accessedAt : tm.mysql.dateTime(),
    });

export const eqCandidateKeyOfTable = tsql.eqCandidateKeyOfTable;
export const expr = eqCandidateKeyOfTable(
    childTable,
    myTable,
    c => [c.userId, c.computerId]
);

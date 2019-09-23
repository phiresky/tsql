import * as tm from "type-mapping";
import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    const resultSet = await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE test (
                testId INT PRIMARY KEY,
                testVal INT
            );
            CREATE TABLE other (
                testId INT PRIMARY KEY,
                otherVal INT
            );
            INSERT INTO
                test(testId, testVal)
            VALUES
                (1, 100),
                (2, 200),
                (3, 300);
            INSERT INTO
                other(testId, otherVal)
            VALUES
                (1, 111),
                (3, 333);
        `);

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

        return tsql.from(test)
            .innerJoinUsingPrimaryKey(
                tables => tables.test,
                other
            )
            .orderBy(columns => [
                columns.test.testId.desc(),
            ])
            .compoundQueryLimit(1)
            .count(
                connection
            );
    });
    t.deepEqual(
        resultSet,
        BigInt(2)
    );

    t.end();
});
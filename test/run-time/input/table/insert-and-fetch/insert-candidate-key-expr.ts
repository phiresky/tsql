import * as tm from "type-mapping";
import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    const test = tsql.table("test")
        .addColumns({
            testId : tm.mysql.bigIntUnsigned(),
            testVal : tm.mysql.bigIntUnsigned(),
        })
        .addCandidateKey(columns => [columns.testId])
        .addExplicitDefaultValue(columns => [
            columns.testId,
            columns.testVal,
        ]);

    const insertResult = await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE test (
                testId INT PRIMARY KEY NOT NULL DEFAULT 11,
                testVal INT NOT NULL DEFAULT 11
            );
        `);

        return (test).insertAndFetch(
            connection,
            {
                testId : tsql.integer.add(BigInt(3), BigInt(1), BigInt(0)),
                testVal : BigInt(400),
            }
        );
    });
    t.deepEqual(
        insertResult,
        {
            testId : BigInt(4),
            testVal : BigInt(400),
        }
    );

    await pool
        .acquire(async (connection) => {
            return tsql.from(test).select(columns => [columns]).fetchAll(connection);
        })
        .then((rows) => {
            t.deepEqual(
                rows,
                [
                    {
                        testId : BigInt(4),
                        testVal : BigInt(400),
                    }
                ]
            );
        });

    t.end();
});

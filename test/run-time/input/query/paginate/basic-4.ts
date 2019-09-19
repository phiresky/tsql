import * as tm from "type-mapping";
import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE test (
                testId INT PRIMARY KEY,
                testVal INT
            );
        `);

        const test = tsql.table("test")
            .addColumns({
                testId : tm.mysql.bigIntUnsigned(),
                testVal : tm.mysql.bigIntUnsigned(),
            });

        const page = 0;
        const rowsPerPage = 3;
        const p = await tsql.from(test)
            .orderBy(columns => [
                columns.testId.asc(),
            ])
            .select(c => [c])
            .paginate(
                connection,
                {
                    page,
                    rowsPerPage,
                }
            );
        t.deepEqual(
            p,
            {
                info : {
                    page : BigInt(page),
                    rowsPerPage : BigInt(rowsPerPage),
                    rowsFound : 0n,
                    pagesFound : 0n,
                    rowOffset : 0n,
                },
                rows : [
                ]
            }
        );
    });

    t.end();
});

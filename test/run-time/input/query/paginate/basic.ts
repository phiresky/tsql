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
            INSERT INTO
                test(testId, testVal)
            VALUES
                (6, 600),
                (7, 700),
                (3, 300),
                (4, 400),
                (8, 800),
                (9, 900),
                (1, 100),
                (2, 200),
                (5, 500);
        `);

        const test = tsql.table("test")
            .addColumns({
                testId : tm.mysql.bigIntUnsigned(),
                testVal : tm.mysql.bigIntUnsigned(),
            });

        let page = 0;
        const rowsPerPage = 3;
        for (let i=1; i<10; i+=rowsPerPage) {
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

            t.deepEqual(p.info.rowOffset, BigInt(BigInt(0)));
            t.deepEqual(
                p,
                {
                    info : {
                        page : BigInt(page),
                        rowsPerPage : BigInt(rowsPerPage),
                        rowsFound : BigInt(BigInt(9)),
                        pagesFound : BigInt(BigInt(3)),
                        rowOffset : BigInt(BigInt(0)),
                    },
                    rows : [
                        { testId : BigInt(i), testVal : BigInt(i*100) },
                        { testId : BigInt(i+1), testVal : BigInt((i+1)*100) },
                        { testId : BigInt(i+2), testVal : BigInt((i+2)*100) }
                    ]
                }
            );

            ++page;
        }
    });

    await pool.disconnect();
    t.end();
});

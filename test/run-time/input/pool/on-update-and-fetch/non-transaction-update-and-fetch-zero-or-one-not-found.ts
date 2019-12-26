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
        .setPrimaryKey(columns => [columns.testId])
        .addAllMutable();

    let eventHandled = false;
    let onCommitInvoked = false;
    let onRollbackInvoked = false;
    pool.onUpdateAndFetch.addHandler((event) => {
        if (!event.isFor(test)) {
            return;
        }
        event.addOnCommitListener(() => {
            onCommitInvoked = true;
        });
        event.addOnRollbackListener(() => {
            onRollbackInvoked = true;
        });
        eventHandled = true;
        t.deepEqual(
            event.updateResult.row,
            {
                testId : BigInt(4),
                testVal : BigInt(444),
            }
        );
    });

    await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE test (
                testId INT PRIMARY KEY,
                testVal INT
            );
            INSERT INTO
                test(testId, testVal)
            VALUES
                (1, 100),
                (2, 200),
                (3, 300);
        `);

        t.deepEqual(eventHandled, false);
        t.deepEqual(onCommitInvoked, false);
        t.deepEqual(onRollbackInvoked, false);

        await test.updateAndFetchZeroOrOneByCandidateKey(
            connection,
            {
                testId : BigInt(4),
            },
            () => {
                return {
                    testVal : BigInt(444),
                };
            }
        );

        t.deepEqual(eventHandled, false);
        t.deepEqual(onCommitInvoked, false);
        t.deepEqual(onRollbackInvoked, false);
    });

    t.deepEqual(eventHandled, false);
    t.deepEqual(onCommitInvoked, false);
    t.deepEqual(onRollbackInvoked, false);

    await pool
        .acquire(async (connection) => {
            return test.fetchOneByPrimaryKey(connection, { testId : BigInt(4) })
                .orUndefined();
        })
        .then((row) => {
            t.deepEqual(
                row,
                undefined
            );
        });

    t.end();
});
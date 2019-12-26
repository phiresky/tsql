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
    pool.onDelete.addHandler((event) => {
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
            event.deleteResult.deletedRowCount,
            BigInt(4)
        );
    });

    const insertResult = await pool.acquire(async (connection) => {
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

        const result = await connection.transaction(async (connection) => {

            t.deepEqual(eventHandled, false);
            t.deepEqual(onCommitInvoked, false);
            t.deepEqual(onRollbackInvoked, false);

            const result = await test.insertOne(
                connection,
                {
                    testId : BigInt(4),
                    testVal : BigInt(400),
                }
            );

            t.deepEqual(eventHandled, false);
            t.deepEqual(onCommitInvoked, false);
            t.deepEqual(onRollbackInvoked, false);

            await test.delete(
                connection,
                () => true
            );

            t.deepEqual(eventHandled, true);
            t.deepEqual(onCommitInvoked, false);
            t.deepEqual(onRollbackInvoked, false);

            return result;
        });

        t.deepEqual(eventHandled, true);
        t.deepEqual(onCommitInvoked, true);
        t.deepEqual(onRollbackInvoked, false);

        return result;
    });

    t.deepEqual(eventHandled, true);
    t.deepEqual(onCommitInvoked, true);
    t.deepEqual(onRollbackInvoked, false);

    t.deepEqual(
        insertResult.insertedRowCount,
        BigInt(1)
    );
    t.deepEqual(
        insertResult.autoIncrementId,
        undefined
    );
    t.deepEqual(
        insertResult.warningCount,
        BigInt(0)
    );

    await pool
        .acquire(async (connection) => {
            return test.fetchValue(
                connection,
                () => true,
                () => tsql.countAll()
            );
        })
        .then((row) => {
            t.deepEqual(
                row,
                BigInt(0)
            );
        });

    t.end();
});
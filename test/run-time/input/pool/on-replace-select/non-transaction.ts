import * as tm from "type-mapping";
import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    const src = tsql.table("src")
        .addColumns({
            testId : tm.mysql.bigIntUnsigned(),
            testVal : tm.mysql.bigIntUnsigned(),
        })
        .setPrimaryKey(columns => [columns.testId]);

    const test = tsql.table("test")
        .addColumns({
            testId : tm.mysql.bigIntUnsigned(),
            testVal : tm.mysql.bigIntUnsigned(),
        })
        .setPrimaryKey(columns => [columns.testId]);

    let eventHandled = false;
    let onCommitInvoked = false;
    let onRollbackInvoked = false;
    pool.onReplaceSelect.addHandler((event) => {
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
            Object.keys(event.replaceSelectRow),
            ["testId", "testVal"]
        );
    });

    const insertResult = await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE src (
                testId INT PRIMARY KEY,
                testVal INT
            );
            CREATE TABLE test (
                testId INT PRIMARY KEY,
                testVal INT
            );
            INSERT INTO
                src(testId, testVal)
            VALUES
                (1, 100),
                (2, 200),
                (3, 300);
            INSERT INTO
                test(testId, testVal)
            VALUES
                (2, 222),
                (4, 444);
        `);

        t.deepEqual(eventHandled, false);
        t.deepEqual(onCommitInvoked, false);
        t.deepEqual(onRollbackInvoked, false);

        const result = await tsql.from(src)
            .select(columns => [columns])
            .replace(
                connection,
                test,
                columns => columns
            );

        t.deepEqual(eventHandled, true);
        t.deepEqual(onCommitInvoked, false);
        t.deepEqual(onRollbackInvoked, false);

        return result;
    });

    t.deepEqual(eventHandled, true);
    t.deepEqual(onCommitInvoked, true);
    t.deepEqual(onRollbackInvoked, false);

    t.deepEqual(
        insertResult.insertedOrReplacedRowCount,
        BigInt(3)
    );
    t.deepEqual(
        insertResult.warningCount,
        BigInt(0)
    );

    await pool
        .acquire(async (connection) => {
            return tsql.from(test)
                .select(columns => [columns])
                .orderBy(columns => [
                    columns.testId.desc(),
                ])
                .fetchAll(connection);
        })
        .then((rows) => {
            t.deepEqual(
                rows,
                [
                    {
                        testId : BigInt(4),
                        testVal : BigInt(444),
                    },
                    {
                        testId : BigInt(3),
                        testVal : BigInt(300),
                    },
                    {
                        testId : BigInt(2),
                        testVal : BigInt(200),
                    },
                    {
                        testId : BigInt(1),
                        testVal : BigInt(100),
                    },
                ]
            );
        });

    await pool.disconnect();t.end();
});
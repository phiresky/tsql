import * as tape from "tape";
import * as tsql from "../../../../../../dist";
import {Pool} from "../../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());
    await pool.acquire(async (connection) => {
        await tsql.selectValue(() => tsql.double.neg(123.456))
            .fetchValue(connection)
            .then((value) => {
                t.deepEqual(value, -123.456);
            });
    });

    await pool.disconnect();
    t.end();
});

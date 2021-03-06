import * as tape from "tape";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";
import {appKey, browserAppKey, browserAppKeyTpt, createAppKeyTableSql} from "../app-key-example";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    const fetchOneResult = await pool.acquire(async (connection) => {
        await connection.exec(createAppKeyTableSql);

        const browserBase = await appKey.insertOne(
            connection,
            {
                appId : BigInt(1),
                appKeyTypeId : BigInt(2) as 2n,
                key : "browser",
                createdAt : new Date(0),
            }
        );
        await browserAppKey.insertOne(
            connection,
            {
                appKeyId : browserBase.appKeyId,
            }
        );

        return browserAppKeyTpt.fetchOneByPrimaryKey(
            connection,
            {
                appKeyId : BigInt(1),
            }
        );
    });

    t.deepEqual(
        fetchOneResult,
        {
            appKeyId: BigInt(1),
            appKeyTypeId: BigInt(2),
            referer: null,
            appId: BigInt(1),
            key: "browser",
            createdAt: new Date(0),
            disabledAt: null,
        }
    );

    await pool.disconnect();
    t.end();
});

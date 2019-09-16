import * as sql from "./sql";
import * as tape from "tape";
//import {log} from "../../../util";

tape(__filename, async (t) => {
    const sqlite = await sql.initSqlJs();
    const db = new sqlite.Database();
    const createTableResult = db.exec("CREATE TABLE testTable (a INT, b INT)");
    t.deepEqual(createTableResult, []);

    const insertResult = db.exec("INSERT INTO testTable (a, b) VALUES (1337, 9001)");
    t.deepEqual(insertResult, []);
    t.deepEqual(db.getRowsModified(), 1);

    const insertResult2 = db.exec(`
        INSERT INTO testTable (a, b) VALUES (1337, 9001);
        INSERT INTO testTable (a, b) VALUES (42, 24);
    `);
    t.deepEqual(insertResult2, []);
    t.deepEqual(db.getRowsModified(), 1);

    const insertResult3 = db.exec(`
        INSERT INTO testTable (a, b) VALUES (1337, 9001), (42, 42);
    `);
    t.deepEqual(insertResult3, []);
    t.deepEqual(db.getRowsModified(), 2);

    t.end();
});

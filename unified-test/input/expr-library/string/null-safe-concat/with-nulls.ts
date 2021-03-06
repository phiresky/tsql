import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql.selectValue(() => tsql.nullSafeConcat(null))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, "");
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql.selectValue(() => tsql.nullSafeConcat("a"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, "a");
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql.selectValue(() => tsql.nullSafeConcat(null, ""))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, "");
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql.selectValue(() => tsql.nullSafeConcat("", null))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, "");
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql.selectValue(() => tsql.nullSafeConcat(null, null))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, "");
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql.selectValue(() => tsql.nullSafeConcat(null, "a"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, "a");
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql.selectValue(() => tsql.nullSafeConcat("a", null))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, "a");
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql.selectValue(() => tsql.nullSafeConcat("a", null, "b"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, "ab");
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql.selectValue(() => tsql.nullSafeConcat("a", null, "b", null, "c"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, "abc");
                })
                .catch((err) => {
                    t.fail(err.message);
                });
        });

        t.end();
    });
};

import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const arr = [
                0.5,
                1,
                1.1,
                10,
                10.3141,
                20,
                20.6282,
                30,
            ];
            for (const a of arr) {
                await tsql.selectValue(() => tsql.double.ln(-a))
                    .fetchValue(connection)
                    .then((value) => {
                        const expected = null;
                        t.deepEqual(
                            value,
                            expected,
                            `LN(${-a}) ~= ${expected} ~/= ${value}`
                        );
                    })
                    .catch((err) => {
                        //@todo Cannot take logarithm of negative number error
                        t.fail(err.message);
                    });
            }
        });

        t.end();
    });
};

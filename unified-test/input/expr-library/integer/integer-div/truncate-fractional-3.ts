import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql
                .selectValue(() => tsql.integer.integerDiv(
                    BigInt("9223372036854775807"),
                    BigInt(3)
                ))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, BigInt("3074457345618258602"));
                });

            await tsql
                .selectValue(() => tsql.integer.integerDiv(
                    BigInt("-9223372036854775807"),
                    BigInt(3)
                ))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, BigInt("-3074457345618258602"));
                });

            await tsql
                .selectValue(() => tsql.integer.integerDiv(
                    BigInt("9223372036854775807"),
                    BigInt(-3)
                ))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, BigInt("-3074457345618258602"));
                });

            await tsql
                .selectValue(() => tsql.integer.integerDiv(
                    BigInt("-9223372036854775807"),
                    BigInt(-3)
                ))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, BigInt("3074457345618258602"));
                });

        });

        t.end();
    });
};
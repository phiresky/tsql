import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        const resultSet = await pool.acquire((connection) => {
            return tsql.selectValue(() => 42)
                .map(async (row) => {
                    return {
                        x : row.$aliased.value + 58,
                    };
                })
                .fetchAllMapped(
                    connection
                );
        });
        t.deepEqual(
            resultSet,
            [
                {
                    x : 100,
                }
            ]
        );

        t.end();
    });
};

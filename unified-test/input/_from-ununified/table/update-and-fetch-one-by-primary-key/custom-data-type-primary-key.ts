import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";
import {dtPoint} from "../../dt-point";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        const test = tsql.table("test")
            .addColumns({
                testId : dtPoint,
                testVal : dtPoint,
            })
            .setPrimaryKey(columns => [columns.testId])
            .addAllMutable();

        const updateAndFetchResult = await pool.acquire(async (connection) => {
            await createTemporarySchema(
                connection,
                {
                    tables : [
                        {
                            tableAlias : "test",
                            columns : [
                                {
                                    columnAlias : "testId",
                                    dataType : {
                                        typeHint : tsql.TypeHint.STRING,
                                    },
                                },
                                {
                                    columnAlias : "testVal",
                                    dataType : {
                                        typeHint : tsql.TypeHint.STRING,
                                    },
                                },
                            ],
                            primaryKey : {
                                multiColumn : false,
                                columnAlias : "testId",
                                autoIncrement : false,
                            },
                        }
                    ]
                }
            );

            await test.insertAndFetch(
                connection,
                {
                    testId : {
                        x : 100,
                        y : 200,
                    },
                    testVal : {
                        x : 1,
                        y : 2,
                    },
                }
            );

            return test
                .whereEqPrimaryKey({
                    testId : {
                        x : 100,
                        y : 200,
                    },
                })
                .updateAndFetchOne(
                    connection,
                    () => {
                        return {
                            testId : {
                                x : 1001,
                                y : 2001,
                            },
                            testVal : {
                                x : 111,
                                y : 222,
                            }
                        };
                    }
                );
        });
        t.deepEqual(
            updateAndFetchResult.row,
            {
                testId : {
                    x : 1001,
                    y : 2001,
                },
                testVal : {
                    x : 111,
                    y : 222,
                },
            }
        );

        await pool
            .acquire(async (connection) => {
                return test.whereEqCandidateKey({
                        testId : {
                            x : 1001,
                            y : 2001,
                        }
                    }).fetchOne(connection);
            })
            .then((row) => {
                t.deepEqual(
                    row,
                    {
                        testId : {
                            x : 1001,
                            y : 2001,
                        },
                        testVal : {
                            x : 111,
                            y : 222,
                        },
                    }
                );
            });

        t.end();
    });
};

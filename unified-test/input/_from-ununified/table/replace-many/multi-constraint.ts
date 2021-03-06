import * as tm from "type-mapping";
import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        const test = tsql.table("test")
            .addColumns({
                testId : tm.mysql.bigIntUnsigned(),
                testVal : tm.mysql.bigIntUnsigned(),
            })
            .setPrimaryKey(columns => [columns.testId]);

        const insertResult = await pool.acquire(async (connection) => {
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
                                        typeHint : tsql.TypeHint.BIGINT_SIGNED,
                                    },
                                },
                                {
                                    columnAlias : "testVal",
                                    dataType : {
                                        typeHint : tsql.TypeHint.BIGINT_SIGNED,
                                    },
                                },
                            ],
                            primaryKey : {
                                multiColumn : false,
                                columnAlias : "testId",
                                autoIncrement : false,
                            },
                            candidateKeys : [
                                ["testVal"],
                            ],
                        }
                    ]
                }
            );

            await test
                .enableExplicitAutoIncrementValue()
                .insertMany(
                    connection,
                    [
                        {
                            testId : BigInt(1),
                            testVal : BigInt(100),
                        },
                        {
                            testId : BigInt(2),
                            testVal : BigInt(200),
                        },
                        {
                            testId : BigInt(3),
                            testVal : BigInt(300),
                        },
                        {
                            testId : BigInt(4),
                            testVal : BigInt(444),
                        },
                        {
                            testId : BigInt(7),
                            testVal : BigInt(777),
                        },
                    ]
                );

            return test.replaceMany(
                connection,
                [
                    {
                        testId : BigInt(5),
                        testVal : BigInt(444),
                    },
                    {
                        testId : BigInt(1),
                        testVal : BigInt(111),
                    },
                    {
                        testId : BigInt(6),
                        testVal : BigInt(666),
                    },
                    {
                        testId : BigInt(5),
                        testVal : BigInt(444),
                    },
                    {
                        testId : BigInt(2),
                        testVal : BigInt(300),
                    },
                    {
                        testId : BigInt(7),
                        testVal : BigInt(777),
                    },
                ]
            );
        });
        t.deepEqual(
            insertResult.insertedOrReplacedRowCount,
            BigInt(6)
        );
        t.deepEqual(
            insertResult.warningCount,
            BigInt(0)
        );

        await pool
            .acquire(async (connection) => {
                return tsql
                    .from(test)
                    .select(columns => [columns])
                    .orderBy(columns => [
                        columns.testId.asc(),
                    ])
                    .fetchAll(connection);
            })
            .then((rows) => {
                t.deepEqual(
                    rows,
                    [
                        {
                            testId : BigInt(1),
                            testVal : BigInt(111),
                        },
                        {
                            testId : BigInt(2),
                            testVal : BigInt(300),
                        },
                        {
                            testId : BigInt(5),
                            testVal : BigInt(444),
                        },
                        {
                            testId : BigInt(6),
                            testVal : BigInt(666),
                        },
                        {
                            testId : BigInt(7),
                            testVal : BigInt(777),
                        },
                    ]
                );
            });

        t.end();
    });
};

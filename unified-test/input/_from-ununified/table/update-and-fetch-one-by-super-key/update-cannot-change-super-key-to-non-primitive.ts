import * as tm from "type-mapping";
import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        const dst = tsql.table("dst")
            .addColumns({
                testId : tm.mysql.bigIntUnsigned(),
                testVal : tm.mysql.bigIntUnsigned().orNull(),
            })
            .setPrimaryKey(columns => [columns.testId])
            .addMutable(columns => [
                columns.testId,
            ]);

        await pool.acquire(async (connection) => {
            await createTemporarySchema(
                connection,
                {
                    tables : [
                        {
                            tableAlias : "dst",
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
                        }
                    ]
                }
            );

            await dst
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
                    ]
                );

            return dst
                .whereEqSuperKey({
                    testId : BigInt(1),
                })
                .updateAndFetchOne(
                    connection,
                    () => {
                        return {
                            testId : tsql.ExprUtil.fromBuiltInExpr(BigInt(123456)),
                        };
                    }
                );
        });

        await pool
            .acquire(async (connection) => {
                return tsql.from(dst)
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
                            testId : BigInt(2),
                            testVal : BigInt(200),
                        },
                        {
                            testId : BigInt(3),
                            testVal : BigInt(300),
                        },
                        {
                            testId : BigInt(123456),
                            testVal : BigInt(100),
                        },
                    ]
                );
            });

        t.end();
    });
};

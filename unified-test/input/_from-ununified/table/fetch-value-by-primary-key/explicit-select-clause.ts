import * as tm from "type-mapping";
import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        const myTable = tsql.table("myTable")
            .addColumns({
                myTableId : tm.mysql.bigIntSigned(),
                createdAt : tm.mysql.dateTime(),
            })
            .setPrimaryKey(columns => [columns.myTableId]);

        await pool.acquire(async (connection) => {
            await createTemporarySchema(
                connection,
                {
                    tables : [
                        {
                            tableAlias : "myTable",
                            columns : [
                                {
                                    columnAlias : "myTableId",
                                    dataType : {
                                        typeHint : tsql.TypeHint.BIGINT_SIGNED,
                                    },
                                },
                                {
                                    columnAlias : "createdAt",
                                    dataType : {
                                        typeHint : tsql.TypeHint.DATE_TIME,
                                    },
                                },
                            ],
                            primaryKey : {
                                multiColumn : false,
                                columnAlias : "myTableId",
                                autoIncrement : false,
                            },
                        }
                    ]
                }
            );

            await myTable
                .enableExplicitAutoIncrementValue()
                .insertMany(
                    connection,
                    [
                        {
                            myTableId : BigInt(1),
                            createdAt : new Date("2015-01-01T00:00:00.000Z"),
                        },
                        {
                            myTableId : BigInt(2),
                            createdAt : new Date("2015-01-02T00:00:00.000Z"),
                        },
                        {
                            myTableId : BigInt(3),
                            createdAt : new Date("2015-01-03T00:00:00.000Z"),
                        },
                    ]
                );

            await myTable
                .whereEqPrimaryKey(
                    {
                        myTableId : BigInt(1),
                    }
                )
                .fetchValue(
                    connection,
                    columns => columns.myTableId
                )
                .then((row) => {
                    t.deepEqual(
                        row,
                        BigInt(1)
                    );
                })
                .catch(() => {
                    t.fail("Should exist");
                });

            await myTable
                .whereEqPrimaryKey(
                    {
                        myTableId : BigInt(1),
                    }
                )
                .fetchValue(
                    connection,
                    columns => tsql.integer.add(columns.myTableId, BigInt(45))
                )
                .then((row) => {
                    t.deepEqual(
                        row,
                        BigInt(46)
                    );
                })
                .catch(() => {
                    t.fail("Should exist");
                });

            await myTable
                .whereEqPrimaryKey(
                    {
                        myTableId : BigInt(1),
                    }
                )
                .fetchValue(
                    connection,
                    columns => tsql.timestampAddDay(BigInt(1), columns.createdAt)
                )
                .then((row) => {
                    t.deepEqual(
                        row,
                        new Date("2015-01-02T00:00:00.000Z")
                    );
                })
                .catch(() => {
                    t.fail("Should exist");
                });

            await myTable.where(() => true).delete(connection);

            await myTable
                .whereEqPrimaryKey(
                    {
                        myTableId : BigInt(1),
                    }
                )
                .fetchValue(
                    connection,
                    columns => columns.myTableId
                )
                .then(() => {
                    t.fail("Should not exist");
                })
                .catch(() => {
                    t.pass();
                });

            await myTable
                .whereEqPrimaryKey(
                    {
                        myTableId : BigInt(1),
                    }
                )
                .fetchValue(
                    connection,
                    columns => tsql.integer.add(columns.myTableId, BigInt(45))
                )
                .then(() => {
                    t.fail("Should not exist");
                })
                .catch(() => {
                    t.pass();
                });

            await myTable
                .whereEqPrimaryKey(
                    {
                        myTableId : BigInt(1),
                    }
                )
                .fetchValue(
                    connection,
                    columns => tsql.timestampAddDay(BigInt(1), columns.createdAt)
                )
                .then(() => {
                    t.fail("Should not exist");
                })
                .catch(() => {
                    t.pass();
                });

        });

        t.end();
    });
};

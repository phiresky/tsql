import * as tm from "type-mapping";
import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        const myTable = tsql.table("myTable")
            .addColumns({
                myTableId : tm.mysql.bigIntSigned(),
                myTableVal : tm.mysql.bigIntSigned(),
            });

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
                                    columnAlias : "myTableVal",
                                    dataType : {
                                        typeHint : tsql.TypeHint.BIGINT_SIGNED,
                                    },
                                },
                            ],
                        },
                    ]
                }
            );

            await myTable.insertMany(
                connection,
                [
                    {
                        myTableId : BigInt(1),
                        myTableVal : BigInt(100),
                    },
                    {
                        myTableId : BigInt(2),
                        myTableVal : BigInt(200),
                    },
                    {
                        myTableId : BigInt(3),
                        myTableVal : BigInt(300),
                    },
                    {
                        myTableId : BigInt(4),
                        myTableVal : BigInt(400),
                    },
                ]
            );
            await tsql.from(myTable)
                .where(columns => tsql.notInArray(
                    columns.myTableId,
                    [
                        BigInt(1),
                        BigInt(4),
                    ]
                ))
                .select(columns => [columns])
                .orderBy(columns => [
                    columns.myTableId.desc(),
                ])
                .fetchAll(connection)
                .then((rows) => {
                    t.deepEqual(
                        rows,
                        [
                            {
                                myTableId : BigInt(3),
                                myTableVal : BigInt(300),
                            },
                            {
                                myTableId : BigInt(2),
                                myTableVal : BigInt(200),
                            },
                        ]
                    );
                })
                .catch((err) => {
                    t.fail(err.message);
                });
        });

        t.end();
    });
};

import * as tm from "type-mapping";
import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        const myTable = tsql.table("myTable")
            .addColumns({
                col1 : tm.mysql.bigIntSigned().orNull(),
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
                                    columnAlias : "col1",
                                    dataType : {
                                        typeHint : tsql.TypeHint.BIGINT_SIGNED,
                                    },
                                    nullable : true,
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
                        col1 : BigInt(1),
                    },
                    {
                        col1 : BigInt(2),
                    },
                ]
            );
            await tsql.from(myTable)
                .where(() => tsql.eqColumns(
                    myTable,
                    {}
                ))
                .orderBy(columns => [
                    columns.col1.asc(),
                ])
                .select(columns => [columns])
                .fetchAll(connection)
                .then((rows) => {
                    t.deepEqual(
                        rows,
                        [
                            {
                                col1 : BigInt(1),
                            },
                            {
                                col1 : BigInt(2),
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
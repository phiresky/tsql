import * as tm from "type-mapping";
import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        const myTable = tsql.table("myTable")
            .addColumns({
                myTableId : tm.mysql.bigIntSigned().orNull(),
                myTableVal : tm.mysql.bigIntSigned(),
            })
            .addCandidateKey(columns => [
                columns.myTableId,
            ]);

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
                                    nullable : true,
                                },
                                {
                                    columnAlias : "myTableVal",
                                    dataType : {
                                        typeHint : tsql.TypeHint.BIGINT_SIGNED,
                                    },
                                },
                            ],
                            candidateKeys : [
                                ["myTableId"],
                            ],
                        },
                    ]
                }
            );

            await myTable.insertMany(
                connection,
                [
                    {
                        myTableId : BigInt(-1),
                        myTableVal : BigInt(-100),
                    },
                    {
                        myTableId : BigInt(0),
                        myTableVal : BigInt(0),
                    },
                    {
                        myTableId : BigInt(1),
                        myTableVal : BigInt(100),
                    },
                    {
                        myTableId : null,
                        myTableVal : BigInt(100),
                    },
                ]
            );
            for (let i=-4; i<=-2; ++i) {
                await myTable
                    .where(columns => tsql.nullSafeEq(
                        columns.myTableId,
                        BigInt(i)
                    ))
                    .fetchOne(connection)
                    .orUndefined()
                    .then((row) => {
                        t.deepEqual(
                            row,
                            undefined
                        );
                    })
                    .catch((err) => {
                        t.fail(err.message);
                    });
            }
        });

        t.end();
    });
};

import * as tm from "type-mapping";
import * as tsql from "../../../../../dist";

const test = tsql.table("test")
    .addColumns({
        testId : tm.mysql.bigIntUnsigned(),
        testVal : tm.mysql.bigIntUnsigned(),
    });

export const p = tsql.ExecutionUtil.insertOne(
    test,
    null as any,
    {
        testId : BigInt(5),
        //testVal : BigInt(400),
    }
);

export const p2 = tsql.ExecutionUtil.insertOne(
    test,
    null as any,
    {
        //testId : BigInt(5),
        testVal : BigInt(400),
    }
);

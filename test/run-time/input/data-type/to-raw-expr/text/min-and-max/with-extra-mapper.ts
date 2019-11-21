import * as tm from "type-mapping";
import * as tape from "tape";
import * as tsql from "../../../../../../../dist";

tape(__filename, async (t) => {

    try {
        tsql.DataTypeUtil.toRawExpr(
            tsql.dtVarChar(2, 5, tm.subStringBlacklist(["*"])),
            "" as any
        );
        t.fail("Should fail");
    } catch (err) {
        const expectedMeta = (err as tm.MappingError).expectedMeta!;
        t.deepEqual(
            expectedMeta.errorCode,
            "EXPECTED_LENGTH"
        );
        t.deepEqual(
            expectedMeta.min,
            2
        );
        t.deepEqual(
            expectedMeta.max,
            5
        );
    }
    try {
        tsql.DataTypeUtil.toRawExpr(
            tsql.dtVarChar(2, 5, tm.subStringBlacklist(["*"])),
            "a" as any
        );
        t.fail("Should fail");
    } catch (err) {
        const expectedMeta = (err as tm.MappingError).expectedMeta!;
        t.deepEqual(
            expectedMeta.errorCode,
            "EXPECTED_LENGTH"
        );
        t.deepEqual(
            expectedMeta.min,
            2
        );
        t.deepEqual(
            expectedMeta.max,
            5
        );
    }
    t.deepEqual(
        (
            tsql.DataTypeUtil.toRawExpr(
                tsql.dtVarChar(2, 5, tm.subStringBlacklist(["*"])),
                "ab" as any
            )
        ),
        "ab"
    );
    t.deepEqual(
        (
            tsql.DataTypeUtil.toRawExpr(
                tsql.dtVarChar(2, 5, tm.subStringBlacklist(["*"])),
                "abc" as any
            )
        ),
        "abc"
    );
    t.deepEqual(
        (
            tsql.DataTypeUtil.toRawExpr(
                tsql.dtVarChar(2, 5, tm.subStringBlacklist(["*"])),
                "abcd" as any
            )
        ),
        "abcd"
    );
    t.deepEqual(
        (
            tsql.DataTypeUtil.toRawExpr(
                tsql.dtVarChar(2, 5, tm.subStringBlacklist(["*"])),
                "abcde" as any
            )
        ),
        "abcde"
    );

    try {
        tsql.DataTypeUtil.toRawExpr(
            tsql.dtVarChar(2, 5, tm.subStringBlacklist(["*"])),
            "abcdef" as any
        );
        t.fail("Should fail");
    } catch (err) {
        const expectedMeta = (err as tm.MappingError).expectedMeta!;
        t.deepEqual(
            expectedMeta.errorCode,
            "EXPECTED_LENGTH"
        );
        t.deepEqual(
            expectedMeta.min,
            2
        );
        t.deepEqual(
            expectedMeta.max,
            5
        );
    }

    try {
        tsql.DataTypeUtil.toRawExpr(
            tsql.dtVarChar(2, 5, tm.subStringBlacklist(["*"])),
            "a*" as any
        );
        t.fail("Should fail");
    } catch (err) {
        const expected = (err as tm.MappingError).expected!;
        t.deepEqual(
            expected,
            `not "*"`
        );
    }

    try {
        tsql.DataTypeUtil.toRawExpr(
            tsql.dtVarChar(2, 5, tm.subStringBlacklist(["*"])),
            "a**" as any
        );
        t.fail("Should fail");
    } catch (err) {
        const expected = (err as tm.MappingError).expected!;
        t.deepEqual(
            expected,
            `not "*"`
        );
    }

    t.end();
});
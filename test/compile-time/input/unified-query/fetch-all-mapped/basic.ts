import * as tsql from "../../../../../dist";

export const resultSet = tsql.selectValue(() => 42)
    .map((row) => {
        return {
            x : row.$aliased.value + 58,
        };
    })
    .fetchAllMapped(
        null as any
    );

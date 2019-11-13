import {ILog, LogData} from "../../log";
import {Log} from "../../log-impl";
import {TableUtil} from "../../../table";
import {RawExprNoUsedRef, RawExprUtil} from "../../../raw-expr";
import {PrimitiveExprUtil} from "../../../primitive-expr";
import {UsedRefUtil} from "../../../used-ref";
import {Identity} from "../../../type-util";

export type LogMustSetTrackedDefaultsData =
    & Pick<
        LogData,
        | "logTable"
        | "ownerTable"
        | "tracked"
        | "doNotCopy"
        | "copy"
        | "latestOrder"
    >
    & Pick<
        ILog,
        | "copyDefaultsDelegate"
    >
;
export type TrackedDefaults<
    DataT extends LogMustSetTrackedDefaultsData
> =
    Identity<{
        readonly [columnAlias in (
            DataT["tracked"][number]
        )] : (
            | undefined
            | RawExprNoUsedRef<
                TableUtil.ColumnType<DataT["logTable"], columnAlias>
            >
        )
    }>
;
export type SetTrackedDefaults<
    DataT extends LogMustSetTrackedDefaultsData,
    TrackedDefaultsT extends TrackedDefaults<DataT>
> =
    Log<{
        tracked : DataT["tracked"];
        doNotCopy : DataT["doNotCopy"];
        copy : DataT["copy"];
        trackedWithDefaultValue : readonly Extract<
            {
                [columnAlias in keyof TrackedDefaultsT] : (
                    undefined extends TrackedDefaultsT[columnAlias] ?
                    never :
                    columnAlias
                )
            }[keyof TrackedDefaultsT],
            DataT["tracked"][number]
        >[];

        logTable : DataT["logTable"];
        ownerTable : DataT["ownerTable"];

        latestOrder : DataT["latestOrder"];
    }>
;

export function setTrackedDefaults<
    DataT extends LogMustSetTrackedDefaultsData,
    TrackedDefaultsT extends TrackedDefaults<DataT>
> (
    log : DataT,
    rawTrackedDefaults : TrackedDefaults<DataT>
) : (
    SetTrackedDefaults<
        DataT,
        TrackedDefaultsT
    >
) {
    /**
     * Nothing is allowed
     */
    const allowedRef = UsedRefUtil.fromColumnRef({});

    const trackedDefaults : any = {};
    for (const columnAlias of log.tracked) {
        const rawValue = (rawTrackedDefaults as any)[columnAlias];
        if (rawValue === undefined) {
            continue;
        }

        const usedRef = RawExprUtil.usedRef(rawValue);
        UsedRefUtil.assertAllowed(allowedRef, usedRef);

        const value = (
            PrimitiveExprUtil.isPrimitiveExpr(rawValue) ?
            log.logTable.columns[columnAlias].mapper(
                `${log.logTable.alias}.${columnAlias}`,
                rawValue
            ) :
            rawValue
        );

        trackedDefaults[columnAlias] = value;
    }
    const {
        logTable,
        ownerTable,
        latestOrder,
        tracked,
        doNotCopy,
        copy,
        copyDefaultsDelegate,
    } = log;
    return new Log<{
        tracked : DataT["tracked"];
        doNotCopy : DataT["doNotCopy"];
        copy : DataT["copy"];
        trackedWithDefaultValue : readonly Extract<
            {
                [columnAlias in keyof TrackedDefaultsT] : (
                    undefined extends TrackedDefaultsT[columnAlias] ?
                    never :
                    columnAlias
                )
            }[keyof TrackedDefaultsT],
            DataT["tracked"][number]
        >[];

        logTable : DataT["logTable"];
        ownerTable : DataT["ownerTable"];

        latestOrder : DataT["latestOrder"];
    }>(
        {
            tracked,
            doNotCopy,
            copy,
            trackedWithDefaultValue : Object.keys(trackedDefaults) as any,

            logTable,
            ownerTable,
            latestOrder,
        },
        {
            copyDefaultsDelegate,
            trackedDefaults,
        }
    );
}

export class LogMustSetTrackedDefaults<DataT extends LogMustSetTrackedDefaultsData> {
    readonly logTable : DataT["logTable"];
    readonly ownerTable : DataT["ownerTable"];
    readonly latestOrder : DataT["latestOrder"];
    readonly tracked : DataT["tracked"];
    readonly doNotCopy : DataT["doNotCopy"];
    readonly copy : DataT["copy"];
    readonly copyDefaultsDelegate : DataT["copyDefaultsDelegate"];

    constructor (data : DataT) {
        this.logTable = data.logTable;
        this.ownerTable = data.ownerTable;
        this.latestOrder = data.latestOrder;
        this.tracked = data.tracked;
        this.doNotCopy = data.doNotCopy;
        this.copy = data.copy;
        this.copyDefaultsDelegate = data.copyDefaultsDelegate;
    }

    setTrackedDefaults<
        TrackedDefaultsT extends TrackedDefaults<DataT>
    > (
        rawTrackedDefaults : TrackedDefaultsT
    ) : (
        SetTrackedDefaults<
            DataT,
            TrackedDefaultsT
        >
    ) {
        return setTrackedDefaults(
            this as DataT,
            rawTrackedDefaults
        );
    }
}
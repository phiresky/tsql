import {IConnection, ITransactionConnection} from "../connection";
import {ITable} from "../../table";
import {IPoolEventEmitter, IInsertOneEvent, IUpdateEvent, IDeleteEvent} from "../../event";
import {IUpdateAndFetchEvent} from "../../event/update-and-fetch-event";

export type ConnectionCallback<ResultT> = (
    (connection : IConnection) => Promise<ResultT>
);
export type TransactionCallback<ResultT> = (
    (connection : ITransactionConnection) => Promise<ResultT>
);
/*
    All connections **should** set @@SESSION.time_zone to "+00:00"
*/
export interface IPool {
    acquire<ResultT> (
        callback : ConnectionCallback<ResultT>
    ) : Promise<ResultT>;

    acquireTransaction<ResultT> (
        callback : TransactionCallback<ResultT>
    ) : Promise<ResultT>;

    disconnect () : Promise<void>;

    readonly onInsertOne : IPoolEventEmitter<IInsertOneEvent<ITable>>;

    readonly onUpdate : IPoolEventEmitter<IUpdateEvent<ITable>>;
    readonly onUpdateAndFetch : IPoolEventEmitter<IUpdateAndFetchEvent<ITable>>;

    readonly onDelete : IPoolEventEmitter<IDeleteEvent<ITable>>;
}

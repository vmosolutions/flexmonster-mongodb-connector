import { QueryBuilder } from "../query/builder/QueryBuilder";
import { MongoQueryExecutor } from "../query/MongoQueryExecutor";
import { PagingInterface} from "../api/IDataAPI";
import { MongoResponseParser } from "../parsers/MongoResponseParser";
import {IApiRequest} from "../requests/apiRequests/IApiRequest";
import { Db } from "mongodb";
import { APISchema } from "../schema/APISchema";

interface IGetRegisteredRequest {
    (key: string): Promise<IApiRequest> | IApiRequest;
}

interface IIsRequestRegistered {
    (key: string): Promise<boolean> | Boolean;
}

interface ILoadData {
    (dbo: Db, schema: APISchema, apiRequest: IApiRequest, currentPage: PagingInterface): any;
}

interface IInitRequestHandler {
    (queryBuilder: QueryBuilder, queryExecutor: MongoQueryExecutor, responseParser : MongoResponseParser) : void;
}

interface IInjectDb {
    (dbo: Db) : void;
}

export  interface IRequestHandler {
    init : IInitRequestHandler;
    loadData :ILoadData;
    isRequestRegistered : IIsRequestRegistered;
    getRegisteredRequest :IGetRegisteredRequest;
    injectDb : IInjectDb;
}

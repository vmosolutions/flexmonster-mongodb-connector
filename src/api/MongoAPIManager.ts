import {Db} from 'mongodb';
import {MongoQueryExecutor} from '../query/MongoQueryExecutor';
import {MongoResponseParser} from '../parsers/MongoResponseParser';
import {QueryBuilder} from '../query/builder/QueryBuilder';
import {IDataAPI, CollectionName, PagingInterface} from './IDataAPI';
import { APISchema } from '../schema/APISchema';
import {IApiRequest} from "../requests/apiRequests/IApiRequest";
import {MembersApiRequest} from "../requests/apiRequests/impl/MembersApiRequest";
import { AggregationApiRequest } from '../requests/apiRequests/impl/AggregationApiRequest';
import { DrillThroughApiRequest } from '../requests/apiRequests/impl/DrillThroughApiRequest';
import { FlatApiRequest } from '../requests/apiRequests/impl/FlatApiRequest';
import { IRequestHandler } from '../handler/IRequestHandler';

export class MongoAPIManager implements IDataAPI{

    private _mongoQueryManager: MongoQueryExecutor;
    private _mongoResponseParser: MongoResponseParser;
    private _queryBuilder: QueryBuilder;
    private _dataLoader: IRequestHandler;
    private _mongoResultParser: MongoResponseParser;
    private _schemaCache: {[index: string]: APISchema};
    
    constructor(requestHandler: IRequestHandler) {
        this._mongoQueryManager = new MongoQueryExecutor();
        this._mongoResponseParser = MongoResponseParser.getInstance();
        this._mongoResultParser = MongoResponseParser.getInstance();
        this._queryBuilder = QueryBuilder.getInstance();
        this._dataLoader = requestHandler;
        this._dataLoader.init(this._queryBuilder, this._mongoQueryManager, this._mongoResultParser);
        this._schemaCache = {};
    }

    /**
     * Returns the schema 
     * @method
     * @param {string} index MongoDB's collection name
     * @return {object} returns schema object
     */
    public async getSchema(dbo: Db, index: string): Promise<APISchema> {
        if (typeof index != 'string') throw new Error("Incorrect index format");
        this._mongoQueryManager.injectDBConnection(dbo);
        if (this._schemaCache[index] == null) {
            let document: any = await this._mongoQueryManager.runShemaQuery(index);
            this._schemaCache[index] = this._mongoResponseParser.parseShemaFromDocument(document);
        }
        return this._schemaCache[index].toJSON();
    }

    /**
     * Returns the members of the field 
     * @method
     * @param {string} index MongoDB's collection name
     * @param {any} fieldObject field's name
     * @param {number} page
     * @return {object}
     */
    public async getMembers(dbo: Db, index: CollectionName, fieldObject: any, pagingObject: PagingInterface): Promise<any> {
        this._dataLoader.injectDb(dbo);

        let apiRequest: IApiRequest = (pagingObject.pageToken != null && await Promise.resolve(this._dataLoader.isRequestRegistered(pagingObject.pageToken)))
            ? await Promise.resolve(this._dataLoader.getRegisteredRequest(pagingObject.pageToken))
            : new MembersApiRequest({index: index, fieldObject: fieldObject})
        return this._dataLoader.loadData(dbo, await this.getIndexSchema(dbo, index), apiRequest, pagingObject);
    }

    /**
     * Returns calculations
     * @method
     * @param {string} index MongoDB's collection name
     * @param {object} query 
     * @param {number} page
     * @return {object}
     */
    public async getSelectResult(dbo: Db, index: CollectionName, query: any, pagingObject: PagingInterface) {

        let response = null;
        const schema = await this.getIndexSchema(dbo, index);
        this._dataLoader.injectDb(dbo);

        if (query["aggs"] != null && query["fields"] == null) {

            let apiRequest: IApiRequest = (pagingObject.pageToken != null && await Promise.resolve(this._dataLoader.isRequestRegistered(pagingObject.pageToken)))
                ? await Promise.resolve(this._dataLoader.getRegisteredRequest(pagingObject.pageToken))
                : new AggregationApiRequest({index: index, query: query});
            response = this._dataLoader.loadData(dbo, schema, apiRequest, pagingObject);

        } else if (query["aggs"] == null && query["fields"] != null) {//drill-through

            let apiRequest: IApiRequest = (pagingObject.pageToken != null && await Promise.resolve(this._dataLoader.isRequestRegistered(pagingObject.pageToken)))
                ? await Promise.resolve(this._dataLoader.getRegisteredRequest(pagingObject.pageToken))
                : new DrillThroughApiRequest({index: index, query: query})
            response = this._dataLoader.loadData(dbo, schema, apiRequest, pagingObject);
        } else if (query["aggs"] != null && query["fields"] != null) {// flat-form

            let apiRequest: IApiRequest = (pagingObject.pageToken != null && await Promise.resolve(this._dataLoader.isRequestRegistered(pagingObject.pageToken)))
                ? await Promise.resolve(this._dataLoader.getRegisteredRequest(pagingObject.pageToken))
                : new FlatApiRequest({index: index, query: query})
            response = this._dataLoader.loadData(dbo, schema, apiRequest, pagingObject);
        }

        return response;
    }

    private async getIndexSchema(dbo: Db, index: string): Promise<APISchema> {
        if (typeof index != 'string') throw new Error("Incorrect index format");
        this._mongoQueryManager.injectDBConnection(dbo);
        if (this._schemaCache[index] == null) {
            let document: any = await this._mongoQueryManager.runShemaQuery(index);
            this._schemaCache[index] = this._mongoResponseParser.parseShemaFromDocument(document);
        }
        return this._schemaCache[index];
    }
}
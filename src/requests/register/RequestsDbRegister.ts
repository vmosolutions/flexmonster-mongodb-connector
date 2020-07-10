import { IRegister} from './IRegister';
import { IApiRequest } from '../apiRequests/IApiRequest';
import { IKeyRegister } from './IKeyRegister';
import { Db } from 'mongodb';
import { AggregationApiRequest } from '../apiRequests/impl/AggregationApiRequest';
import { AbstractApiRequest } from '../apiRequests/impl/AbstractApiRequest';
import { FlatApiRequest } from '../apiRequests/impl/FlatApiRequest';
import { MembersApiRequest } from '../apiRequests/impl/MembersApiRequest';

type Request = RequestsRegisterElement<IApiRequest>;

enum RequestType {
    "AggregationApiRequest", "FlatApiRequest", "MembersApiRequest"
}

export class RequestsDbRegister implements IRegister<string, IApiRequest> {    
    
    private static readonly _collectionName = 'flexmonsterRequests';

    private static _requestRegisterInstance: RequestsDbRegister = null;
    private static _dbo: Db;
    
    constructor() {
    }

    isEmpty(): boolean {
       return false;
    }

    public static getInstance(): RequestsDbRegister {
        if (RequestsDbRegister._requestRegisterInstance == null) {
            RequestsDbRegister._requestRegisterInstance = new RequestsDbRegister();
        }
        return RequestsDbRegister._requestRegisterInstance;
    }

    public injectDBConnection(mongoDBInstance: Db) {
        RequestsDbRegister._dbo = mongoDBInstance;
    }

    async addItem(key: string, item: IApiRequest): Promise<void> {
        if (item == null || key == null) throw new Error("Illegal argument exception");

        let type :RequestType | null = null;
        if(item instanceof AggregationApiRequest) {
            type = RequestType.AggregationApiRequest;
        }
        else if(item instanceof FlatApiRequest) {
            type = RequestType.FlatApiRequest;
        }
        else if(item instanceof MembersApiRequest) {
            type = RequestType.MembersApiRequest;
        }
          
        await RequestsDbRegister._dbo.collection(RequestsDbRegister._collectionName).insertOne({key, element: item, lastProcessed: new Date().getTime(), type }, { w: 1 });
        
    }    
    
    async hasItem(key: string): Promise<boolean> {
        if (key == null) throw new Error("Illegal argument exception");
        const cnt = await RequestsDbRegister._dbo.collection(RequestsDbRegister._collectionName).find({ "key": key}).limit(1).count(true);
        return cnt > 0;
    }

    async getItem(key: string): Promise<IApiRequest> {
        if (key == null) throw new Error("Illegal argument exception");
        const retObj = await RequestsDbRegister._dbo.collection(RequestsDbRegister._collectionName).findOne({"key": key}) as any;

        return this.convertFromType(retObj);
    }

    async deleteItem(key: string): Promise<IApiRequest> {
        if (key == null) throw new Error("Illegal argument exception");

        let apiRequest: IApiRequest = null;
        const result = await RequestsDbRegister._dbo.collection(RequestsDbRegister._collectionName).findOneAndDelete({"key": key}) as any;
        if(result) {
            apiRequest = this.convertFromType(result);
        }
        return apiRequest;
    }

    private convertFromType(req: any) : AggregationApiRequest | AbstractApiRequest | FlatApiRequest | MembersApiRequest | null
    {
        switch( req.type) {
            case RequestType.AggregationApiRequest: 
            return Object.assign(new AggregationApiRequest(req.element._requestArgument), req.element);
            case RequestType.FlatApiRequest: 
            return Object.assign(new FlatApiRequest(req.element._requestArgument), req.element);
            case RequestType.MembersApiRequest: 
            return Object.assign(new MembersApiRequest(req.element._requestArgument), req.element);
            default: return null;
        } 
    }
}

interface RequestsRegisterElement<Element> {
    element: Element;
    lastProcessed: number;
    type: RequestType;
}
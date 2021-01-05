import {Db} from 'mongodb';
import {CollectionName} from '../api/IDataAPI';

const reportSchemaCollectionName = "reportschema";

export class MongoQueryExecutor {

    private _mongoDBInstance: Db;

    constructor() {}

    public injectDBConnection(mongoDBInstance: Db) {
        this._mongoDBInstance = mongoDBInstance;
    }

    async runShemaQuery(collection: CollectionName) {
        try {
            console.log(`going to try getting schema for this collection: ${collection}`);
            const col = await this._mongoDBInstance.collection(reportSchemaCollectionName);
            const reportSchema = await col.findOne({ collection });
            console.dir(reportSchema);
            if (reportSchema) {
                return reportSchema.schema;
            }
        } catch (err) {
            console.warn(`Failed to get pre-defined schema for ${collection}`);
        }

        return this._mongoDBInstance.collection(collection).findOne(null);
    }

    async runAggregateQuery(collection: CollectionName, pipeline: any[]) {
        return this._mongoDBInstance.collection(collection).aggregate(pipeline, { 
            allowDiskUse: true
        });
    }
}
These are some experimental changes we require for use in a serverless environment.

The problem we had is that the schema cache and the request cache both are made assuming this runs on a single server. We changed the schema cache to cache individually on each instance. We moved the request cache to the database for now to experiment, memory cache in the future.

## License

Here is [Flexmonster licensing page](https://www.flexmonster.com/pivot-table-editions-and-pricing/). Flexmonster Connector for MongoDB module is released as a MIT-licensed (free and open-source) add-on to Flexmonster Pivot.


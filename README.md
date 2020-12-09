These are some experimental changes we require for use in a serverless environment.

The problem we had is that the schema cache and the request cache both are made assuming this runs on a single server. We changed the schema cache to cache individually on each instance. We moved the request cache to the database for now to experiment, memory cache in the future.
[![Flexmonster Pivot Table & Charts](https://cdn.flexmonster.com/landing.png)](https://flexmonster.com)
Website: www.flexmonster.com

## Flexmonster Pivot Table & Charts

Flexmonster Pivot is a powerful JavaScript tool for interactive web reporting. It allows you to visualize and analyze data from JSON, CSV, SQL, NoSQL, Elasticsearch, and OLAP data sources quickly and conveniently. Flexmonster is designed to integrate seamlessly with any client-side framework and can be easily embedded into your application.

This repository holds the source code of Flexmonster Connector for [MongoDB](https://www.mongodb.com/) applications.

[Flexmonster MongoDB Connector](https://www.flexmonster.com/doc/introduction-to-the-flexmonster-mongodb-connector/) is a special server-side tool intended to help you retrieve the data from a MongoDB database to Flexmonster Pivot. It has to be embedded into a server that accepts requests for the data from Flexmonster and passes them to the Connector.

The table of contents:

- [Usage](#usage)
- [Sample project](#sample-project)
- [License](#license)
- [Support & feedback](#support--feedback)

## Usage

Refer to [our documentation](https://www.flexmonster.com/doc/mongodb-connector/) for details on Flexmonster MongoDB Connector usage.

To learn about the Connector API, have a look at the following section: [MongoDB Connector API](https://www.flexmonster.com/api/all-methods/).

## <a name="sample-project"></a>Sample Project ##

See the [sample project with the MongoDB Connector](https://github.com/flexmonster/pivot-mongo).

## License

Here is [Flexmonster licensing page](https://www.flexmonster.com/pivot-table-editions-and-pricing/). Flexmonster Connector for MongoDB module is released as a MIT-licensed (free and open-source) add-on to Flexmonster Pivot.


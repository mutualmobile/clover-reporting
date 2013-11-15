# [Mutual Mobile Reporting App](http://mutualmobile.github.io/clover-reporting)



## Application Overview

The Mutual Mobile Reporting App is a responsive web app built using [Lavaca](http://getlavaca.com/#/#@0). For graphs and charts, it uses [nvd3](http://nvd3.org/). To facilitate development and manage third-party client-side dependencies, it leverages [Grunt](http://gruntjs.com/) and [Bower](https://github.com/bower/bower).

### Clover API Integration

Authenticating with the Clover API is handled via OAuth. The returned `access_token` is stored in localStorage.

All of the metrics in the app are calculated via data obtained from the [GET /orders](https://www.clover.com/rest-api#GET /v2/merchant/{mId}/orders) API endpoint.

When supported, all of the API requests and metric calculations are done in a Web Worker to reduce the work done on the main thread and keep the UI as responsive as possible. However, a fallback (using setTimeout to ensure consistent asynchronous behavior) is provided for browsers which do not support Web Workers.

Modules which wish to use the data obtained via the API endpoint can create a `DataHandle` via the global `DataHub` object. The returned `DataHandle` provides an interface allowing the module to register various operations such as `map`, `reduce`, `sort`, etc which will be executed in the Worker. A `DataHandle` also exposes a `done` method which can register a function that will be called (on the main thread) with the end result after processing all of the other registered operations.

The `/orders` endpoint is polled at regular intervals, and when the data changes, all active `DataHandle` instances will automatically re-run whatever operations they have registered, and then any `done` handles will be called.

### Model Layer

__Using Clover API Data__

All models which rely on data from the Clover API extend from `BaseDataModel` or `BaseDataCollection`. These classes encapsulate the creating of a `DataHandle` and disposing of it when the model is disposed. By default, whenever all of the registered dataOperations are finished, `BaseDataModel` sets the returned data to its `data` property and `BaseDataCollection`, which expects an array as the returned data, will apply the returned data to its models, performing any necessary `addItem`, `removeItem`, `moveItem`, and `changeItem` operations.

__Handling the user-selected time range__

Because the app relies on one global interface element for selecting the current time range, there is always only one active time range. As such, the global `TimeRangeModel` instance is responsible for all handling of the current time range data. Any other module which needs to be aware of the current time range can obtain that information from the `TimeRangeModel`.

Whenever the user changes the current time range, the `DataHub` is notified via an event triggered on the `TimeRangeModel` and it then notifies the worker to request new data. Whenever the new data is returned, all active `DataHandles` will process the new data and any models which extend from `BaseDataModel` or `BaseDataCollection` will be updated automatically.

### View Layer

__Views with a `BaseDataModel`-derived model__

Views which rely on data from the Clover API (and thus rely on a model which extends from `BaseDataModel`) all extend from `BaseDataView`. `BaseDataView` calls it's `onDataChange` method whenever the `data` property on its model changes. Subclasses should overwrite the `onDataChange` method to perform any necessary operations, such as redrawing.

__Handling charts/graphs__

Views that use nvd3 to show a chart extend from `BaseChartView` (also a descendent of `BaseDataView`). `BaseChartView` exposes and calls certain methods which subclasses can override to create and update their charts as appropriate.

 - `createChart`- Called once when the view is created and should return an nvd3 chart object, which will be assigned to the `chart` property on the view
 - `updateChart`- Called whenever the data changes, or on window resize. Should apply the necessary data and any relevant style changes to the view's chart (accessed via `this.chart`).

__Collection Views__

The Employees and Products pages display a ranked list of objects and share much of the same functionality via the `BaseCollectionView` class. This class is used with a `BaseDataCollection`-derived model and  automatically creates/removes/arranges child views for each item in its collection.


## Getting Started

### Installing Dependencies

1. __Install NodeJS & NPM__

    Installation instructions are available  from [nodejs.org](http://nodejs.org/).

1. __Install grunt-cli and Bower globally__

    Note: this may require sudo

        $ npm install -g grunt-cli
        $ npm install -g bower

1. __Install development dependencies and and external libraries__

        $ cd [path/to/project/root]
        $ npm install
        $ bower install


### Running Locally

During development, you can run the default grunt task which will watch for any changes to `.less` files and
recompile the css as well as run a local server on port `8080`.

    $ grunt


Your application should now be running on `localhost:8080`.


### Packaging for deployment

To package your app for deployment to a server, you can use the `build:[environment]` grunt command. This task will:

  - Compile and concatenate `less` files
  - Runs the require.js optimizer and outputs a single javascript file
  - Processes the `index.html` file to make sure all css/javascript/config file references are updated


For example, to build the app using the "production.json" config file, run:

    $ grunt build:production


### Generating Documentation

To generates JavaScript documentation using [yuidoc](https://github.com/gruntjs/grunt-contrib-yuidoc), use the `yuidoc` grunt command. The resulting documentation is outputed to the `doc` folder.

    $ grunt yuidoc
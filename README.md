# Solar Challenge Function
  
## Introducton

This project uses the serverless, webpack and node.js frameworks to validate sensor data, to calculate its current and to store the resulting data into AWS S3.
A sensor/sensors payload can be sent to the `solar-challenge/` which is then validated against a set of criteria in [Validator.js](./src/core/Validator.js) named validationRules.

Depending on the validation outcome, the cloud function will proceed to store any valid and invalid sensor data under an s3 bucket called `solar-store` and under the path `<environment>/<valid or invalid>/<current year>/<current month>/<current day>/<current hour>/<unique identifier>.json`.

If a sensor has passed validation, its current will be calculated and added to it before being stored in s3 under the `valid` directory.
If however a sensor has not passed validation, its errors will be recorded (for later analysis) and added to it to then be stored under the `invalid` directory.

### Webpack

The serverless-webpack plugin has been used in this app to make a smaller artifact and for the ability to produce minified individual functions for deployment. You can see the difference by running `serverless package` and then inspecting the size of the generated zip file (under the `.serverless/` directory), and then commenting the line `serverless-webpack` in the [serverless.yml](serverless.yml), and repeating the same command.

## Setup

This serverless app uses Node.js version 12.
A number of global node.js modules are required to start using this project locally, of which are listed below:

* yarn
* serverless
* serverless-offline

Packages can be installed globally using the following command:

    npm install -g <package-name>

Once the above node.js packages have been installed globally, you need to install all project dependencies by executing the `yarn` command.

## Running in Development mode.

With the `serverless-offline` and `serverless-s3-local` plugins, this application can run locally. When first running it, the serverless-s3-local plugin will create a new bucket called `solar-store` under the `buckets` directory.

The project runs using a local serverless installation which provides local AWS services such as S3. The configuration for this is found in the `serverless.yml` file.

The project can be run locally by executing the `yarn serve` command. Doing so will run `serverless-offline` with the webpack plugin as well as `serverless-s3-local` (which mimicks s3 on the local machine).

## API Contract

The `solar-challenge/` endpoint expects the following POST body

```JSON
{
    "sensors": [
        {
            "name": "battery",
            "direction": 1,
            "offset": 0,
            "baseline": 5000,
            "voltage": 5300,
            "range": 300
        },
        {
            "name": "battery",
            "direction": -1,
            "offset": 0,
            "baseline": 4900,
            "voltage": 5300,
            "range": 400
        }
        ...
    ]
}
```
The sensors list must have at least one or more sensors in it.












#TODO
## Test

### Unit

Testing is provided using NYC, Mocha, Chai and Sinon. Tests are located in the `test/unit` directory and can be run by executing the `yarn test` command. Doing so will run all tests as well as print out the test coverage report in the terminal. A html report will also be produced, this is located in the `coverage` directory.

### Acceptance

Acceptance test support is provided by cucumber-js and apickli. Cucumber-js provides the Cucumber and Gherkin support; apickli provides a rest testing framework to standardise the feature file

To run the full acceptance test type `./bin/run_integration`. This runs the serverless-offline stack and then executes the features against this local instance. Once the test run is complete the serverless-offline instance is torn down. This is all controlled by the "bin/run_integration.sh" script.

## Debug

To start a debug session you can type `yarn debug`. Currently this works, to a degree, with Visual Source Code but some debug features, such as inspect, tend to fail.

### debugging acceptance

You can also run type `yarn serve` to start your service and `yarn cucumber` in another terminal to execute the acceptance tests on your running application.

## Building

The AWS Lambda functions are built via the `yarn build` command. Executing the `build` command will run webpack, bundling each function into a separate zip file located in the `.serverless` directory.

### PR Builder

The pimp validation function pr builder is located [on Jenkins](http://build.travelsupermarket.com/job/function.pimp-validator.feature/) and is triggered when a PR is created in BitBucket. The PR builder executes lint checks, unit tests and integration tests.

### Master Builder

The pimp validation function master builder is located [on Jenkins](http://build.travelsupermarket.com/job/function.pimp-validator.build/) and is triggered when a PR is merged into the master branch. The master builder peforems lint checks, unit tests and integration tests as well as incrementing the version and tagging git. The master builder does not produce an artifact, AWS lambda stage deployment produce an artifact for each stage.

### Depolyment Pipeline

The pimp validation function deployment pipeline is located [on Jenkins](http://deployment.travelsupermarket.com/job/function.pimp-validator.deploy/). The pipeline provides a selection of two stages; 'test' and 'prod'. The pipeline will deploy the lambda to AWS under the selected stage. Creating the S3 events is a manual process that should be performed for each stage once after the initial deployment.
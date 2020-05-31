# Solar Challenge Function
  
## Introducton

This project uses the serverless, webpack and node.js frameworks to validate sensor data, to calculate their current and to store the resulting data into AWS S3.
A sensor/sensors payload can be sent as a POST request to the `solar-challenge/` endpoint which is validated and then stored in AWS S3 on different directories depending on if the sensor is passed or failed validation.

Depending on the validation outcome, the cloud function will proceed to store any valid and invalid sensor data under an s3 bucket called `solar-store` and under the path(s) `<environment>/<valid or invalid>/<current year>/<current month>/<current day>/<current hour>/<unique identifier>.json`.

If a sensor has passed validation, its current will be calculated and added to it before being stored in s3 under the `valid` directory.
If however a sensor has not passed validation, its errors will be recorded (for later analysis) and added to it to then be stored under the `invalid` directory.

### Webpack

The serverless-webpack plugin has been used in this app to build a smaller artifact (producing minified individual functions for deployment). You can see the difference by running `serverless package` then inspecting the size of the generated zip file (under the `.serverless/` directory). If you then try commenting the line `serverless-webpack` in the [serverless.yml](serverless.yml), and ran `serverless package`, you will see a much larger artifact generated under `.serverless/`

## Setup

This serverless app uses Node.js version 12.
A number of global node.js modules are required to start using this project locally, of which are listed below:

* yarn
* serverless
* serverless-offline

These packages can be installed globally using the following command:

    `npm install -g <package-name>`

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

## Test

### Unit

Testing is provided using the jest unit test dependency. Tests are located in the `test/unit` directory and can be run by executing the `yarn test` command. Doing so will run all tests as well as print out the test coverage report in the terminal. A html report will also be produced, this is located in at [coverage/lcov-report/index.html](coverage/lcov-report/index.html).

### Integration

Integration test support is provided by cucumber and apickli. The cucumber dependency provides the Cucumber and Gherkin support; apickli provides a rest testing framework.
To run the full acceptance test issue the command `yarn integration`. This runs the serverless-offline stack, then waits for it to become available (with the wait-on dependency), and then it executes the features against this local instance. Once the test run is complete the serverless-offline instance is torn down. This is all controlled by the [bin/run_integration.sh](bin/run_integration.sh) script.

### Running both unit and integration tests

You may use the `yarn testAll` command in order to run all unit and integration tests.

## Building

The function can be built via the `yarn build` command. Executing the `build` command will run webpack, bundling the code into a separate zip artifact file located in the `.serverless` directory.

## Deployment

### Test (the staging environment)
You can deploy to the `test` environment by issuing the command `yarn deploy:test`. This in turn will issue the `serverless deploy` command, with the `test` stage flag.
This stage flag is then used to use the real (non mocked) AWS S3 instance, and to store validated payloads into S3, under the path that containing the `test` environment.
Currently accessible via [https://go2uqtm736.execute-api.eu-west-2.amazonaws.com/test/solar-challenge](https://go2uqtm736.execute-api.eu-west-2.amazonaws.com/test/solar-challenge)

### Production
As with deploying to test, you can also deploy to the `prod` environment by issuing the command `yarn deploy:prod`. This in turn will issue the `serverless deploy` command, with the `prod` stage flag.
Again this stage flag is used to use the real (non mocked) AWS S3 instance, and to store validated payloads into S3, under the path containing `prod` environment.
Currently accessible via [https://o4e2m5akt9.execute-api.eu-west-2.amazonaws.com/prod/solar-challenge](https://o4e2m5akt9.execute-api.eu-west-2.amazonaws.com/prod/solar-challenge)

NOTE:
Normally, deployment scripts like these would not be available via the package.json scripts. Usually deployment steps would be defined in CI/CD pipelines included in the repository.

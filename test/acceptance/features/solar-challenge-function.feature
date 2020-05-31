Feature: Content file update
    Background:
        Given the application host is on "localhost"
        And the port is "3000"
        And the protocol is "http"
        And the application is running

    Scenario: Attempt validation of valid sensors
        Given I set the request body to the contents of the resource file 'validSensors.json'
        When I POST to /solar-challenge
        Then response code should be 202
        And response body is empty

    Scenario: Attempt validation of valid sensors
        Given I set the request body to the contents of the resource file 'invalidSensors.json'
        When I POST to /solar-challenge
        Then response code should be 202
        And response body is empty

    Scenario: Attempt validation of empty sensors
        Given I set body to "{\"sensors\": []}"
        When I POST to /solar-challenge
        Then response code should be 400
        And response body matches 'expected400Response.json'

    Scenario: Attempt validation of no sensors
        Given I set body to "{\"hello\": []}"
        When I POST to /solar-challenge
        Then response code should be 400
        And response body matches 'expected400Response.json'

    Scenario: Attempt validation of empty body
        Given I set body to ""
        When I POST to /solar-challenge
        Then response code should be 400
        And response body matches 'expected400Response.json'

    Scenario: Attempt validation of empty body
        Given I set body to "malformedJSON"
        When I POST to /solar-challenge
        Then response code should be 422
        And response body matches 'expected422Response.json'

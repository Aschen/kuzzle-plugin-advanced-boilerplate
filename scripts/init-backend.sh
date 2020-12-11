#!/bin/bash

set -e

kourou admin:loadMappings < ../fixtures/default-mappings.json

kourou admin:loadFixtures < ../fixtures/default-fixtures.json

kourou admin:loadSecurities < ../fixtures/default-securities.json

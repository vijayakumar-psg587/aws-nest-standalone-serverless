#! /bin/bash

echo "### Starting the build"

ENV_DEV="dev"
ENV_PROD="PROD"

input_param_validate_fn() {
    echo 'Number of parameters should be atleast 1. No value is passed'
    exit 1
}

common_err_fn() {
    echo 'Error occured ${1:- Unknown error}'
    exit 1
}

build_fn() {
    echo '###Getting value for build'
    if [ $1 = 'dev' ]
    then
        echo '### Build for dev/staging'
        npm run build
    elif [ $1 = 'prod' ]
    then 
        echo '### Build for prod'
        npm run build
    else
        common_err_fn 'Provided input is invalid'
    fi    
}

echo '### First installing the dependancies'
# npm install 

echo '### Now building the artifact'
# if [ '$#' ne 1 ]
# then
#     input_param_validate_fn
# else
#     echo '### Calling the build function'
    build_fn ${NODE_ENV}
# fi

echo '### Creating target folder and copying'

if [ -d 'target' ]
then
    rm -rf target
    mkdir target
else
    mkdir target   
fi

cp package*.json target/
cp -r dist target/dist
cp -r build target/build


echo '###Completed'
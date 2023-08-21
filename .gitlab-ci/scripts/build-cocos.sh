#/bin/bash
set -e
ENV_DIR=$CI_PROJECT_DIR/.gitlab-ci/scripts/cocos
BIN_PATH="/usr/local/bin"
DEVELOPMENT_TEAM=6AY3LGP972
project_path="$CI_PROJECT_DIR/cocos"
if [[ ${ENV} =~ "beta" ]]; then
    #beta, beta-testflight,beta-firebase
    buildPath="$CI_BUILDS_DIR/$CI_RUNNER_SHORT_TOKEN/$CI_CONCURRENT_ID/beta/cocos-build"
elif [[ ${ENV} =~ "stg" ]]; then
    #stg, stg-testflight,stg-firebase
    buildPath="$CI_BUILDS_DIR/$CI_RUNNER_SHORT_TOKEN/$CI_CONCURRENT_ID/stg/cocos-build"
elif [[ ${ENV} =~ "dev" ]]; then
    #dev
    buildPath="$CI_BUILDS_DIR/$CI_RUNNER_SHORT_TOKEN/$CI_CONCURRENT_ID/dev/cocos-build"
fi

web_build_path="$buildPath/web-mobile"

# VERSION="2.3.0"

COCOS_START_SCREEN="5f121b84-6cac-43b1-bc8c-27a1c0486ec9"

exit_on_error() {
    exit_code=$1
    last_command=${@:2}
    if [ $exit_code -ne 0 ]; then
        echo >&2 "\"${last_command}\" command failed with exit code ${exit_code}."
        exit $exit_code
    fi
}

setup_env() {
    echo "Setup environemnt variables"
    echo "Build path $buildPath"
    echo "Load env for env=${ENV}, platform=${PLATFORM}"
    envFile=$ENV_DIR/.env.${PLATFORM}.${ENV}
    echo "Env file ${envFile}"
    source $envFile
    # Override version
    if [ -z "$VERSION" ]; then
        echo "Not found version. Use default version $COCOS_APP_VERSION"
        VERSION=$COCOS_APP_VERSION
    else
        echo "Found version $VERSION"
        COCOS_APP_VERSION=$VERSION
    fi
    echo $COCOS_APP_TITLE
    echo $COCOS_APP_ID
    echo $COCOS_APP_VERSION
}

prepare() {
    echo "Prepare cocos build"
    cd $project_path
    rm -rf build
    node -v
    npm -v
    npm install
}

build_web() {
    echo "Start build web"
    build_config="title=${COCOS_APP_TITLE};platform=web-mobile;debug=false;sourceMaps=false;inlineSpriteFrames=true;previewWidth=1280;previewHeight=720;md5Cache=true;webOrientation=landscape;startScene=${COCOS_START_SCREEN};"
    # $BIN_PATH/jq ".[\"env\"]=\"${COCOS_BUILD_ENV}\"" ${connect_config_path} >"tmp" && mv "tmp" ${connect_config_path}
    cd ${project_path}
    $COCOS_EXE_PATH --project ${project_path} --build "platform=web-mobile;debug=true;replaceSplashScreen=true;startScene=${COCOS_START_SCREEN}"
    rc=$?
    echo "Complete build web, status $rc"

}

process_web(){
    # Remove "A Class already exists with the same ..." error
    echo "Process web before upload to s3"
    echo "Remove A Class already exists with the same name error log"
    gsed -i "s/cc\.error(a)//" ${web_build_path}/cocos2d-js-min.*.js
    gsed -i "s/cc\.error(error)//" ${web_build_path}/cocos2d-js-min.*.js
}

upload_web() {
    cd $project_path
    echo "Upload web $web_build_path"
    cp -R $web_build_path/../. $project_path
    ls $project_path
    # Delete all current file exclude v prefix folder, it means will replace current version
    # No need remove all, because cocos support increment update. only few changes for each build
    # aws s3 rm --recursive  $S3_BUCKET/ --exclude "v*/*"
    # if [ "$COCOS_ACCESS_OLD_VERSION" = "true" ]; then
    #     echo "Support access old version"
    #     aws s3 cp --recursive $web_build_path "${S3_BUCKET}/v${COCOS_APP_VERSION}"
    #         # Override current version
    #     aws s3 cp --recursive  --exclude "*.html"  "${S3_BUCKET}/v${COCOS_APP_VERSION}" "${S3_BUCKET}"
    #     aws s3 cp --recursive --exclude "*" --include "*.html" "${S3_BUCKET}/v${COCOS_APP_VERSION}" "${S3_BUCKET}"
    # else
    #     echo "Not support access old version"
    #     aws s3 cp --recursive  --exclude "*.html"  $web_build_path "${S3_BUCKET}"
    #     aws s3 cp --recursive  --exclude "*" --include "*.html"  $web_build_path  "${S3_BUCKET}"
    # fi
}

echo "Start build $PLATFORM, env $ENV"
setup_env
prepare

> $CI_PROJECT_DIR/build.log

if [ "$PLATFORM" = "web" ]; then
    build_web >> $CI_PROJECT_DIR/build.log
    process_web >> $CI_PROJECT_DIR/build.log
    upload_web >> $CI_PROJECT_DIR/build.log
fi

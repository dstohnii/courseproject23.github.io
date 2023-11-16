function exceedsPropertiesLengthLimit(properties) {
    let limitLength = 10;
    let exceedsLimit = false;

    if(properties.length > limitLength) {
        exceedsLimit = true;
    }
    return exceedsLimit;
}
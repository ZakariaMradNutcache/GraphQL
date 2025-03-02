export const fixFilter = (filter) => {
    if (filter._operators) {
        const operatorKeys = Object.keys(filter._operators);
        operatorKeys.forEach((key) => {
            const operator = filter._operators[key];
            if (operator.regex) {
                filter[key] = { $regex: operator.regex, $options: 'i' }; // 'i' for case-insensitive
            }
        });
        delete filter._operators; // Remove _operators from filter
    }
    return filter;
}
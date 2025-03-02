export const removeFields = (typeComposer, fields) => {
    fields.forEach(field => {
        typeComposer.removeField(field);
    });
    return typeComposer;
};
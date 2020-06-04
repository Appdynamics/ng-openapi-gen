"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const openapi3_ts_1 = require("openapi3-ts");
const gen_utils_1 = require("./gen-utils");
/**
 * An object property
 */
class Property {
    constructor(model, name, schema, required, options) {
        this.model = model;
        this.name = name;
        this.schema = schema;
        this.required = required;
        this.type = gen_utils_1.tsType(this.schema, options, model);
        if (openapi3_ts_1.isReferenceObject(schema)) {
            const ref = gen_utils_1.resolveRef(model.openApi, schema.$ref);
            if (ref.nullable) {
                this.type += ' | null';
            }
        }
        this.identifier = gen_utils_1.escapeId(this.name);
        const description = schema.description || '';
        this.tsComments = gen_utils_1.tsComments(description, 1, schema.deprecated);
    }
}
exports.Property = Property;
//# sourceMappingURL=property.js.map
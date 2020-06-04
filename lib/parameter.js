"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gen_utils_1 = require("./gen-utils");
/**
 * An operation parameter
 */
class Parameter {
    constructor(spec, options) {
        this.spec = spec;
        this.name = spec.name;
        this.var = gen_utils_1.escapeId(this.name);
        this.varAccess = this.var.includes('\'') ? `[${this.var}]` : `.${this.var}`;
        this.tsComments = gen_utils_1.tsComments(spec.description || '', 2, spec.deprecated);
        this.in = spec.in || 'query';
        this.required = this.in === 'path' || spec.required || false;
        this.type = gen_utils_1.tsType(spec.schema, options);
        this.style = spec.style;
        this.explode = spec.explode;
        this.parameterOptions = this.createParameterOptions();
    }
    createParameterOptions() {
        const options = {};
        if (this.style) {
            options.style = this.style;
        }
        if (this.explode) {
            options.explode = this.explode;
        }
        return JSON.stringify(options);
    }
}
exports.Parameter = Parameter;
//# sourceMappingURL=parameter.js.map
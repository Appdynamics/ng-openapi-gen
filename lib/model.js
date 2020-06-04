"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enum_value_1 = require("./enum-value");
const gen_type_1 = require("./gen-type");
const gen_utils_1 = require("./gen-utils");
const property_1 = require("./property");
/**
 * Context to generate a model
 */
class Model extends gen_type_1.GenType {
    constructor(openApi, name, schema, options) {
        super(name, gen_utils_1.unqualifiedName, options);
        this.openApi = openApi;
        this.schema = schema;
        const description = schema.description || '';
        this.tsComments = gen_utils_1.tsComments(description, 0, schema.deprecated);
        const type = schema.type || 'any';
        // When enumStyle is 'alias' it is handled as a simple type.
        if (options.enumStyle !== 'alias' && (schema.enum || []).length > 0 && ['string', 'number', 'integer'].includes(type)) {
            const names = schema['x-enumNames'] || [];
            const values = schema.enum || [];
            this.enumValues = [];
            for (let i = 0; i < values.length; i++) {
                const enumValue = new enum_value_1.EnumValue(type, names[i], values[i], options);
                this.enumValues.push(enumValue);
            }
        }
        this.isObject = type === 'object' || !!schema.properties;
        this.isEnum = (this.enumValues || []).length > 0;
        this.isSimple = !this.isObject && !this.isEnum;
        if (this.isObject) {
            // Object
            this.superClasses = [];
            const propertiesByName = new Map();
            this.collectObject(schema, propertiesByName);
            this.hasSuperClasses = this.superClasses.length > 0;
            const sortedNames = [...propertiesByName.keys()];
            sortedNames.sort();
            this.properties = sortedNames.map(propName => propertiesByName.get(propName));
        }
        else {
            // Simple / array / enum / union / intersection
            this.simpleType = gen_utils_1.tsType(schema, options);
        }
        this.collectImports(schema);
        this.updateImports();
    }
    pathToModels() {
        if (this.namespace) {
            const depth = this.namespace.split('/').length;
            let path = '';
            for (let i = 0; i < depth; i++) {
                path += '../';
            }
            return path;
        }
        return './';
    }
    skipImport(name) {
        // Don't import own type
        return this.name === name;
    }
    collectObject(schema, propertiesByName) {
        if (schema.type === 'object' || !!schema.properties) {
            // An object definition
            const properties = schema.properties || {};
            const required = schema.required || [];
            const propNames = Object.keys(properties);
            // When there are additional properties, we need an union of all types for it.
            // See https://github.com/cyclosproject/ng-openapi-gen/issues/68
            const propTypes = new Set();
            const appendType = (type) => {
                if (type.startsWith('null | ')) {
                    propTypes.add('null');
                    propTypes.add(type.substr('null | '.length));
                }
                else {
                    propTypes.add(type);
                }
            };
            for (const propName of propNames) {
                const prop = new property_1.Property(this, propName, properties[propName], required.includes(propName), this.options);
                propertiesByName.set(propName, prop);
                appendType(prop.type);
                if (!prop.required) {
                    propTypes.add('undefined');
                }
            }
            if (schema.additionalProperties === true) {
                this.additionalPropertiesType = 'any';
            }
            else if (schema.additionalProperties) {
                const propType = gen_utils_1.tsType(schema.additionalProperties, this.options);
                appendType(propType);
                this.additionalPropertiesType = [...propTypes].sort().join(' | ');
            }
        }
    }
}
exports.Model = Model;
//# sourceMappingURL=model.js.map
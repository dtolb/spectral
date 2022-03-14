import { oas2, oas3, oas3_0, oas3_1 } from '@stoplight/spectral-formats';
import {
  truthy,
  pattern,
  unreferencedReusableObject,
  schema,
  xor,
  undefined,
  alphabetical,
  length,
} from '@stoplight/spectral-functions';
import {
  oasOpIdUnique,
  oasPathParam,
  oasOpSuccessResponse,
  oasOpFormDataConsumeCheck,
  oasTagDefined,
  oasOpParams,
  refSiblings,
  typedEnum,
  oasExample,
  oasUnusedComponent,
  oasDocumentSchema,
  oasOpSecurityDefined,
  oasSchema,
  oasDiscriminator,
} from './functions';
import { uniquenessTags } from '../shared/functions';

export { ruleset as default };

const shorthands: Record<string, string> = {
  schema: [
    ...[
      'not',
      'if',
      'then',
      'else',
      'unevaluatedProperties',
      'additionalProperties',
      'propertyNames',
      'items',
      'unevaluatedItems',
    ].map(k => `scope.path[scope.path.length - 1] === '${k}'`),
    ...['prefixItems', 'items', 'allOf', 'oneOf', 'anyOf'].map(
      k => `scope.path[scope.path.length - 2] === '${k}' && Number.isInteger(scope.path[scope.path.length - 1])`,
    ),
    ...['patternProperties', 'properties'].map(k => `scope.path[scope.path.length - 2] === '${k}'`),
  ].join(' || '),
};

const ruleset = {
  documentationUrl: 'https://meta.stoplight.io/docs/spectral/docs/reference/openapi-rules.md',
  formats: [oas2, oas3, oas3_0, oas3_1],
  aliases: {
    PathItem: ['$.paths[*]'],
    ResponsesObject: {
      targets: [
        { formats: [oas2], given: ['$.responses', '#OperationObject.responses'] },
        { formats: [oas3], given: ['$.components.responses', '#OperationObject.responses'] },
      ],
    },
<<<<<<< Updated upstream
    ResponseObject: ['#ResponsesObject[*]'], // [(@ && !@.$ref)]
=======
    ResponseObject: ['#ResponsesObject[*]'],
>>>>>>> Stashed changes
    ParametersDefinitionsObject: {
      targets: [
        { formats: [oas2], given: ['$.parameters'] },
        { formats: [oas3], given: ['$.components.parameters'] },
      ],
    },
    ParametersObject: {
      targets: [
        { formats: [oas2], given: ['#PathItem.parameters', '#OperationObject.parameters'] },
        {
          formats: [oas3],
          given: ['#PathItem.parameters', '#OperationObject.parameters'],
        },
      ],
    },
    ParameterObject: {
      targets: [
<<<<<<< Updated upstream
        { formats: [oas2], given: ['#ParametersDefinitionsObject[*]', '#ParametersObject[*]'] }, // ?(@ && !@.$ref)
        {
          formats: [oas3],
          given: ['#ParametersDefinitionsObject[*]', '#ParametersObject[*]'], // [?(@ && !@.$ref)]
=======
        { formats: [oas2], given: ['#ParametersDefinitionsObject[*]', '#ParametersObject[*]'] },
        {
          formats: [oas3],
          given: ['#ParametersDefinitionsObject[*]', '#ParametersObject[*]'],
>>>>>>> Stashed changes
        },
      ],
    },
    EncodingObject: ['#MediaTypeObject.encoding'],
    MediaTypeObject: ['#RequestBodyObject.content', '#ParameterObject.content', '#ResponseObject.content'],
    HeadersObject: {
      targets: [
        { formats: [oas2], given: ['#ResponseObject.headers'] },
        {
          formats: [oas3],
          given: ['$.components.headers', '#EncodingObject.headers', '#ResponseObject.headers'],
        },
      ],
    },
    HeaderObject: {
      targets: [
        { formats: [oas2], given: ['#ResponseObject.headers[*]'] },
        {
          formats: [oas3],
<<<<<<< Updated upstream
          given: ['#HeadersObject[*]'], // ?(@ && !$.ref)
=======
          given: ['#HeadersObject[*]'],
>>>>>>> Stashed changes
        },
      ],
    },
    RequestBodyObject: ['#OperationObject.requestBody', '$.components.requestBodies[*]'],
    OperationObject: ['#PathItem[get,put,post,delete,options,head,patch,trace]'],
    SchemaObject: {
      targets: [
        {
          formats: [oas2],
          given: [
            '#MediaTypeObject.schema',
            '#MediaTypeObject.schema..@@schema()',
            '#ParameterObject.schema',
            '#ParameterObject.schema..@@schema()',
            '$.definitions[*]',
            '$.definitions[*]..@@schema()',
          ],
        },
        {
          formats: [oas3],
          given: [
            '#MediaTypeObject.schema',
            '#MediaTypeObject.schema..@@schema()',
            '#ParameterObject.schema',
            '#ParameterObject.schema..@@schema()',
            '$.components.schemas[*]',
            '$.components.schemas[*]..@@schema()',
          ],
        },
      ],
    },
  },
  shorthands,
  rules: {
    'operation-success-response': {
      description: 'Operation must have at least one "2xx" or "3xx" response.',
      recommended: true,
      type: 'style',
      given: '#OperationObject',
      then: {
        field: 'responses',
        function: oasOpSuccessResponse,
      },
    },
    'oas2-operation-formData-consume-check': {
      description:
        'Operations with "in: formData" parameter must include "application/x-www-form-urlencoded" or "multipart/form-data" in their "consumes" property.',
      recommended: true,
      formats: [oas2],
      type: 'validation',
      given: '#OperationObject',
      then: {
        function: oasOpFormDataConsumeCheck,
      },
    },
    'operation-operationId-unique': {
      description: 'Every operation must have unique "operationId".',
      recommended: true,
      type: 'validation',
      severity: 0,
      given: '$',
      then: {
        function: oasOpIdUnique,
      },
    },
    'operation-parameters': {
      description: 'Operation parameters are unique and non-repeating.',
      message: '{{error}}',
      recommended: true,
      type: 'validation',
      given: '#OperationObject',
      then: {
        field: 'parameters',
        function: oasOpParams,
      },
    },
    'operation-tag-defined': {
      description: 'Operation tags must be defined in global tags.',
      recommended: true,
      type: 'validation',
      given: '$',
      then: {
        function: oasTagDefined,
      },
    },
    'path-params': {
      description: 'Path parameters must be defined and valid.',
      message: '{{error}}',
      type: 'validation',
      severity: 0,
      recommended: true,
      given: '$',
      then: {
        function: oasPathParam,
      },
    },
    'contact-properties': {
      description: 'Contact object must have "name", "url" and "email".',
      recommended: false,
      type: 'style',
      given: '$.info.contact',
      then: [
        {
          field: 'name',
          function: truthy,
        },
        {
          field: 'url',
          function: truthy,
        },
        {
          field: 'email',
          function: truthy,
        },
      ],
    },
    'duplicated-entry-in-enum': {
      description: 'Enum values must not have duplicate entry.',
      type: 'validation',
      severity: 'warn',
      recommended: true,
      message: '{{error}}',
      given: ['#SchemaObject'],
      then: {
        field: 'enum',
        function: oasSchema,
        functionOptions: {
          schema: {
            type: 'array',
            uniqueItems: true,
          },
        },
      },
    },
    'info-contact': {
      description: 'Info object must have "contact" object.',
      recommended: true,
      type: 'style',
      given: '$',
      then: {
        field: 'info.contact',
        function: truthy,
      },
    },
    'info-description': {
      description: 'Info "description" must be present and non-empty string.',
      recommended: true,
      type: 'style',
      given: '$',
      then: {
        field: 'info.description',
        function: truthy,
      },
    },
    'info-license': {
      description: 'Info object must have "license" object.',
      recommended: false,
      type: 'style',
      given: '$',
      then: {
        field: 'info.license',
        function: truthy,
      },
    },
    'license-url': {
      description: 'License object must include "url".',
      recommended: false,
      type: 'style',
      given: '$',
      then: {
        field: 'info.license.url',
        function: truthy,
      },
    },
    'no-eval-in-markdown': {
      description: 'Markdown descriptions must not have "eval(".',
      recommended: true,
      type: 'style',
      given: '$..[description,title]',
      then: {
        function: pattern,
        functionOptions: {
          notMatch: /eval\(/,
        },
      },
    },
    'no-script-tags-in-markdown': {
      description: 'Markdown descriptions must not have "<script>" tags.',
      recommended: true,
      type: 'style',
      given: '$..[description,title]',
      then: {
        function: pattern,
        functionOptions: {
          notMatch: '<script',
        },
      },
    },
    'openapi-tags-alphabetical': {
      description: 'OpenAPI object must have alphabetical "tags".',
      recommended: false,
      type: 'style',
      given: '$.tags',
      then: {
        function: alphabetical,
        functionOptions: {
          keyedBy: 'name',
        },
      },
    },
    'openapi-tags-uniqueness': {
      description: 'Each tag must have a unique name.',
      message: '{{error}}',
      severity: 'error',
      recommended: true,
      type: 'validation',
      given: '$.tags',
      then: {
        function: uniquenessTags,
      },
    },
    'openapi-tags': {
      description: 'OpenAPI object must have non-empty "tags" array.',
      recommended: false,
      type: 'style',
      given: '$',
      then: {
        field: 'tags',
        function: schema,
        functionOptions: {
          dialect: 'draft7',
          schema: {
            type: 'array',
            minItems: 1,
          },
        },
      },
    },
    'operation-description': {
      description: 'Operation "description" must be present and non-empty string.',
      recommended: true,
      type: 'style',
      given: '#OperationObject',
      then: {
        field: 'description',
        function: truthy,
      },
    },
    'operation-operationId': {
      description: 'Operation must have "operationId".',
      recommended: true,
      type: 'style',
      given: '#OperationObject',
      then: {
        field: 'operationId',
        function: truthy,
      },
    },
    'operation-operationId-valid-in-url': {
      message: 'operationId must not characters that are invalid when used in URL.',
      recommended: true,
      type: 'validation',
      given: '#OperationObject',
      then: {
        field: 'operationId',
        function: pattern,
        functionOptions: {
          match: "^[A-Za-z0-9-._~:/?#\\[\\]@!\\$&'()*+,;=]*$",
        },
      },
    },
    'operation-singular-tag': {
      description: 'Operation must not have more than a single tag.',
      recommended: false,
      type: 'style',
      given: '#OperationObject',
      then: {
        field: 'tags',
        function: length,
        functionOptions: {
          max: 1,
        },
      },
    },
    'operation-tags': {
      description: 'Operation must have non-empty "tags" array.',
      recommended: true,
      type: 'style',
      given: '#OperationObject',
      then: {
        field: 'tags',
        function: schema,
        functionOptions: {
          dialect: 'draft7',
          schema: {
            type: 'array',
            minItems: 1,
          },
        },
      },
    },
    'path-declarations-must-exist': {
      message: 'Path parameter declarations must not be empty, ex."/given/{}" is invalid.',
      recommended: true,
      type: 'style',
      given: '$.paths',
      then: {
        field: '@key',
        function: pattern,
        functionOptions: {
          notMatch: '{}',
        },
      },
    },
    'path-keys-no-trailing-slash': {
      message: 'Path must not end with slash.',
      recommended: true,
      type: 'style',
      given: '$.paths',
      then: {
        field: '@key',
        function: pattern,
        functionOptions: {
          notMatch: '.+\\/$',
        },
      },
    },
    'path-not-include-query': {
      description: 'Path must not include query string.',
      recommended: true,
      type: 'style',
      given: '$.paths',
      then: {
        field: '@key',
        function: pattern,
        functionOptions: {
          notMatch: '\\?',
        },
      },
    },
    'tag-description': {
      description: 'Tag object must have "description".',
      recommended: false,
      type: 'style',
      given: '$.tags[*]',
      then: {
        field: 'description',
        function: truthy,
      },
    },
    'no-$ref-siblings': {
      formats: [oas2, oas3_0],
      description: 'Property must not be placed among $ref',
      message: '{{error}}',
      type: 'validation',
      severity: 0,
      recommended: true,
      resolved: false,
      given: "$..[?(@property === '$ref')]",
      then: {
        function: refSiblings,
      },
    },
    'typed-enum': {
      description: 'Enum values must respect the specified type.',
      message: '{{error}}',
      recommended: true,
      type: 'validation',
      given: '#SchemaObject',
      then: {
        function: typedEnum,
      },
    },
    'oas2-api-host': {
      description: 'OpenAPI "host" must be present and non-empty string.',
      recommended: true,
      formats: [oas2],
      type: 'style',
      given: '$',
      then: {
        field: 'host',
        function: truthy,
      },
    },
    'oas2-api-schemes': {
      description: 'OpenAPI host "schemes" must be present and non-empty array.',
      recommended: true,
      formats: [oas2],
      type: 'style',
      given: '$',
      then: {
        field: 'schemes',
        function: schema,
        functionOptions: {
          dialect: 'draft7',
          schema: {
            items: {
              type: 'string',
            },
            minItems: 1,
            type: 'array',
          },
        },
      },
    },
    'oas2-discriminator': {
      description: 'discriminator property must be defined and required',
      recommended: true,
      formats: [oas2],
      severity: 0,
      message: '{{error}}',
      given: '$.definitions[?(@.discriminator)]',
      type: 'validation',
      then: {
        function: oasDiscriminator,
      },
    },
    'oas2-host-not-example': {
      description: 'Host URL must not point at example.com.',
      recommended: false,
      formats: [oas2],
      given: '$',
      type: 'style',
      then: {
        field: 'host',
        function: pattern,
        functionOptions: {
          notMatch: 'example\\.com',
        },
      },
    },
    'oas2-host-trailing-slash': {
      description: 'Server URL must not have trailing slash.',
      recommended: true,
      formats: [oas2],
      given: '$',
      type: 'style',
      then: {
        field: 'host',
        function: pattern,
        functionOptions: {
          notMatch: '/$',
        },
      },
    },
    'oas2-parameter-description': {
      description: 'Parameter objects must have "description".',
      recommended: false,
      formats: [oas2],
      given: '#ParameterObject',
      type: 'style',
      then: {
        field: 'description',
        function: truthy,
      },
    },
    'oas2-operation-security-defined': {
      description: 'Operation "security" values must match a scheme defined in the "securityDefinitions" object.',
      message: '{{error}}',
      recommended: true,
      formats: [oas2],
      type: 'validation',
      given: '$',
      then: {
        function: oasOpSecurityDefined,
        functionOptions: {
          schemesPath: ['securityDefinitions'],
        },
      },
    },
    'oas2-valid-schema-example': {
      description: 'Examples must be valid against their defined schema.',
      message: '{{error}}',
      recommended: true,
      formats: [oas2],
      severity: 0,
      type: 'validation',
      given: [
        "$..definitions..[?(@property !== 'properties' && @ && (@.example !== void 0 || @['x-example'] !== void 0 || @.default !== void 0) && (@.enum || @.type || @.format || @.$ref || @.properties || @.items))]",
        "$..parameters..[?(@property !== 'properties' && @ && (@.example !== void 0 || @['x-example'] !== void 0 || @.default !== void 0) && (@.enum || @.type || @.format || @.$ref || @.properties || @.items))]",
        "$..responses..[?(@property !== 'properties' && @ && (@.example !== void 0 || @['x-example'] !== void 0 || @.default !== void 0) && (@.enum || @.type || @.format || @.$ref || @.properties || @.items))]",
      ],
      then: {
        function: oasExample,
        functionOptions: {
          schemaField: '$',
          oasVersion: 2,
          type: 'schema',
        },
      },
    },
    'oas2-valid-media-example': {
      description: 'Examples must be valid against their defined schema.',
      message: '{{error}}',
      recommended: true,
      formats: [oas2],
      severity: 0,
      type: 'validation',
      given: '$..responses..[?(@ && @.schema && @.examples)]',
      then: {
        function: oasExample,
        functionOptions: {
          schemaField: 'schema',
          oasVersion: 2,
          type: 'media',
        },
      },
    },
    'oas2-anyOf': {
      message: '"anyOf" keyword must not be used in OpenAPI v2 document.',
      description: 'anyOf is not available in OpenAPI v2, it was added in OpenAPI v3',
      recommended: true,
      formats: [oas2],
      type: 'validation',
      given: '#SchemaObject',
      then: {
        field: 'anyOf',
        function: undefined,
      },
    },
    'oas2-oneOf': {
      message: '"oneOf" keyword must not be used in OpenAPI v2 document.',
      description: 'oneOf is not available in OpenAPI v2, it was added in OpenAPI v3',
      recommended: true,
      formats: [oas2],
      type: 'validation',
      given: '#SchemaObject',
      then: {
        field: 'oneOf',
        function: undefined,
      },
    },
    'oas2-schema': {
      description: 'Validate structure of OpenAPI v2 specification.',
      message: '{{error}}.',
      recommended: true,
      formats: [oas2],
      severity: 0,
      type: 'validation',
      given: '$',
      then: {
        function: oasDocumentSchema,
      },
    },
    'oas2-unused-definition': {
      description: 'Potentially unused definition has been detected.',
      recommended: true,
      resolved: false,
      formats: [oas2],
      type: 'style',
      given: '$.definitions',
      then: {
        function: unreferencedReusableObject,
        functionOptions: {
          reusableObjectsLocation: '#/definitions',
        },
      },
    },
    'oas3-api-servers': {
      description: 'OpenAPI "servers" must be present and non-empty array.',
      recommended: true,
      formats: [oas3],
      type: 'style',
      given: '$',
      then: {
        field: 'servers',
        function: schema,
        functionOptions: {
          dialect: 'draft7',
          schema: {
            items: {
              type: 'object',
            },
            minItems: 1,
            type: 'array',
          },
        },
      },
    },
    'oas3-examples-value-or-externalValue': {
      description: 'Examples must have either "value" or "externalValue" field.',
      recommended: true,
      formats: [oas3],
      type: 'style',
      given: [
        '$.components.examples[*]',
        '#MediaTypeObject.examples[*]',
        '#ParameterObject.examples[*]',
        '#HeaderObject.examples[*]',
      ],
      then: {
        function: xor,
        functionOptions: {
          properties: ['externalValue', 'value'],
        },
      },
    },
    'oas3-operation-security-defined': {
      description:
        'Operation "security" values must match a scheme defined in the "components.securitySchemes" object.',
      message: '{{error}}',
      recommended: true,
      formats: [oas3],
      type: 'validation',
      given: '$',
      then: {
        function: oasOpSecurityDefined,
        functionOptions: {
          schemesPath: ['components', 'securitySchemes'],
        },
      },
    },
    'oas3-parameter-description': {
      description: 'Parameter objects must have "description".',
      recommended: false,
      formats: [oas3],
      type: 'style',
      given: '#ParameterObject',
      then: {
        field: 'description',
        function: truthy,
      },
    },
    'oas3-server-not-example.com': {
      description: 'Server URL must not point at example.com.',
      recommended: false,
      formats: [oas3],
      type: 'style',
      given: '$.servers[*].url',
      then: {
        function: pattern,
        functionOptions: {
          notMatch: 'example\\.com',
        },
      },
    },
    'oas3-server-trailing-slash': {
      description: 'Server URL must not have trailing slash.',
      recommended: true,
      formats: [oas3],
      type: 'style',
      given: '$.servers[*].url',
      then: {
        function: pattern,
        functionOptions: {
          notMatch: './$',
        },
      },
    },
    'oas3-valid-media-example': {
      description: 'Examples must be valid against their defined schema.',
      message: '{{error}}',
      recommended: true,
      severity: 0,
      formats: [oas3],
      type: 'validation',
      given: [
        '$..content..[?(@ && @.schema && (@.example !== void 0 || @.examples))]',
        '$..headers..[?(@ && @.schema && (@.example !== void 0 || @.examples))]',
        '$..parameters..[?(@ && @.schema && (@.example !== void 0 || @.examples))]',
      ],
      then: {
        function: oasExample,
        functionOptions: {
          schemaField: 'schema',
          oasVersion: 3,
          type: 'media',
        },
      },
    },
    'oas3-valid-schema-example': {
      description: 'Examples must be valid against their defined schema.',
      message: '{{error}}',
      severity: 0,
      formats: [oas3],
      recommended: true,
      type: 'validation',
      given: ['#SchemaObject'],
      then: {
        function: oasExample,
        functionOptions: {
          schemaField: '$',
          oasVersion: 3,
          type: 'schema',
        },
      },
    },
    'oas3-schema': {
      description: 'Validate structure of OpenAPI v3 specification.',
      message: '{{error}}.',
      severity: 0,
      formats: [oas3],
      recommended: true,
      type: 'validation',
      given: '$',
      then: {
        function: oasDocumentSchema,
      },
    },
    'oas3-unused-component': {
      message: 'Potentially unused component has been detected.',
      recommended: true,
      formats: [oas3],
      type: 'style',
      resolved: false,
      given: '$',
      then: {
        function: oasUnusedComponent,
      },
    },
  },
};

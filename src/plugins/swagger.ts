import { FastifyInstance } from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { swaggerOptions, swaggerUiOptions } from '../config/swagger.js';
import { cbdResponseSchema } from '../schemas/cbd.schema.js';
import { cityResponseSchema } from '../schemas/city.schema.js';
import { districtResponseSchema } from '../schemas/district.schema.js';
import { partResponseSchema } from '../schemas/part.schema.js';
import { shopResponseSchema } from '../schemas/shop.schema.js';
import { spaceResponseSchema } from '../schemas/space.schema.js';
import { positionResponseSchema } from '../schemas/position.schema.js';
import { zodToJsonSchema } from "zod-to-json-schema";
import { auditLogResponseSchema } from '../schemas/auditLog.schema.js';

export async function registerSwagger(app: FastifyInstance): Promise<void> {
  // @ts-ignore
  await app.register(fastifySwagger, swaggerOptions);
  await app.register(fastifySwaggerUi, swaggerUiOptions);
  app.addSchema({ $id: "cbdResponseSchema", ...zodToJsonSchema(cbdResponseSchema) });
  app.addSchema({ $id: "cityResponseSchema", ...zodToJsonSchema(cityResponseSchema) });
  app.addSchema({ $id: "districtResponseSchema", ...zodToJsonSchema(districtResponseSchema) });
  app.addSchema({ $id: "partResponseSchema", ...zodToJsonSchema(partResponseSchema) });
  app.addSchema({ $id: "shopResponseSchema", ...zodToJsonSchema(shopResponseSchema) });
  app.addSchema({ $id: "spaceResponseSchema", ...zodToJsonSchema(spaceResponseSchema) });
  app.addSchema({ $id: "Position", ...zodToJsonSchema(positionResponseSchema) });
  app.addSchema({ $id: "AuditLog", ...zodToJsonSchema(auditLogResponseSchema) });
}

import 'reflect-metadata';
import express, { Request, Response } from "express";
import cors from 'cors';
import 'dotenv/config';
import { AppEnvironment } from './common/constants/environment';
import apiExpress, { StatusCode } from 'typescript-express-basic';
import { container } from 'tsyringe';
import { PocketBaseApi } from './common/constants/pocketBaseApi';
import { AuthFilterService } from './common/services/authFilter.Service';

import { AuthController as AdminAuthController } from './controllers/admin/auth/auth.Controller';
import { AuthController as ClientAuthController } from './controllers/client/auth/auth.Controller';

console.log(AppEnvironment.ENV);
const port = AppEnvironment.PORT;
const app = apiExpress;
app.use(express.json());
app.use(cors());

// Authentication middleware
app.use((req, res, next) => {
    const authFilterService = container.resolve(AuthFilterService);
    authFilterService.checkAuthentication(req, res, next);
});

// Register admin controller
app.registerController(new AdminAuthController());

// Register client controller
app.registerController(new ClientAuthController());

// const options = {
//     info: {
//         version: '1.0.0',
//         title: 'Express-Pocketbase-API Service',
//         license: {
//             name: 'MIT',
//         },
//     },
//     security: {
//     },
//     baseDir: __dirname,
//     // Glob pattern to find your jsdoc files (multiple patterns can be added in an array)
//     filesPattern: './**/*.ts',
//     // URL where SwaggerUI will be rendered
//     swaggerUIPath: '/api/api-docs',
//     // Expose OpenAPI UI
//     exposeSwaggerUI: true,
//     // Expose Open API JSON Docs documentation in `apiDocsPath` path.
//     exposeApiDocs: false,
//     // Open API JSON Docs endpoint.
//     apiDocsPath: '/v3/api-docs',
//     // Set non-required fields as nullable by default
//     notRequiredAsNullable: false,
//     // You can customize your UI options.
//     // you can extend swagger-ui-express config. You can checkout an example of this
//     // in the `example/configuration/swaggerOptions.js`
//     swaggerUiOptions: {},
//     // multiple option in case you want more that one instance
//     multiple: true,
// };
// expressJSDocSwagger(app)(options);
const pocketbaseApi = container.resolve(PocketBaseApi);
app.get('/', (req: Request, res: Response) => { res.status(StatusCode.Forbidden); res.send(); });
pocketbaseApi.init().then(() => {
    app.listen(port, async () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
    });
}).catch((ex) => { console.log(ex) });

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
    /**
     * @param username
     * @param password
     * @returns any
     * @throws ApiError
     */
    public static authControllerLogin(username: string, password: string): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/login',
            body: { username, password },
            headers: { 'Content-Type': 'application/json' }
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static authControllerGoogleLogin(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/google-login',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static authControllerGetProtected(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/protected',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static authControllerUploadFile(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/upload',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static authControllerListFiles(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/files',
        });
    }
    /**
     * @param filename
     * @returns any
     * @throws ApiError
     */
    public static authControllerDownloadFile(
        filename: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/files/{filename}',
            path: {
                'filename': filename,
            },
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static authControllerProcessImageStub(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/process-image',
        });
    }
}

import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
export abstract class BaseService<T> {

    constructor(protected http: Http, protected serviceUrl: string) { }

    get(): Observable<T[]> {
        return this.http.get(this.serviceUrl)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getGeneric<U>(url?: string): Observable<U> {
        return this.http.get(this.serviceUrl + url)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getById(id: string): Observable<T> {
        return this.http.get(`${this.serviceUrl}\\${id}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    post(entity: T): Observable<string> {
        return this.http.post(this.serviceUrl, entity)
            .map(this.extractData)
            .catch(this.handleError);
    }

    put(id: string, entity: T): Observable<T> {
        return this.http.put(`${this.serviceUrl}\\${id}`, entity)
            .map(this.extractData)
            .catch(this.handleError);
    }

    delete(id: string): Observable<T> {
        return this.http.delete(`${this.serviceUrl}\\${id}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        return res.json();
    }

    private handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}

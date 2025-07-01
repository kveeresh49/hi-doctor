// app-config.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IUser } from '../models/user';
import { ICountry } from '../models/location';

export interface AppConfig {
    apiBaseUrl: string;
    companyName: string;
    featureToggle: {
        enableSignup: boolean;
    };
    divisions: Array<{ name: string; code: number }>;
    subscribedCompanyList: Array<IUser>;
    Countries: ICountry[];
}

@Injectable({
    providedIn: 'root'
})
export class AppConfigService {
    private configSubject = new BehaviorSubject<AppConfig | null>(null);
    public config$ = this.configSubject.asObservable();
    private config: AppConfig | null = null;

    constructor(private http: HttpClient) {}

    loadConfig(): Observable<AppConfig> {
        return this.http.get<AppConfig>('./../../assets/app-config.json').pipe(
            tap((config) => {
                this.config = config;
                this.configSubject.next(config);
            })
        );
    }

    getConfig(): AppConfig | null {
        return this.config;
    }

    get apiBaseUrl(): string | null {
        return this.config?.apiBaseUrl || null;
    }

    get companyName(): string | null {
        return this.config?.companyName || null;
    }

    get subscribedCompanyList(): Array<IUser> | null {
        return this.config?.subscribedCompanyList || null;
    }

    get divisions(): Array<{ name: string; code: number }> | null {
        return this.config?.divisions || null;
    }

    get featureToggle(): AppConfig['featureToggle'] | null {
        return this.config?.featureToggle || null;
    }

    get enableSignup(): boolean | null {
        return this.config?.featureToggle?.enableSignup || null;
    }

    get CompanyList(): ICountry[] {
        return this.config?.Countries || [];
    }
}

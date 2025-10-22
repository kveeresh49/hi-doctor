import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SessionStorageService {
    currentCompanyId: string = '';
    currentSite!: string;
    constructor() {}

    setSite(site: string) {
        sessionStorage.setItem('currentSite', site);
        this.currentSite = site;
    }

    getSite(): string {
        return sessionStorage.getItem('currentSite') || '10w';
    }

    setObject(key: string, value: any): void {
        sessionStorage.setItem(key, JSON.stringify(value)); // Convert object to string
    }

    getObject(key: string): any {
        const data = sessionStorage.getItem(key);
        return data ? JSON.parse(data) : null; // Convert string back to object
    }

    removeItem(key: string): void {
        sessionStorage.removeItem(key);
    }

    clearSession() {
        sessionStorage.clear();
    }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DynamicIndexedDBService {
    private dbName = 'Hi_Doctor_DB_1';

    checkAndAddStore(storeName: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (indexedDB) {
                const request = indexedDB?.open(this.dbName);

                request.onsuccess = (event: any) => {
                    const db = event.target.result as IDBDatabase;

                    if (db.objectStoreNames.contains(storeName)) {
                        db.close();
                        resolve();
                    } else {
                        const newVersion = db.version + 1;
                        db.close();

                        const upgradeRequest = indexedDB.open(this.dbName, newVersion);
                        upgradeRequest.onupgradeneeded = (upgradeEvent: any) => {
                            const upgradeDb = upgradeEvent.target.result as IDBDatabase;
                            const store = upgradeDb.createObjectStore(storeName, {
                                keyPath: 'id',
                                autoIncrement: true
                            });
                            store.createIndex('name', 'name', { unique: false });
                            store.createIndex('email', 'email', { unique: false });
                        };

                        upgradeRequest.onsuccess = () => resolve();
                        upgradeRequest.onerror = () => reject(upgradeRequest.error);
                    }
                };
                request.onerror = () => reject(request.error);
            }
        });
    }

    bulkAdd(storeName: string, items: any[]): Observable<any> {
        return new Observable((observer) => {
            if (indexedDB) {
                const request = indexedDB.open(this.dbName);

                request.onsuccess = (event: any) => {
                    const db = event.target.result as IDBDatabase;
                    const tx = db.transaction(storeName, 'readwrite');
                    const store = tx.objectStore(storeName);

                    items.forEach((item) => store.add(item));

                    tx.oncomplete = () => {
                        observer.next(true);
                        observer.complete();
                    };

                    tx.onerror = () => observer.error(tx.error);
                };

                request.onerror = () => observer.error(request.error);
            }
        });
    }

    getAll(storeName: string): Observable<any[]> {
        return new Observable((observer) => {
            const request = indexedDB.open(this.dbName);

            request.onsuccess = (event: any) => {
                const db = event.target.result as IDBDatabase;
                const tx = db.transaction(storeName, 'readonly');
                const store = tx.objectStore(storeName);
                const getAllRequest = store.getAll();

                getAllRequest.onsuccess = () => {
                    observer.next(getAllRequest.result);
                    observer.complete();
                };

                getAllRequest.onerror = () => observer.error(getAllRequest.error);
            };

            request.onerror = () => observer.error(request.error);
        });
    }
}

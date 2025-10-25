import { DBConfig } from 'ngx-indexed-db';

export const dbConfig: DBConfig = {
    name: 'Hi_Doctor_DB',
    version: 1,
    objectStoresMeta: [
        {
            store: 'Dr_Reddys_Roles',
            storeConfig: { keyPath: 'id', autoIncrement: false },
            storeSchema: [
                { name: 'role', keypath: 'role', options: { unique: false } },
                { name: 'roleDescription', keypath: 'roleDescription', options: { unique: false } }
            ]
        },
        {
            store: 'Dr_Reddys_Employees',
            storeConfig: { keyPath: 'id', autoIncrement: true },
            storeSchema: [{ name: 'employees', keypath: 'employees', options: { unique: false } }]
        },
        {
            store: '10w_Roles',
            storeConfig: { keyPath: 'id', autoIncrement: true },
            storeSchema: [{ name: 'employees', keypath: 'employees', options: { unique: false } }]
        },
        {
            store: '10w_Employees',
            storeConfig: { keyPath: 'id', autoIncrement: false },
            storeSchema: [
                { name: 'role', keypath: 'role', options: { unique: false } },
                { name: 'roleDescription', keypath: 'roleDescription', options: { unique: false } }
            ]
        }
    ]
};

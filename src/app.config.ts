import { provideHttpClient, withFetch } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';
import { AppConfigService } from './app/service/app-config.service';
import { NgxIndexedDBModule, DBConfig } from 'ngx-indexed-db';
import { dbConfig } from './app/index-db';

export function initializeAppConfig(appConfigService: AppConfigService) {
    return () => appConfigService.loadConfig().toPromise();
}


export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(appRoutes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withEnabledBlockingInitialNavigation()),
        provideHttpClient(withFetch()),
        provideAnimationsAsync(),
        importProvidersFrom(NgxIndexedDBModule.forRoot(dbConfig)), // ✅ FIXED: no nested providers
        AppConfigService,
        {
            provide: APP_INITIALIZER,
            useFactory: initializeAppConfig,
            deps: [AppConfigService],
            multi: true
        },
        providePrimeNG({
            theme: { preset: Aura }
        })
    ]
};

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Districts, LocationResponse, Stateregion, Stateregions, Township, VillageTractTown } from '../models/location';

@Injectable({
    providedIn: 'root'
})
export class LocationService {
    private readonly baseUrl = ''; // More specific base URL

    constructor(private http: HttpClient) {}

    getLocations(): Observable<LocationResponse[]> {
        return this.http.get<LocationResponse[]>(this.baseUrl);
    }

    getStateRegions(): Observable<{ stateregions: Stateregion[] }> {
        return this.http.get<{ stateregions: Stateregion[] }>(`./../../assets/stateregions.json`);
    }

    getDistricts(): Observable<{ districts: Districts[] }> {
        return this.http.get<{ districts: Districts[] }>(`./../../assets/districts.json`);
    }

    getCities(): Observable<{ townships: Township[] }> {
        return this.http.get<{ townships: Township[] }>(`../../../assets/townships.json`);
    }

    getVillagetowns(): Observable<{ villageTractTown: VillageTractTown[] }> {
        return this.http.get<{ villageTractTown: VillageTractTown[] }>(`../../../assets/villagetracttowns.json`);
    }

    // Method to get locations by state/region
    getLocationsByStateRegion(stateRegion: string): Observable<LocationResponse[]> {
        return this.http.get<LocationResponse[]>(`${this.baseUrl}?stateregion=${encodeURIComponent(stateRegion)}`);
    }

    // Method to get locations by district
    getLocationsByDistrict(district: string): Observable<LocationResponse[]> {
        return this.http.get<LocationResponse[]>(`${this.baseUrl}?district=${encodeURIComponent(district)}`);
    }

    // Method to get locations by township (city)
    getLocationsByCity(city: string): Observable<LocationResponse[]> {
        return this.http.get<LocationResponse[]>(`${this.baseUrl}?township=${encodeURIComponent(city)}`);
    }

    // Method to get locations by village/town
    getLocationsByVillageTown(villageTown: string): Observable<LocationResponse[]> {
        return this.http.get<LocationResponse[]>(`${this.baseUrl}?villagetracttown=${encodeURIComponent(villageTown)}`);
    }
}

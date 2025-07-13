import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDistrict, IDistricts, IRegion, IRegions, ITownship, ITownships } from '../models/Ilocation';

// Import IStateRegion interface (adjust the path as needed)

@Injectable({
    providedIn: 'root'
})
export class LocationService {
    private readonly baseUrl = ''; // More specific base URL

    constructor(private http: HttpClient) {}


    getRegionsList(): Observable<IRegion[]> {
        return this.http.get<IRegion[]>(`./../../assets/regions.json`);
    }

    getDistricts(): Observable<IDistrict[]> {
        return this.http.get<IDistrict[]>(`./../../assets/districts.json`);
    }

    getCities(): Observable<ITownship[]> {
        return this.http.get<ITownship[]>(`../../../assets/townships.json`);
    }

    // getVillagetowns(): Observable<{ villageTractTown: VillageTractTown[] }> {
    //     return this.http.get<{ villageTractTown: VillageTractTown[] }>(`../../../assets/villagetracttowns.json`);
    // }

    // // Method to get locations by state/region
    // getLocationsByStateRegion(stateRegion: string): Observable<LocationResponse[]> {
    //     return this.http.get<LocationResponse[]>(`${this.baseUrl}?stateregion=${encodeURIComponent(stateRegion)}`);
    // }

    // // Method to get locations by district
    // getLocationsByDistrict(district: string): Observable<LocationResponse[]> {
    //     return this.http.get<LocationResponse[]>(`${this.baseUrl}?district=${encodeURIComponent(district)}`);
    // }

    // // Method to get locations by township (city)
    // getLocationsByCity(city: string): Observable<LocationResponse[]> {
    //     return this.http.get<LocationResponse[]>(`${this.baseUrl}?township=${encodeURIComponent(city)}`);
    // }

    // // Method to get locations by village/town
    // getLocationsByVillageTown(villageTown: string): Observable<LocationResponse[]> {
    //     return this.http.get<LocationResponse[]>(`${this.baseUrl}?villagetracttown=${encodeURIComponent(villageTown)}`);
    // }
}

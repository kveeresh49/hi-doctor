// State/Region Model
export interface Stateregion {
  StateRegion: string;
  StateRegionMM: string;
  StateRegionPCode: string;
  TotalDistricts: string;
  TotalTownships: string;
  TotalVillageTractTowns: string;
  TotalVillageWards: string;
}

// Wrapper for state/region array
export interface Stateregions {
  stateregions: Stateregion[];
}

// District Model
export interface District {
  District: string;
  DistrictMM: string;
  DistrictPCode: string;
  StateRegion?: string;
  StateRegionMM: string;
  StateRegionPCode: string;
  TotalTownships: string;
  TotalVillageTractTowns: string;
  TotalVillageWards: string;
}

// Wrapper for district array
export interface Districts {
  districts: District[];
}

// Township Model
export interface Township {
  Township: string;
  TownshipMM: string;
  TownshipPCode: string;
  District: string;
  DistrictMM: string;
  DistrictPCode: string;
  StateRegion: string;
  StateRegionMM: string;
  StateRegionPCode: string;
  TotalVillageTractTowns: string;
  TotalVillageWards: string;
}

// Wrapper for township array
export interface Townships {
  townships: Township[];
}

// VillageTractTown Model
export interface VillageTractTown {
  VillageTractTown: string;
  VillageTractTownMM: string;
  VillageTractTownPCode: string;
  Township: string;
  TownshipMM: string;
  TownshipPCode: string;
  District: string;
  DistrictMM: string;
  DistrictPCode: string;
  StateRegion: string;
  StateRegionMM: string;
  StateRegionPCode: string;
}

// Wrapper for village tract/town array
export interface VillageTractTowns {
  villagetracttowns: VillageTractTown[];
}

// VillageWard Model
export interface VillageWard {
  VillageWard: string;
  VillageWardMM: string;
  VillageWardPCode: string;
  VillageTractTown: string;
  VillageTractTownMM: string;
  VillageTractTownPCode: string;
  Township: string;
  TownshipMM: string;
  TownshipPCode: string;
  District: string;
  DistrictMM: string;
  DistrictPCode: string;
  StateRegion: string;
  StateRegionMM: string;
  StateRegionPCode: string;
}

// Wrapper for village ward array
export interface VillageWards {
  villagewards: VillageWard[];
}

// Unified Location Model (for all data at once)
export interface Location {
  stateregions: Stateregion[];
  districts: District[];
  townships: Township[];
  villagetracttowns: VillageTractTown[];
  villagewards: VillageWard[];
}

// Flexible response model (for partial data)
export interface LocationResponse {
  stateregions?: Stateregion[];
  districts?: District[];
  townships?: Township[];
  villagetracttowns?: VillageTractTown[];
  villagewards?: VillageWard[];
}
// Re-confirming interface for clarity.
export interface State {
  StateRegion: string;
  StateRegionMM: string;
  StateRegionPCode: string;
  TotalDistricts: string;
  TotalTownships: string;
  TotalVillageTractTowns: string;
  TotalVillageWards: string;
}

export interface District {
  District: string;
  DistrictMM: string;
  DistrictPCode: string;
  StateRegion: string;
  StateRegionMM: string;
  StateRegionPCode: string;
  TotalTownships: string;
  TotalVillageTractTowns: string;
  TotalVillageWards: string;
}

export interface City {
  District: string;
  DistrictMM: string;
  DistrictPCode: string;
  StateRegion: string;
  StateRegionMM: string;
  StateRegionPCode: string;
  TotalVillageTractTowns: string;
  TotalVillageWards: string;
  Township: string;
  TownshipMM: string;
  TownshipPCode: string;
}

export interface Employee {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  employeeRole: {
    id: string;
    role: string;
  };
  qualification: string | null;
  address: string;
  country: string;
  state: State[];
  district: District[];
  city: City[];
  division: string[];
  resume: string | null;
  profilePic: string | null;
  areaView: boolean | null; // Corresponds to District-level view
  areaEdit: boolean | null; // Corresponds to District-level edit
  stateView: boolean | null; // Corresponds to State-level view
  stateEdit: boolean | null; // Corresponds to State-level edit
  cityView: boolean | null; // Corresponds to City/Township-level view
  cityEdit: boolean | null; // Corresponds to City/Township-level edit
  employeeStatus: string | null;
  employeeType: string | null;
  Password: string | null;
  companyId?: string; // Added companyId from current user data
}

// For Reporting Hierarchy
export interface ReportingRole {
  id: string;
  role: string;
  reporters?: ReportingRole[];
}
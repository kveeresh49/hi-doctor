import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Employee, ReportingRole } from '../../models/employee'; // Ensure these interfaces are correctly defined
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-list-employess',
  standalone: true,
  imports: [TableModule, ButtonModule, CardModule, ToastModule, CommonModule, TooltipModule],
  providers: [MessageService],
  templateUrl: './list-employees.component.html',
  styleUrl: './list-employees.component.scss'
})
export class ListEmployeesComponent implements OnInit {
  employees: Employee[] = [];
  allEmployees: Employee[] = [];
  currentUser: Employee = {} as Employee;
  private subordinateRoleIds: Set<string> = new Set(); // Using a Set for efficient lookup

  // UPDATED: Reporting Roles to match the provided employee IDs
  reportingRoles: ReportingRole[] = [
    { id: 'cfoin9vg3', role: 'RSM', reporters: [{ id: '13l07b9dg', role: 'ASM', reporters: [{ id: 'qotug4mza', role: 'MR' }] }] }
  ];

  constructor(private messageService: MessageService) { }

  ngOnInit() {
    this.loadCurrentUser();
    this.loadEmployees();
    // Populate subordinate roles AFTER currentUser is loaded
    if (this.currentUser && this.currentUser.employeeRole?.id) {
      this.populateSubordinateRoleIds(this.currentUser.employeeRole.id, this.reportingRoles);
    }
    this.filterEmployeesBasedOnPermissions();
  }

  loadCurrentUser() {
    const userData = sessionStorage.getItem('user');
    if (userData) {
      try {
        this.currentUser = JSON.parse(userData);
        console.log('Current user loaded:', this.currentUser.firstname, 'Role:', this.currentUser.employeeRole?.role);
      } catch (e) {
        console.error('Error parsing current user data from session storage:', e);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load user data.' });
      }
    } else {
      console.warn('No user data found in session storage for key "user".');
    }
  }

  loadEmployees() {
    const companyId = this.currentUser?.companyId || 'Dr._Reddys'; // Use default if companyId is missing
    const sessionData = sessionStorage.getItem(`employees_${companyId}`);
    if (sessionData) {
      try {
        this.allEmployees = JSON.parse(sessionData);
        // Add companyId to each employee for consistency if not already present
        this.allEmployees = this.allEmployees.map(emp => ({ ...emp, companyId: emp.companyId || companyId }));
      } catch (e) {
        console.error(`Error parsing employee data for company "${companyId}" from session storage:`, e);
        this.allEmployees = [];
      }
    } else {
      console.warn(`No employee data found in session storage for key "employees_${companyId}".`);
      // Fallback to a hardcoded list if sessionStorage is empty for demo purposes
      
    }
  }

  private populateSubordinateRoleIds(currentRoleId: string, hierarchy: ReportingRole[]): void {
    this.subordinateRoleIds.clear(); // Clear previous subordinates

    const findAndCollect = (node: ReportingRole, targetRoleId: string): boolean => {
      if (node.id === targetRoleId) {
        this.collectAllReporters(node);
        return true;
      }
      if (node.reporters) {
        for (const reporter of node.reporters) {
          if (findAndCollect(reporter, targetRoleId)) {
            return true;
          }
        }
      }
      return false;
    };

    for (const roleNode of hierarchy) {
      if (findAndCollect(roleNode, currentRoleId)) {
        break;
      }
    }
  }

  private collectAllReporters(node: ReportingRole): void {
    if (node.reporters) {
      for (const reporter of node.reporters) {
        this.subordinateRoleIds.add(reporter.id);
        this.collectAllReporters(reporter);
      }
    }
  }

  isReporteeOfCurrentUser(employee: Employee): boolean {
    if (!this.currentUser || employee.email === this.currentUser.email) {
      return false;
    }
    return this.subordinateRoleIds.has(employee.employeeRole?.id || '');
  }

  hasStateOverlap(emp: Employee, user: Employee): boolean {
    const userStates = new Set((user.state || []).map(s => s.StateRegionPCode));
    const empStates = new Set((emp.state || []).map(s => s.StateRegionPCode));
    return Array.from(empStates).some(pcode => userStates.has(pcode));
  }

  hasDistrictOverlap(emp: Employee, user: Employee): boolean {
    const userDistricts = new Set((user.district || []).map(d => d.DistrictPCode));
    const empDistricts = new Set((emp.district || []).map(d => d.DistrictPCode));
    return Array.from(empDistricts).some(pcode => userDistricts.has(pcode));
  }

  hasCityOverlap(emp: Employee, user: Employee): boolean {
    const userCities = new Set((user.city || []).map(c => c.TownshipPCode));
    const empCities = new Set((emp.city || []).map(c => c.TownshipPCode));
    return Array.from(empCities).some(pcode => userCities.has(pcode));
  }

  hasDivisionOverlap(emp: Employee, user: Employee): boolean {
    const userDivisions = new Set(user.division || []);
    const empDivisions = new Set(emp.division || []);
    return Array.from(empDivisions).some(div => userDivisions.has(div));
  }


  filterEmployeesBasedOnPermissions() {
    if (!this.currentUser || !this.currentUser.email) {
      this.employees = [];
      return;
    }

    this.employees = this.allEmployees.filter(emp => {
      // 1. Current user always sees their own entry
      if (emp.email === this.currentUser.email) {
        return true;
      }

      // 2. Filter by Company ID (must match current user's company)
      if (emp.companyId !== this.currentUser.companyId) {
        return false;
      }

      // 3. Filter by Reporting Hierarchy: Must be a reportee
      if (!this.isReporteeOfCurrentUser(emp)) {
        return false;
      }

      // 4. Apply Location and Division-based Permissions (Hierarchical and Prioritized)

      // Rule: If current user has stateView, they see all reportees within their states.
      // This implicitly covers areas and cities within those states.
      if (this.currentUser.stateView) {
        return this.hasStateOverlap(emp, this.currentUser) && this.hasDivisionOverlap(emp, this.currentUser);
      }

      // Rule: Else if current user has areaView, they see all reportees within their districts/areas.
      // This implicitly covers cities within those districts.
      if (this.currentUser.areaView) {
        return (this.hasDistrictOverlap(emp, this.currentUser) || this.hasCityOverlap(emp, this.currentUser)) &&
               this.hasDivisionOverlap(emp, this.currentUser);
      }

      // Rule: Else if current user has cityView, they see all reportees within their cities.
      if (this.currentUser.cityView) {
        return this.hasCityOverlap(emp, this.currentUser) && this.hasDivisionOverlap(emp, this.currentUser);
      }

      // Rule: Else if current user only has division-based viewing (no specific location views)
      if (this.currentUser.division && this.currentUser.division.length > 0) {
        return this.hasDivisionOverlap(emp, this.currentUser);
      }

      // Default: If no specific view permission is met, and not self, then not visible.
      return false;
    });

    console.log(`Displaying ${this.employees.length} employees after filtering.`);
  }

  canEdit(employee: Employee): boolean {
    if (!this.currentUser || !this.currentUser.email) {
      return false;
    }

    // Current user can always edit themselves
    if (employee.email === this.currentUser.email) {
      return true;
    }

    // Must be a reportee to edit
    if (!this.isReporteeOfCurrentUser(employee)) {
      return false;
    }

    // Apply Location and Division-based Edit Permissions (Hierarchical and Prioritized)

    // Rule: If current user has stateEdit, they can edit all reportees within their states.
    if (this.currentUser.stateEdit) {
      return this.hasStateOverlap(employee, this.currentUser) && this.hasDivisionOverlap(employee, this.currentUser);
    }

    // Rule: Else if current user has areaEdit, they can edit all reportees within their districts/areas.
    if (this.currentUser.areaEdit) {
      return (this.hasDistrictOverlap(employee, this.currentUser) || this.hasCityOverlap(employee, this.currentUser)) &&
             this.hasDivisionOverlap(employee, this.currentUser);
    }

    // Rule: Else if current user has cityEdit, they can edit all reportees within their cities.
    if (this.currentUser.cityEdit) {
      return this.hasCityOverlap(employee, this.currentUser) && this.hasDivisionOverlap(employee, this.currentUser);
    }

    // Rule: Else if current user only has division-based editing
    if (this.currentUser.division && this.currentUser.division.length > 0) {
      return this.hasDivisionOverlap(employee, this.currentUser);
    }

    // Default: No edit access
    return false;
  }

  deleteEmployee(employee: Employee) {
    if (!this.canEdit(employee)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Permission Denied',
        detail: 'You do not have permission to delete this employee.'
      });
      return;
    }

    if (confirm(`Are you sure you want to delete ${employee.firstname} ${employee.lastname}?`)) {
      this.allEmployees = this.allEmployees.filter(e => e.email !== employee.email);
      const companyId = this.currentUser?.companyId || 'Dr._Reddys';
      sessionStorage.setItem(`employees_${companyId}`, JSON.stringify(this.allEmployees));
      this.filterEmployeesBasedOnPermissions(); // Re-filter the displayed list after deletion
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `Employee ${employee.firstname} ${employee.lastname} deleted successfully!`
      });
    }
  }

  editEmployee(employee: Employee) {
    if (!this.canEdit(employee)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Permission Denied',
        detail: 'You do not have permission to edit this employee.'
      });
      return;
    }
    this.messageService.add({
      severity: 'info',
      summary: 'Edit Action',
      detail: `Editing employee: ${employee.firstname} ${employee.lastname}`
    });
    console.log('Edit employee:', employee);
    // Implement your actual edit logic here (e.g., open a dialog)
  }

  getNamesFromArray(arr: any[] | null | undefined, key: string): string {
    if (!arr || arr.length === 0) {
      return '';
    }
    return arr
      .map((item) => item && item[key])
      .filter(Boolean)
      .join(', ');
  }
}
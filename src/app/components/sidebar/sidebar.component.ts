import { Component } from '@angular/core';
import { SectionService } from '../../services/section.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  constructor(private sectionService: SectionService) {}

  showSection(section: string): void {
    this.sectionService.setSection(section);
  }
}
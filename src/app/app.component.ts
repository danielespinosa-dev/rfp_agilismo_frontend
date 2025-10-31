import { Component, OnInit } from '@angular/core';
import { SectionService } from './services/section.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'SostenIA Comfama';
  currentSection = 'bienvenida';

  constructor(private sectionService: SectionService) {}

  ngOnInit() {
    this.sectionService.section$.subscribe(section => {
      this.currentSection = section;
    });
  }

  showSection(section: string): void {
    this.sectionService.setSection(section);
  }
}
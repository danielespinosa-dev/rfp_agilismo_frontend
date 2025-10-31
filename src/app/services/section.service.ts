import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SectionService {
  private sectionSubject = new BehaviorSubject<string>('bienvenida');
  section$ = this.sectionSubject.asObservable();

  setSection(section: string) {
    this.sectionSubject.next(section);
  }
}
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProgressService } from '../../services/progress.service';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.css'
})
export class ProgressComponent {
  showProgress$ = this.progressService.progress$;
  constructor(private progressService: ProgressService) {}
}

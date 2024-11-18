import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-404',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './404.component.html',
  styleUrl: './404.component.css'
})
export class error404Component implements OnInit {
  errorMessage: string = 'La page demandée n\'existe pas';
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['message']) {
        this.errorMessage = params['message'];
      }
    });
  }
}

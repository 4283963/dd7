import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLinkActive, RouterLink, RouterOutlet } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLinkActive, RouterLink, RouterOutlet, MatListModule, MatIconModule, MatSidenavModule, MatToolbarModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  navItems = [
    { label: '预约看板', icon: 'event_seat', route: '/reservations' },
    { label: 'AI 节能建议', icon: 'ac_unit', route: '/ai-savings' }
  ];
}

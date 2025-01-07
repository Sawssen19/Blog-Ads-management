import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { UserListService } from './user-list.service';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  userList: User[] = [];

  constructor(
    private usersService: UserListService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.usersService.getUsers().subscribe((users) => {
      this.userList = users;
      this.cdr.detectChanges();
    });
  }
}

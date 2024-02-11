import { ChangeDetectorRef, Component } from '@angular/core';
import { Auth } from 'aws-amplify';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent {
  showFiller = false;
  expanded = false;
  selected = 0;

  nameUser = "";
  email = "";
  initials = "";

  constructor(private utilsService: UtilsService, private df: ChangeDetectorRef) {
    this.utilsService.selectInitials.subscribe(initials => {
      this.initials = initials;
    });
  }

  getUser() {
    const user = JSON.parse(sessionStorage.getItem("user") || "");
    this.nameUser = user.name;
    this.email = user.email;
    this.initials = user.name.split(" ")[0][0] + (user.name.split(" ")[1][0] || "")
    this.df.detectChanges();
  }

  async signOut(): Promise<void> {
    try {
      await Auth.signOut();
    } catch (error) {
      console.error('error signing out: ', error);
    }
  }
}

import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Auth } from 'aws-amplify';
import { I18n, Hub } from 'aws-amplify';
import { translations } from '@aws-amplify/ui-angular';
import { locationAmplify } from './locationAmplify'
import { NavigationEnd, Router } from '@angular/router';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { MatDrawer } from '@angular/material/sidenav';
import { faR, faS, fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { filter } from 'rxjs';
import { APIService } from './API.service';
import { UtilsService } from './services/utils.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogUser } from './shared-components/dialogUser/dialogUser';

I18n.putVocabularies(translations);
I18n.setLanguage('es');
I18n.putVocabularies(locationAmplify);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements AfterViewInit {
  title = 'eki-admin';
  showFiller = false;
  expanded = false;
  isLogging = false;
  nameBottonPush = "";
  name: string = "";
  email: string = "";

  @ViewChild('drawer', { static: true }) public drawer!: MatDrawer;

  // BEFORE LOGUED
  services = {
    async handleSignUp(formData: Record<string, any>) {
      let { username, password, attributes } = formData;
      // console.log("handleSignUp");
      return Auth.signUp({
        username,
        password,
        attributes,
      });
    },
    async handleConfirmSignUp(formData: Record<string, any>) {
      let { username, code } = formData;
      // console.log("handleconfirmSignUp");
      return Auth.confirmSignUp(
        username,
        code
      );
    },
    async handleSignIn(formData: Record<string, any>) {
      let { username, password } = formData;
      // console.log("handleSignIn");
      return Auth.signIn({
        username,
        password,
      });
    },
    async handleConfirmSignIn(formData: Record<string, any>) {
      let { username, code, mfaType } = formData;
      // console.log("handleConfirmSignIn");
      return Auth.confirmSignIn(
        username,
        code,
        mfaType
      );
    },
    async handleForgotPassword(username: string) {
      // console.log("handleForgotPassword");
      return Auth.forgotPassword(username.toString());
    }
  };


  // AFTER LOGUED
  listener = async (data) => {
    // console.log("Listener");
    // console.log(data.payload.event);
    switch (data.payload.event) {
      case 'signIn':
        this.clearSessionStorgae();
        let roolGroups = data.payload.data.signInUserSession.idToken.payload["cognito:groups"]

        try {
          if (roolGroups.includes("admin")) {
            await this.getUser();
          } else {
            this.dialog.open(DialogUser);
            await this.signOut();
          }
        } catch (error) {
          await this.signOut();
        }
        break;
      case 'signUp':
        try {
          console.log('user signed up');
        } catch (error) {
          console.error("error in signUp", error);
        }
        break;
      case 'signOut':
        this.clearSessionStorgae();
        this.router.navigate(['/'])
        this.userIsLogged();
        break;
      case 'signIn_failure':
        console.log('user sign in failed');
        break;
      case 'tokenRefresh':
        console.log('token refresh succeeded');
        // await this.getUser();
        break;
      case 'tokenRefresh_failure':
        console.log('token refresh failed');
        break;
      case 'confirmSignUp':
        console.log('confirmSignUp');
        // await this.getUser();
        break;
      case 'configured':
        console.log('the Auth module is configured');
        break;
      case 'forceNewPassword':
        console.log('Forced new password');
        break;
      case 'confirmResetPassword':
        console.log('confirmResetPassword');
        break;
      case 'verifyUser':
        console.log('verifyUser');
        break;
      case 'signUp_failure':
        console.error('user sign up failed');
        break;
      case 'completeNewPassword_failure':
        console.error('user did not complete new password flow');
        break;
      case 'autoSignIn':
        console.log('auto sign in successful');
        break;
      case 'autoSignIn_failure':
        console.error('auto sign in failed');
        break;
      case 'forgotPassword':
        console.log('password recovery initiated');
        break;
      case 'forgotPassword_failure':
        console.error('password recovery failed');
        break;
      case 'forgotPasswordSubmit':
        console.log('password confirmation successful');
        break;
      case 'forgotPasswordSubmit_failure':
        console.error('password confirmation failed');
        break;
      case 'cognitoHostedUI':
        console.log('Cognito Hosted UI sign in successful');
        break;
      case 'cognitoHostedUI_failure':
        console.error('Cognito Hosted UI sign in failed');
        break;
      case 'customOAuthState':
        console.log('custom state returned from CognitoHosted UI');
        break;
      case 'customState_failure':
        console.error('custom state failure');
        break;
      case 'parsingCallbackUrl':
        console.log('Cognito Hosted UI OAuth url parsing initiated');
        break;
      case 'userDeleted':
        console.log('user deletion successful');
        break;
    }
  }

  constructor(
    private router: Router,
    public library: FaIconLibrary,
    public apiService: APIService,
    private utilsService: UtilsService,
    public dialog: MatDialog
  ) {
    library.addIconPacks(fas, fab, far);

  }

  ngAfterViewInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.pressButtonMenu(event.url)
    });
  }

  pressButtonMenu(url) {

    const buttonsNames = {
      dashboard: "dashboard",
      companies: "companies",
      users: "users",
      teachers: "teachers",
      courses: "courses",
      tests: "tests",
      routes: "routes",
      tickets: "tickets"
    }

    for (var buttonsName in buttonsNames) {
      if (url.toLowerCase().includes(buttonsName.toLowerCase())) {
        this.nameBottonPush = buttonsName
      }
    }
  }

  async ngOnInit(): Promise<void> {
    Hub.listen('auth', this.listener);
    await this.getUser();
  }

  async signOut(): Promise<void> {
    try {
      await Auth.signOut();
      this.clearSessionStorgae();
    } catch (error) {
      console.error('error signing out: ', error);
    }
  }

  clearSessionStorgae() {
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('user');
  }

  selectIndex(index) {

  }

  openMenu() {
    this.toggleMenu(true);
  }

  closeMenu() {
    this.toggleMenu(false);
  }

  toggleMenu(state) {
    this.drawer.toggle(state);
  }

  goToCompany() {
    this.router.navigateByUrl('companies')
  }

  goToUser() {
    this.router.navigateByUrl('users/list-users');
  }

  goToCourses() {
    this.router.navigateByUrl('courses/list-courses');
  }

  goToTest() {
    this.router.navigateByUrl('forms');
  }
  goToRoutes() {
    this.router.navigateByUrl('routes/list-routes');
  }

  goToTeachers() {
    this.router.navigateByUrl('teachers/list-teachers');
  }
  goToInfographics(){
    this.router.navigateByUrl('infographics/list-infographics')
  }
  
  goToTickets() {
    this.router.navigateByUrl('reports/reports');
  }

  goToDashboard() {
    this.router.navigateByUrl('dashboard');
  }

  async getUser(): Promise<void> {
    try {
      const user = await Auth.currentUserInfo();
      const userId = user.attributes["custom:userID"] ? user.attributes["custom:userID"] : user.attributes["sub"]
      sessionStorage.setItem("userId", userId);

      const { name, lastname, email } = await this.apiService.GetUser(userId)
      this.name = `${name} ${lastname}`
      this.email = email || '';
      const sessionItem = JSON.stringify(
        {
          id: userId,
          author: user.username,
          name: this.name,
          email: this.email
        }
      );
      sessionStorage.setItem("user", sessionItem);
      this.isLogging = true;
      let initials = (name!.split(" ")[0][0] + lastname?.split(" ")[0][0]) || "";
      this.utilsService.setInitials(initials);
      this.openMenu();
    } catch {
      this.isLogging = false;
      this.closeMenu();
    }    
  }

  async userIsLogged() {
    try {
      await Auth.currentAuthenticatedUser();
      this.isLogging = true;
      this.openMenu();
      return true;
    } catch {
      this.isLogging = false;
      this.closeMenu();
      return false;
    }
  }
}
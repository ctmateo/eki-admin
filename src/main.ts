import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Amplify, Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
import { AppModule } from './app/app.module';

Amplify.configure(awsconfig);
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

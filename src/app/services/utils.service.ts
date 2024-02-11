import { EventEmitter, Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

import { BehaviorSubject, Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  signIn = new EventEmitter<any>();
  private initials = new BehaviorSubject<any>({});
  public selectInitials = this.initials.asObservable();
  changeIconCourseEvent = new EventEmitter<any>();
  listenerVideo = new EventEmitter<any>();
  timeVideo = new EventEmitter<any>();
  timeVideoTest;
  player;
  constructor(private router: Router) { }

  public changeProfileImage() {
    this.changeIconCourseEvent.emit();
  }

  setInitials(initials: any) {
    this.initials.next(initials);
  }

  public userSignIn(params?: any) {
    this.signIn.emit();
  }

  public sortArray(array: any, prop = 'sortIndex') {
    array.sort((a: any, b: any) => a[prop] - b[prop])
    return array
  }

  public delay(time: number) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  public translateApi(item: any, key: string): any {
    // console.log({item, key});
    let lang = localStorage.getItem("lang") || "es";
    if (item) {
      if (lang === "es") {
        return item[key + 'Es'];
      }
      else if (lang === "ja") {
        return item[key + 'Ja'];
      }
      else if (lang === "en") {
        return item[key];
      }
    }
  }

  goToRouter(url) {
    this.router.navigateByUrl(url);
  }

  goToUrl(url){
    window.open(url, "_blank")
  }

  resetComponent(): void {
    const currentUrl = this.router.url;
    const navigationExtras: NavigationExtras = {
      skipLocationChange: true,
    };
    this.router.navigateByUrl('/', navigationExtras).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  convertToAwsDateTime(date: Date): string {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');
  
    const awsDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
    return awsDateTime;
  }
  convertToDateCollaborator(date: any): string {
    const fecha = typeof date === 'string' ? new Date(date) : date;
  
    if (!(fecha instanceof Date) || isNaN(fecha.getTime())) {
      console.error('Fecha no válida:', date);
      return 'Fecha no válida';
    }
  
    const año = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const dia = fecha.getDate().toString().padStart(2, '0');
    const horas = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    const segs = fecha.getSeconds().toString().padStart(2, '0');
  
    return `${dia}/${mes}/${año}, ${horas}:${minutos}:${segs}`;
  }

  convertToDate(date){
    const año = date.getFullYear();
    const mes = (date.getMonth() + 1).toString().padStart(2, '0');
    const dia = date.getDate().toString().padStart(2, '0');
    
    return `${año}-${mes}-${dia}`;    
  }

}

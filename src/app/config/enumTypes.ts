import { IconName, IconPrefix } from "@fortawesome/free-solid-svg-icons";
import { Role } from "../API.service";

export interface iconsType {
    type: IconPrefix;
    name: IconName;
}

export interface payloadCreateUserAny {
  "role": Role,
  "user": {
    "email": string,
    "name": string,
    "lastname": string,
    "phone": string,
    "profileImageUrl": string
  },
  "admin"?: {
    "rolInCompany": string
  },
  "teacher"?: {
    "descriptionProfile": string,
    "descriptionTeaching": string,
    "keyPhoto": string,
    "keyVideo": string
  },
  "company"?: {
    "nameCompany": string,
    "nit": string,
    "legalName": string,
    "legalSurname": string,
    "legalDocument": string,
    "legalDocumentNumber": string,
    "logoCompany": string,
    "economicSectorID": string,
    "dateUnsubcribe": string,
    "limitUsers": string
  },
  "colaborator"?: {
    "positionInTheCompany": string
  }
}

export const icons: iconsType[] = [
  { type: 'fas', name: 'house-chimney-crack' },
  { type: 'fas', name: 'rocket' },
  { type: 'fas', name: 'user-astronaut' },
  { type: 'fas', name: 'pen-fancy' },
  { type: 'fas', name: 'kit-medical' },
  { type: 'fas', name: 'utensils' },
  { type: 'fas', name: 'sack-dollar' },
  { type: 'fas', name: 'tree' },
  { type: 'fas', name: 'money-bill-trend-up' },
  { type: 'fas', name: 'handshake' },
  { type: 'fas', name: 'jet-fighter' },
  { type: 'fas', name: 'credit-card' },
  { type: 'fas', name: 'cart-flatbed-suitcase' },
  { type: 'fas', name: 'dolly' },
  { type: 'fas', name: 'microchip' },
  { type: 'fas', name: 'briefcase' },
  { type: 'fas', name: 'address-card' },
  { type: 'fas', name: 'gear' },
  { type: 'fas', name: 'hammer' },
  { type: 'fas', name: 'guitar' },
  { type: 'fas', name: 'headset' },
  { type: 'fas', name: 'prescription-bottle' },
  { type: 'fas', name: 'tools' },
  { type: 'fas', name: 'hammer' },
  { type: 'fas', name: 'wrench' },
  { type: 'fas', name: 'cow' },
  { type: 'fas', name: 'hands-holding-child' }
] 

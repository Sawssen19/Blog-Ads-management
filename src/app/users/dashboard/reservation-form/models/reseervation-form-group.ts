import { FormControl } from "@angular/forms";

export interface ReservationFormGroup{
    firstNameCtrl: FormControl<string>,
    lastNameCtrl: FormControl<string>,
    emailCtrl: FormControl<string>,
    phoneNumberCtrl: FormControl<number| null>,
}
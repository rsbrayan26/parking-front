import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { VEHICLES } from "./data/data-parking";

declare var M: any;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  //styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = "parking-front";
  vehicles = VEHICLES;

  constructor(private fb: FormBuilder) {}
  dataVehicle = this.fb.group({
    plate: [
      "",
      [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(7),
        Validators.pattern("^[a-zA-Z]{3}[0-9]{3}$"),
      ],
    ],
  });

  addPlate() {
    console.log(this.dataVehicle.valid);
    let plate: string = this.dataVehicle.value.plate ?? "";
    this.dataVehicle.valid
      ? this.searchPlate(plate)
      : M.toast({ html: "¡Alerta! placa invalida " });
    this.dataVehicle.reset();
  }

  searchPlate(plate: string) {
    let res = this.vehicles.findIndex((item) => plate === item.plate);
    // console.log(this.vehicles[res].departure_time);
    if (res !== -1 && this.vehicles[res].departure_time !== undefined) {
      M.toast({ html: "El vehículo ya salió del establecimiento" });
    } else if (res !== -1 && this.vehicles[res].departure_time === undefined) {
      let departure_time = new Date(Date.now());
      let entry_time = new Date(this.vehicles[res].entry_time);
      let parkingTime = departure_time.getTime() - entry_time.getTime();
      parkingTime = Math.floor(parkingTime / (1000 * 60 * 60));
      parkingTime == 0 ? (parkingTime = 1) : parkingTime;
      let price = parkingTime * 2800;
      this.vehicles[res].departure_time = departure_time;
      this.vehicles[res].price = price;
      console.log(price);
    } else {
      this.vehicles.push({
        entry_time: new Date(Date.now()),
        plate: plate.toUpperCase(),
      });
    }
    console.log(res);
  }
}

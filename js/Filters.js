export class Filters{
  constructor(dates = null,airportCode = null, aircraftType = null) {
    this.dates = dates;
    this.airportCode = airportCode;
    this.aircraftType = aircraftType;
  }

  update(filters){
    if(filters.dates != null){
      this.dates = filters.dates;
    }
    if (filters.airportCode != null ){
      this.airportCode = filters.airportCode;
    }
    if(filters.aircraftType !== null){
      this.aircraftType = filters.aircraftType;
    }
  }
}


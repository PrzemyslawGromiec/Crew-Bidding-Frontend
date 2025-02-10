export class Filters{
  constructor(dates = null, aircraftType = null, airportCode = null) {
    this.dates = dates;
    this.aircraftType = aircraftType;
    this.airportCode = airportCode;
  }

  update(filters){
    if(filters.dates != null){
      this.dates = filters.dates;
    }
    if (filters.airportCode !== null ){
      this.airportCode = filters.airportCode;
    }
    if(filters.aircraftType !== null){
      this.aircraftType = filters.aircraftType;
    }
  }
}


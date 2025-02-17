export class Filters{
  constructor(dates = null, aircraftType = null, airportCode = null,
              minDuration = null, maxDuration = null) {
    this.dates = dates;
    this.aircraftType = aircraftType;
    this.airportCode = airportCode;
    this.minDuration = minDuration;
    this.maxDuration = maxDuration;
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
    if(filters.minDuration !==null) {
      this.minDuration = filters.minDuration;
    }
    if(filters.maxDuration !== null) {
      this.maxDuration = filters.maxDuration;
    }
  }
}

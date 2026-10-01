export class Appointment {
  constructor(
    public readonly id: string,
    public clientId: string,
    public instructorId: string,
    public discipline: string,
    public dateTime: string,
    private _status: 'SCHEDULED' | 'RESCHEDULED' | 'CANCELED' = 'SCHEDULED'
  ) {}

  public get status(): 'SCHEDULED' | 'RESCHEDULED' | 'CANCELED' {
    return this._status;
  }

  public reschedule(newDateTime: string): void {
    this.dateTime = newDateTime;
    this._status = 'RESCHEDULED';
  }

  public cancel(): void {
    this._status = 'CANCELED';
  }
}
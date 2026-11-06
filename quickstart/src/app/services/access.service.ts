import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AccessService {
  private readonly enabled = signal(false);
  readonly adultMode = this.enabled.asReadonly();
  readonly message = signal('');

  toggle() {
    this.enabled.update((value) => !value);
    this.message.set('');
  }
}

import { Inject, Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { SSE_PROVIDER } from 'src/app/utils/tokens/sse.token';

type EventSourceProvider = (url: string, options?: EventSourceInit) => EventSource;

@Injectable({
  providedIn: 'root',
})
export class SseClient {
  constructor(
    private zone: NgZone, 
    @Inject(SSE_PROVIDER) private provideSource: EventSourceProvider
  ) {}

  stream(url: string, options?: EventSourceInit): Observable<string> {
    return new Observable<string>(subscriber => {
      const eventSource = this.provideSource(url, options);

      eventSource.onmessage = (event: MessageEvent) => {
        this.zone.run(() => subscriber.next(event.data));
      };

      eventSource.onerror = (error: Event) => {
        this.zone.run(() => subscriber.error(error));
      };

      return () => {
        eventSource.close();
      };
    });
  }
}

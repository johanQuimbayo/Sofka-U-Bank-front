import { NgZone } from "@angular/core";
import { Observable } from "rxjs";

export default function fromSource(provideSource: () => EventSource, zone: NgZone) {
  return new Observable(observer => {
    const eventSource = provideSource();

    eventSource.onmessage = event => {
      zone.run(() => {
        try {
          observer.next(JSON.parse(event.data))
        } catch (error) {
          eventSource.close();
          observer.error(error)
        }
      })
    }
    
    eventSource.onerror = error => {
      zone.run(() => {
        observer.error(error)
      })
    };
    
    return () => {
      eventSource.close();
    }
  })
}
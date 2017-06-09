import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { Observer } from "rxjs/Observer";

@Injectable()
export class WebSocketService {
    private socket: Subject<MessageEvent>;

    public connect(url: string): Subject<MessageEvent> {
        if (!this.socket) {
            this.socket = this.create(url);
        }
        return this.socket;
    }

    private create(url: string): Subject<MessageEvent> {
        let ws = new WebSocket(url);

        let observable = Observable.create((observer: Observer<MessageEvent>) => {
            ws.onmessage = observer.next.bind(observer);
            ws.onerror = observer.error.bind(observer);
            ws.onclose = observer.complete.bind(observer);

            return ws.close.bind(ws);
        });

        let observer = {
            next: (data) => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify(data));
                }
            }
        }

        return Subject.create(observer, observable);
    }
}